import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Code2,
  Crosshair,
  Database,
  GitBranch,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

type NodeTone = "strong" | "growing" | "priority";

const nodeStyles: Record<NodeTone, string> = {
  strong:
    "border-cyan-300/50 bg-cyan-400/18 text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.34)]",
  growing:
    "border-amber-300/50 bg-amber-400/18 text-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.28)]",
  priority:
    "border-rose-300/50 bg-rose-400/18 text-rose-100 shadow-[0_0_32px_rgba(251,113,133,0.28)]",
};

function SkillNode({
  label,
  tone,
  className,
}: {
  label: string;
  tone: NodeTone;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      className={`absolute z-20 flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold backdrop-blur-xl ${nodeStyles[tone]} ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </motion.div>
  );
}

function SkillDnaConstellation() {
  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[30px] border border-white/10 bg-[#09172f]/75 p-6 shadow-2xl shadow-black/25">
      <div className="absolute inset-0 aurora-grid opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.28),transparent_24%),radial-gradient(circle_at_73%_30%,rgba(34,211,238,0.13),transparent_23%),radial-gradient(circle_at_25%_78%,rgba(52,211,153,0.12),transparent_26%)]" />

      <div className="relative z-30 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-cyan-300">
            YOUR SKILL DNA
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Built from 12 learning signals
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-slate-300">
          AI-mapped profile
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 h-[356px] w-[356px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      <div className="absolute left-1/2 top-1/2 h-[282px] w-[282px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/13 bg-violet-500/8" />
      <div className="absolute left-1/2 top-1/2 h-[206px] w-[206px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/18" />

      <svg
        className="absolute inset-0 h-full w-full opacity-75"
        viewBox="0 0 720 540"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M360 272 C262 145 162 142 102 118 M360 272 C465 142 552 126 622 177 M360 272 C502 318 570 378 610 440 M360 272 C222 343 170 400 115 436 M360 272 C274 268 236 245 196 224 M360 272 C438 273 489 270 536 293"
          stroke="url(#dnaLine)"
          strokeWidth="2"
          strokeDasharray="5 8"
        />
        <defs>
          <linearGradient id="dnaLine" x1="100" y1="120" x2="620" y2="440">
            <stop stopColor="#22D3EE" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute left-1/2 top-1/2 z-20 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-violet-200/40 bg-[#13284b]/90 shadow-[0_0_85px_rgba(139,92,246,0.55)]"
      >
        <Sparkles className="mb-2 h-6 w-6 text-violet-300" />
        <p className="text-4xl font-black tracking-tight text-white">62%</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Career readiness
        </p>
      </motion.div>

      <SkillNode label="JavaScript" tone="strong" className="left-[6%] top-[22%]" />
      <SkillNode label="React" tone="strong" className="right-[6%] top-[25%]" />
      <SkillNode label="Git" tone="strong" className="right-[8%] bottom-[16%]" />
      <SkillNode label="SQL Joins" tone="growing" className="left-[8%] bottom-[15%]" />
      <SkillNode label="Python" tone="strong" className="left-[20%] top-[46%]" />
      <SkillNode label="Data Visualisation" tone="priority" className="right-[15%] top-[48%]" />

      <div className="absolute bottom-5 left-5 right-5 z-30 flex flex-wrap gap-3 rounded-2xl border border-white/7 bg-black/15 px-4 py-3 text-[10px] font-semibold text-slate-300 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-cyan-400" />
          Strength
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-amber-400" />
          Growing
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-rose-400" />
          Priority
        </span>
      </div>
    </div>
  );
}

function InsightRow({
  icon: Icon,
  title,
  subtitle,
  tone,
}: {
  icon: typeof Code2;
  title: string;
  subtitle: string;
  tone: "mint" | "amber" | "coral";
}) {
  const tones = {
    mint: "border-emerald-300/15 bg-emerald-400/8 text-emerald-300",
    amber: "border-amber-300/15 bg-amber-400/8 text-amber-300",
    coral: "border-rose-300/15 bg-rose-400/8 text-rose-300",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/7 bg-white/[0.025] p-3.5">
      <div className={`rounded-xl border p-2.5 ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function SkillDnaResultsPage() {
  const navigate = useNavigate();

  return (
    <AppShell eyebrow="Skill Scan complete" title="Your Skill DNA">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <p className="text-[11px] font-bold tracking-[0.18em] text-cyan-300">
            SAHYOG ANALYSIS COMPLETE
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
            Aviral, your Skill DNA is ready.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            You have a strong technical base. The next move is turning that
            base into visible, role-ready proof.
          </p>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SkillDnaConstellation />

          <div className="space-y-5">
            <section className="rounded-[28px] border border-white/10 bg-[#0c1730]/78 p-5 shadow-xl shadow-black/15 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300">
                    WHAT SAHYOG FOUND
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white">
                    Your learning signals
                  </h3>
                </div>
                <div className="rounded-xl border border-violet-300/18 bg-violet-500/10 p-2.5">
                  <Lightbulb className="h-5 w-5 text-violet-300" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <InsightRow
                  icon={Code2}
                  title="JavaScript Fundamentals"
                  subtitle="Strong foundation detected"
                  tone="mint"
                />
                <InsightRow
                  icon={GitBranch}
                  title="Git & Version Control"
                  subtitle="Ready to build on"
                  tone="mint"
                />
                <InsightRow
                  icon={Database}
                  title="SQL Joins"
                  subtitle="Fastest high-impact win"
                  tone="amber"
                />
                <InsightRow
                  icon={Crosshair}
                  title="Advanced React Patterns"
                  subtitle="Priority growth area"
                  tone="coral"
                />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[28px] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(139,92,246,0.14))] p-5 shadow-xl shadow-cyan-950/20 sm:p-6">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative">
                <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-200">
                  YOUR NEXT BEST MOVE
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                  Explore Frontend Developer
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  You already match <span className="font-bold text-cyan-200">62%</span> of
                  its core learning signals.
                </p>

                <button
                  onClick={() => navigate("/roadmap")}
                  className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-100"
                >
                  Build my roadmap
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Target,
              label: "Fastest win",
              value: "SQL joins",
              text: "A focused skill to unlock data confidence.",
              color: "text-amber-300",
            },
            {
              icon: Sparkles,
              label: "Best-fit path",
              value: "Frontend Developer",
              text: "Where your current strengths create momentum.",
              color: "text-cyan-300",
            },
            {
              icon: Check,
              label: "Practice style",
              value: "Build → feedback → improve",
              text: "Learn through proof, not passive completion.",
              color: "text-emerald-300",
            },
          ].map(({ icon: Icon, label, value, text, color }) => (
            <motion.div
              key={label}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition"
            >
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-sm font-black text-white">{value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}