import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronDown,
  Code2,
  Compass,
  ExternalLink,
  GitBranch,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

type Week = {
  week: number;
  title: string;
  description: string;
  skills: string[];
  mission: string;
  missionDetail: string;
  icon: typeof Code2;
  status: "current" | "upcoming";
};

const weeks: Week[] = [
  {
    week: 1,
    title: "Strengthen foundations",
    description: "Turn your JavaScript base into confident UI-building habits.",
    skills: ["JavaScript ES6", "CSS Layout Systems"],
    mission: "Build a responsive portfolio hero",
    missionDetail: "2–3 focused sessions • Foundation mission",
    icon: Code2,
    status: "current",
  },
  {
    week: 2,
    title: "Build with React",
    description: "Learn to compose interfaces from reusable components.",
    skills: ["Components & Props", "State Management"],
    mission: "Build a movie search UI",
    missionDetail: "3 focused sessions • Builder mission",
    icon: Layers3,
    status: "upcoming",
  },
  {
    week: 3,
    title: "Connect to real data",
    description: "Bring real-world information into polished interfaces.",
    skills: ["REST APIs", "Loading & Error States"],
    mission: "Integrate a public weather API",
    missionDetail: "3 focused sessions • Builder mission",
    icon: Compass,
    status: "upcoming",
  },
  {
    week: 4,
    title: "Ship with confidence",
    description: "Make your work usable, visible, and professionally ready.",
    skills: ["Accessibility Checks", "Git Workflow"],
    mission: "Deploy your project and write a README",
    missionDetail: "2 focused sessions • Launch mission",
    icon: GitBranch,
    status: "upcoming",
  },
];

function ReadinessRing() {
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="9"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#progressGradient)"
          strokeLinecap="round"
          strokeWidth="9"
          strokeDasharray="314"
          initial={{ strokeDashoffset: 314 }}
          animate={{ strokeDashoffset: 119 }}
          transition={{ duration: 1.3, delay: 0.25 }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="120" y2="120">
            <stop stopColor="#22D3EE" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="text-center">
        <p className="text-3xl font-black tracking-tight text-white">62%</p>
        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Ready
        </p>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();

  return (
    <AppShell eyebrow="Career path" title="My Roadmap">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Career Paths</span>
            <span>/</span>
            <span className="text-cyan-300">Frontend Developer</span>
          </div>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Your path to Frontend Developer.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            A four-week build plan shaped around your current Skill DNA.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-[#0d1a36]/80 p-5 shadow-2xl shadow-cyan-950/20 sm:p-7"
        >
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />
          <div className="absolute left-[45%] top-[-120px] h-56 w-56 rounded-full bg-violet-500/14 blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
                <Code2 className="h-7 w-7 text-cyan-300" />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.17em] text-cyan-300">
                  SELECTED CAREER PATH
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">
                  Frontend Developer
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                  Build accessible, responsive digital experiences people love to use.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["HTML & CSS", "JavaScript", "React", "REST APIs", "Git"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/8 bg-white/[0.045] px-2.5 py-1 text-[10px] font-semibold text-slate-300"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-[#071126]/45 px-4 py-3">
              <ReadinessRing />
              <div>
                <p className="text-sm font-bold text-white">4 of 7 core skills</p>
                <p className="mt-1 max-w-[150px] text-xs leading-5 text-slate-500">
                  developing with focused practice
                </p>
                <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-100">
                  View skill gap
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.17em] text-cyan-300">
                  YOUR BUILD PLAN
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  Four weeks. Visible momentum.
                </h3>
              </div>

              <span className="rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-slate-400">
                Week 1 of 4
              </span>
            </div>

            <div className="relative space-y-4 before:absolute before:bottom-10 before:left-[27px] before:top-10 before:w-px before:bg-gradient-to-b before:from-cyan-400/55 before:via-violet-500/25 before:to-transparent">
              {weeks.map((week, index) => {
                const Icon = week.icon;
                const isCurrent = week.status === "current";

                return (
                  <motion.article
                    key={week.week}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + index * 0.08 }}
                    className={`relative ml-0 rounded-[24px] border p-5 pl-[76px] transition sm:p-6 sm:pl-[82px] ${
                      isCurrent
                        ? "border-cyan-300/22 bg-gradient-to-r from-cyan-400/[0.09] via-violet-500/[0.07] to-transparent shadow-xl shadow-cyan-950/15"
                        : "border-white/8 bg-white/[0.025]"
                    }`}
                  >
                    <div
                      className={`absolute left-3 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-2xl border ${
                        isCurrent
                          ? "border-cyan-300/35 bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.38)]"
                          : "border-white/10 bg-[#111f3c] text-slate-400"
                      }`}
                    >
                      {isCurrent ? (
                        <Sparkles className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-black">{week.week}</span>
                      )}
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {isCurrent && (
                            <span className="rounded-full bg-cyan-300 px-2 py-1 text-[9px] font-black tracking-[0.12em] text-slate-950">
                              CURRENT WEEK
                            </span>
                          )}
                          <span className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
                            WEEK {week.week}
                          </span>
                        </div>

                        <h4 className="mt-3 text-lg font-black text-white">
                          {week.title}
                        </h4>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                          {week.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {week.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-white/8 bg-black/10 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {!isCurrent && (
                        <ChevronDown className="h-5 w-5 shrink-0 text-slate-600" />
                      )}
                    </div>

                    {isCurrent && (
                      <div className="mt-5 rounded-2xl border border-cyan-300/13 bg-[#071528]/60 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex gap-3">
                            <div className="rounded-xl bg-violet-500/13 p-2.5">
                              <Icon className="h-5 w-5 text-violet-300" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
                                THIS WEEK’S MISSION
                              </p>
                              <p className="mt-1 text-sm font-bold text-white">
                                {week.mission}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {week.missionDetail}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate("/skills-lab/task-1")}
                            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-950/50 transition hover:from-violet-400 hover:to-cyan-500"
                          >
                            Open mission
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-[26px] border border-white/10 bg-[#0c1730]/78 p-5 shadow-xl shadow-black/15 backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/18 bg-violet-500/10">
              <Target className="h-5 w-5 text-violet-300" />
            </div>
            <p className="mt-5 text-[10px] font-bold tracking-[0.16em] text-cyan-300">
              WHY THIS PLAN?
            </p>
            <h3 className="mt-2 text-xl font-black text-white">
              Built from your Skill DNA.
            </h3>

            <div className="mt-5 space-y-4">
              {[
                "Strong JavaScript base detected",
                "React is your highest-impact next skill",
                "SQL remains a parallel growth area",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/12">
                    <Check className="h-3 w-3 text-emerald-300" />
                  </div>
                  <p className="text-xs leading-5 text-slate-400">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/12 bg-amber-400/[0.045] p-3.5">
              <div className="flex gap-2.5">
                <BookOpenCheck className="h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-xs leading-5 text-slate-300">
                  Every mission creates evidence of your skills—not just a completion badge.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}