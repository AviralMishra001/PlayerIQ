import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Mic,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

type Question = {
  id: number;
  category: string;
  difficulty: number;
  text: string;
  helper: string;
  options: { id: string; text: string }[];
};

const questions: Question[] = [
  {
    id: 1,
    category: "PROGRAMMING FOUNDATIONS",
    difficulty: 1,
    text: "What is the output of print(type(5/2)) in Python 3?",
    helper: "Choose the answer that best describes the returned data type.",
    options: [
      { id: "A", text: "int" },
      { id: "B", text: "float" },
      { id: "C", text: "str" },
      { id: "D", text: "error" },
    ],
  },
  {
    id: 2,
    category: "WEB DEVELOPMENT",
    difficulty: 1,
    text: "Which keyword declares a constant variable in JavaScript?",
    helper: "Think about modern JavaScript variable declarations.",
    options: [
      { id: "A", text: "var" },
      { id: "B", text: "let" },
      { id: "C", text: "const" },
      { id: "D", text: "static" },
    ],
  },
  {
    id: 3,
    category: "DATA & SQL",
    difficulty: 1,
    text: "What does WHERE do in SQL?",
    helper: "Choose the answer that best describes its purpose.",
    options: [
      { id: "A", text: "Sorts rows" },
      { id: "B", text: "Filters rows" },
      { id: "C", text: "Groups rows" },
      { id: "D", text: "Joins tables" },
    ],
  },
  {
    id: 4,
    category: "PROBLEM SOLVING",
    difficulty: 1,
    text: "Which data structure uses LIFO order?",
    helper: "LIFO means Last In, First Out.",
    options: [
      { id: "A", text: "Queue" },
      { id: "B", text: "Stack" },
      { id: "C", text: "Array" },
      { id: "D", text: "Tree" },
    ],
  },
];

function DifficultyDots({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty ${difficulty} out of 3`}>
      {[1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`h-1.5 w-1.5 rounded-full ${
            dot <= difficulty ? "bg-cyan-300" : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function DiagnosticPage() {
  const [index, setIndex] = useState(2);
  const [answers, setAnswers] = useState<Record<number, string>>({
    3: "B",
  });
  const navigate = useNavigate();

  const question = questions[index];
  const selected = answers[question.id];
  const progress = ((index + 1) / 12) * 100;

  const handleContinue = () => {
    if (!selected) return;

    if (index === questions.length - 1) {
      navigate("/diagnostic/results");
      return;
    }

    setIndex((current) => current + 1);
  };

  const handleBack = () => {
    if (index === 0) {
      navigate("/onboarding");
      return;
    }
    setIndex((current) => current - 1);
  };

  return (
    <AppShell eyebrow="Personalised assessment" title="Skill Scan">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-slate-400">
              A few focused questions. A career plan built around you.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/8 px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Saved automatically
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1730]/85 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="border-b border-white/8 px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-cyan-200">
                    {question.category}
                  </span>
                  <DifficultyDots difficulty={question.difficulty} />
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span>
                    Question <span className="text-white">{index + 1}</span> / 12
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-cyan-300" />
                    ~1 min
                  </span>
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/6">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400"
                />
              </div>
            </div>

            <div className="min-h-[460px] px-6 py-9 sm:px-8 sm:py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="max-w-3xl text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                    {question.text}
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                    {question.helper}
                  </p>

                  <div className="mt-9 grid gap-3">
                    {question.options.map((option) => {
                      const isSelected = selected === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: option.id,
                            }))
                          }
                          className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                            isSelected
                              ? "border-violet-300/45 bg-gradient-to-r from-violet-500/20 to-cyan-400/10 shadow-[0_0_34px_rgba(139,92,246,0.18)]"
                              : "border-white/8 bg-white/[0.025] hover:border-cyan-300/25 hover:bg-white/[0.055]"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition ${
                              isSelected
                                ? "border-cyan-200/50 bg-cyan-300 text-slate-950"
                                : "border-white/10 bg-[#111e39] text-slate-400 group-hover:border-cyan-300/30 group-hover:text-cyan-200"
                            }`}
                          >
                            {isSelected ? <Check className="h-4 w-4" /> : option.id}
                          </span>

                          <span
                            className={`font-semibold ${
                              isSelected ? "text-white" : "text-slate-300"
                            }`}
                          >
                            {option.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                    Your answers map skills—they do not rank you.
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-white/8 px-6 py-5 sm:px-8">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                onClick={handleContinue}
                disabled={!selected}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/50 transition hover:from-violet-400 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {index === questions.length - 1 ? "View my Skill DNA" : "Continue"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-[#0c1730]/70 p-5 shadow-xl shadow-black/15 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/12">
                <Sparkles className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300">
                  SAHYOG IS LISTENING
                </p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  Building your Skill DNA
                </p>
              </div>
            </div>

            <div className="mt-7 flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-white/7 bg-[#081120]/70">
              <div className="flex items-center gap-1">
                {[18, 34, 50, 26, 62, 38, 21, 48, 30, 56, 25].map((height, itemIndex) => (
                  <motion.span
                    key={`${height}-${itemIndex}`}
                    animate={{ height: [height * 0.45, height, height * 0.55] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: itemIndex * 0.08,
                      ease: "easeInOut",
                    }}
                    className="w-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-300"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>

            <button
              disabled
              className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-2.5 text-xs font-semibold text-slate-500"
            >
              <Mic className="h-4 w-4" />
              Voice response — coming soon
            </button>

            <div className="mt-7 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                Learning signals
              </p>

              {[
                { label: "Programming Fundamentals", status: "Strong", tone: "mint" },
                { label: "Data & SQL", status: "Analysing", tone: "cyan" },
                { label: "Career Readiness", status: "Next", tone: "slate" },
              ].map(({ label, status, tone }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/7 bg-white/[0.025] p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-300">{label}</p>
                    <span
                      className={`text-[10px] font-bold ${
                        tone === "mint"
                          ? "text-emerald-300"
                          : tone === "cyan"
                            ? "text-cyan-300"
                            : "text-slate-500"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          tone === "mint" ? "78%" : tone === "cyan" ? "58%" : "22%",
                      }}
                      transition={{ duration: 0.9, delay: 0.25 }}
                      className={`h-full rounded-full ${
                        tone === "mint"
                          ? "bg-emerald-400"
                          : tone === "cyan"
                            ? "bg-cyan-400"
                            : "bg-slate-600"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-400/[0.045] p-3">
              <div className="flex gap-2">
                <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <p className="text-xs leading-5 text-slate-300">
                  Take your time. Sahyog values how you think, not just how
                  quickly you answer.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}