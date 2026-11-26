"""
Seed tasks. Requires seed_skills.py to have run first.
Run: python -m scripts.seed_tasks
"""
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.skill import Skill
from app.models.task import Task
from sqlalchemy import select

# (title, description, skill_name, difficulty, starter_code, test_cases)
CODING_TASKS = [
    ("Reverse a String", "Write `solve(s)` that returns the reversed string.", "strings", 1,
     "def solve(s):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": ["hello"], "expected": "olleh"}, {"input": [""], "expected": ""}]}),
    ("Find Maximum in Array", "Write `solve(arr)` that returns the max value in a list of ints.", "arrays", 1,
     "def solve(arr):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": [[1, 5, 2]], "expected": 5}, {"input": [[-1, -5]], "expected": -1}]}),
    ("FizzBuzz", "Write `solve(n)` returning a list 1..n with multiples of 3->'Fizz', 5->'Buzz', both->'FizzBuzz'.", "control_flow", 1,
     "def solve(n):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": [5], "expected": [1, 2, "Fizz", 4, "Buzz"]}]}),
    ("Sum of Digits", "Write `solve(n)` that returns the sum of digits of a non-negative int n.", "functions", 1,
     "def solve(n):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": [123], "expected": 6}, {"input": [0], "expected": 0}]}),
    ("Fibonacci (Recursive)", "Write `solve(n)` returning the nth Fibonacci number (0-indexed) using recursion.", "recursion", 2,
     "def solve(n):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": [0], "expected": 0}, {"input": [6], "expected": 8}]}),
    ("Palindrome Check", "Write `solve(s)` returning True if s reads the same forwards and backwards.", "strings", 2,
     "def solve(s):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": ["racecar"], "expected": True}, {"input": ["hello"], "expected": False}]}),
    ("Valid Parentheses", "Write `solve(s)` returning True if brackets in s are balanced ()[]{}.", "data_structures_stack_queue", 2,
     "def solve(s):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": ["()[]{}"], "expected": True}, {"input": ["(]"], "expected": False}]}),
    ("Binary Search", "Write `solve(arr, target)` returning the index of target in sorted arr, or -1.", "sorting_searching", 2,
     "def solve(arr, target):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": [[1, 3, 5, 7], 5], "expected": 2}, {"input": [[1, 3, 5], 4], "expected": -1}]}),
    ("Two Sum", "Write `solve(nums, target)` returning indices of two numbers that add to target.", "hashing", 2,
     "def solve(nums, target):\n    pass\n",
     {"function_name": "solve", "cases": [{"input": [[2, 7, 11, 15], 9], "expected": [0, 1]}]}),
    ("Bug Fix: Off-by-one Loop", "Fix `solve(arr)` so it correctly sums all elements (currently skips the last one).", "debugging", 1,
     "def solve(arr):\n    total = 0\n    for i in range(len(arr) - 1):\n        total += arr[i]\n    return total\n",
     {"function_name": "solve", "cases": [{"input": [[1, 2, 3]], "expected": 6}, {"input": [[5]], "expected": 5}]}),
]

DATA_TASKS = [
    ("Clean Missing Values", "Given a list of numbers with `None` gaps, submit output with Nones replaced by the column mean.",
     "data_cleaning", 2, {"cases": [{"expected": [1, 2, 3, 2, 5]}]}),
    ("Compute Column Average", "Given a dataset, submit the average of the 'score' column as `output`.",
     "basic_stats", 1, {"cases": [{"expected": 82.5}]}),
    ("Group-By Aggregation", "Given sales data, submit total revenue per region as `output` (a dict).",
     "data_aggregation", 2, {"cases": [{"expected": {"north": 500, "south": 300}}]}),
    ("Identify Outliers", "Given a numeric list, submit the values more than 2 std-devs from the mean as `output`.",
     "hypothesis_testing", 3, {"cases": [{"expected": [150]}]}),
    ("Pick the Right Chart", "Given a scenario description, submit the best chart type as `output` (string).",
     "visualization", 1, {"cases": [{"expected": "bar chart"}]}),
]

COMMUNICATION_TASKS = [
    ("Write a Follow-up Email", "Write a professional follow-up email after a job interview.",
     "email_writing", 1, {"keywords": ["thank you", "interview", "opportunity"], "min_words": 40}),
    ("Write a Resume Bullet Point", "Write a resume bullet point describing a project you led, with a quantified result.",
     "resume_writing", 1, {"keywords": ["led", "result", "%"], "min_words": 15}),
    ("Pitch Your Idea", "Write a 60-second elevator pitch for a mobile app idea.",
     "pitch_communication", 2, {"keywords": ["problem", "solution", "users"], "min_words": 50}),
]


async def _get_skill_id(db, name: str) -> int | None:
    skill = (await db.execute(select(Skill).where(Skill.name == name))).scalar_one_or_none()
    return skill.id if skill else None


async def seed():
    async with AsyncSessionLocal() as db:
        existing_titles = {t.title for t in (await db.execute(select(Task))).scalars().all()}
        count = 0

        for title, description, skill_name, difficulty, starter_code, test_cases in CODING_TASKS:
            if title in existing_titles:
                continue
            skill_id = await _get_skill_id(db, skill_name)
            if not skill_id:
                print(f"Skipping '{title}' — unknown skill '{skill_name}'")
                continue
            db.add(Task(
                type="coding", title=title, description=description, skill_id=skill_id,
                difficulty=difficulty, starter_code=starter_code, test_cases=test_cases,
            ))
            count += 1

        for title, description, skill_name, difficulty, test_cases in DATA_TASKS:
            if title in existing_titles:
                continue
            skill_id = await _get_skill_id(db, skill_name)
            if not skill_id:
                print(f"Skipping '{title}' — unknown skill '{skill_name}'")
                continue
            db.add(Task(
                type="data", title=title, description=description, skill_id=skill_id,
                difficulty=difficulty, test_cases=test_cases,
            ))
            count += 1

        for title, description, skill_name, difficulty, rubric in COMMUNICATION_TASKS:
            if title in existing_titles:
                continue
            skill_id = await _get_skill_id(db, skill_name)
            if not skill_id:
                print(f"Skipping '{title}' — unknown skill '{skill_name}'")
                continue
            db.add(Task(
                type="communication", title=title, description=description, skill_id=skill_id,
                difficulty=difficulty, rubric=rubric,
            ))
            count += 1

        await db.commit()
        print(f"Seeded {count} tasks (10 coding, 5 data, 3 communication).")


if __name__ == "__main__":
    asyncio.run(seed())
