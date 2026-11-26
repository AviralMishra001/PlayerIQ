"""
Task evaluator.

SECURITY NOTE (matches spec §1: "sandboxed later"): the coding evaluator here
executes submitted Python with a restricted builtins dict and a wall-clock
timeout as a baseline safeguard. This is NOT a production-grade sandbox —
it does not stop CPU/memory exhaustion or filesystem/network access attempts
in more creative ways. Before accepting real user traffic, run submissions in
an isolated subprocess or container (e.g. gVisor, firecracker, nsjail) instead
of in-process exec(). The function signature below is stable so swapping the
execution backend later doesn't touch call sites.
"""
import signal
from typing import Any

from app.models.task import Task

_SAFE_BUILTINS = {
    "len": len, "range": range, "enumerate": enumerate, "sum": sum, "min": min, "max": max,
    "sorted": sorted, "reversed": reversed, "abs": abs, "round": round, "map": map, "filter": filter,
    "list": list, "dict": dict, "set": set, "tuple": tuple, "str": str, "int": int, "float": float,
    "bool": bool, "zip": zip, "any": any, "all": all,
}


class _Timeout(Exception):
    pass


def _run_with_timeout(fn, args, seconds: int = 3):
    def _handler(signum, frame):
        raise _Timeout()

    old_handler = signal.signal(signal.SIGALRM, _handler)
    signal.alarm(seconds)
    try:
        return fn(*args)
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old_handler)


def _evaluate_coding(task: Task, submission: dict) -> tuple[float, str]:
    code = submission.get("code", "")
    test_cases = task.test_cases or {}
    function_name = test_cases.get("function_name", "solve")
    cases = test_cases.get("cases", [])
    if not cases:
        return 0.0, "No test cases configured for this task."

    namespace: dict[str, Any] = {"__builtins__": _SAFE_BUILTINS}
    try:
        exec(code, namespace)
    except Exception as e:
        return 0.0, f"Code failed to compile/run: {e}"

    fn = namespace.get(function_name)
    if not callable(fn):
        return 0.0, f"Expected a function named '{function_name}'."

    passed = 0
    failures = []
    for i, case in enumerate(cases):
        args = case.get("input", [])
        expected = case.get("expected")
        try:
            actual = _run_with_timeout(fn, args, seconds=3)
        except _Timeout:
            failures.append(f"Case {i + 1}: timed out")
            continue
        except Exception as e:
            failures.append(f"Case {i + 1}: raised {e}")
            continue
        if actual == expected:
            passed += 1
        else:
            failures.append(f"Case {i + 1}: expected {expected!r}, got {actual!r}")

    score = passed / len(cases)
    feedback = f"Passed {passed}/{len(cases)} test cases."
    if failures:
        feedback += " " + "; ".join(failures[:3])
    return score, feedback


def _evaluate_data(task: Task, submission: dict) -> tuple[float, str]:
    test_cases = task.test_cases or {}
    cases = test_cases.get("cases", [])
    if not cases:
        return 0.0, "No expected outputs configured for this task."

    submitted_output = submission.get("output")
    passed = 0
    for case in cases:
        if submitted_output == case.get("expected"):
            passed += 1
    score = passed / len(cases)
    feedback = f"Matched {passed}/{len(cases)} expected outputs."
    return score, feedback


def _evaluate_communication(task: Task, submission: dict) -> tuple[float, str]:
    text = (submission.get("text") or "").strip()
    rubric = task.rubric or {}
    keywords: list[str] = rubric.get("keywords", [])
    min_words: int = rubric.get("min_words", 0)

    word_count = len(text.split())
    length_ok = word_count >= min_words

    hits = sum(1 for kw in keywords if kw.lower() in text.lower())
    keyword_score = (hits / len(keywords)) if keywords else 1.0
    length_score = 1.0 if length_ok else word_count / max(min_words, 1)

    score = round((keyword_score * 0.6 + length_score * 0.4), 3)
    feedback = f"Word count: {word_count} (min {min_words}). Keywords matched: {hits}/{len(keywords)}."
    if not length_ok:
        feedback += " Response is shorter than the recommended length."
    return score, feedback


def evaluate_task_submission(task: Task, submission: dict) -> dict:
    """Returns {"score": float, "feedback": str}. Dispatches by task.type."""
    if task.type == "coding":
        score, feedback = _evaluate_coding(task, submission)
    elif task.type == "data":
        score, feedback = _evaluate_data(task, submission)
    elif task.type == "communication":
        score, feedback = _evaluate_communication(task, submission)
    else:
        score, feedback = 0.0, f"Unknown task type '{task.type}'."
    return {"score": round(score, 4), "feedback": feedback}
