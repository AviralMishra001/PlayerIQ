import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Check,
  Globe2,
  Map,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tone = "cyan" | "mint" | "amber" | "coral";

function OrbitalNode({
  className,
  label,
  tone = "cyan",
}: {
  className: string;
  label: string;
  tone?: Tone;
}) {
  const tones: Record<Tone, string> = {
    cyan: "border-cyan-300/50 bg-cyan-400/20 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.38)]",
    mint: "border-emerald-300/50 bg-emerald-400/20 text-emerald-100 shadow-[0_0_35px_rgba(52,211,153,0.35)]",
    amber: "border-amber-300/50 bg-amber-400/20 text-amber-100 shadow-[0_0_35px_rgba(251,191,36,0.35)]",
    coral: "border-rose-300/50 bg-rose-400/20 text-rose-100 shadow-[0_0_35px_rgba(251,113,133,0.35)]",
  };

  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: tone === "cyan" ? 0 : 0.45,
      }}
      className={`absolute z-20 flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold backdrop-blur-xl ${tones[tone]} ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </motion.div>
  );
}

function SkillDnaVisual() {
  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1730]/80 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-xl">
      <div className="absolute inset-0 aurora-grid opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(139,92,246,0.28),transparent_24%),radial-gradient(circle_at_70%_25%,rgba(34,211,238,0.16),transparent_25%),radial-gradient(circle_at_35%_76%,rgba(52,211,153,0.11),transparent_25%)]" />

      <div className="relative z-30 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
            YOUR SKILL DNA
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Signals becoming a direction
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
          Live analysis
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/15 bg-violet-500/10" />
      <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
      <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 700 540"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M350 265 C250 145 160 150 105 100 M350 265 C480 165 555 125 608 178 M350 265 C505 315 547 390 586 432 M350 265 C216 350 175 410 122 435 M350 265 C275 260 230 238 193 215 M350 265 C410 255 455 270 505 286"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="5 9"
        />
        <defs>
          <linearGradient id="lineGradient" x1="90" y1="70" x2="600" y2="440">
            <stop stopColor="#22D3EE" />
            <stop offset="0.48" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute left-1/2 top-1/2 z-20 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-violet-200/35 bg-[#101f42]/90 shadow-[0_0_70px_rgba(139,92,246,0.55)]"
      >
        <BrainCircuit className="mb-2 h-7 w-7 text-violet-300" />
        <span className="text-3xl font-black tracking-tight text-white">62</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Readiness
        </span>
      </motion.div>

      <OrbitalNode className="left-[8%] top-[21%]" label="JavaScript" tone="cyan" />
      <OrbitalNode className="right-[6%] top-[26%]" label="React" tone="mint" />
      <OrbitalNode className="right-[8%] bottom-[16%]" label="Git" tone="mint" />
      <OrbitalNode className="left-[8%] bottom-[15%]" label="SQL Joins" tone="amber" />
      <OrbitalNode className="left-[20%] top-[44%]" label="Python" tone="cyan" />
      <OrbitalNode className="right-[20%] top-[48%]" label="UI Systems" tone="coral" />

      <div className="absolute bottom-6 left-6 right-6 z-30 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-2 text-center text-[10px] text-slate-300">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-400" />
          Strength
        </div>
        <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-2 text-center text-[10px] text-slate-300">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />
          Growing
        </div>
        <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-2 text-center text-[10px] text-slate-300">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-rose-400" />
          Priority
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden px-5 py-6 text-slate-100 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
            <div className="absolute h-5 w-5 rounded-full border-2 border-white/90" />
            <div className="absolute h-2 w-2 rounded-full bg-white" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-white">
              Sahyog <span className="text-cyan-300">AI</span>
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Career Intelligence
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-sm text-slate-400">Already exploring?</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/10"
          >
            Sign in
          </button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 pb-12 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:pt-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1.5 text-xs font-bold tracking-[0.13em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            CAREER INTELLIGENCE FOR BHARAT
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.03] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Your future has a map.
            <span className="mt-2 block bg-gradient-to-r from-violet-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
              Let’s find yours.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Sahyog AI identifies your real skill gaps, turns them into a career
            plan, and helps you prove what you can do—in Hindi + English.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              {
                icon: BrainCircuit,
                label: "Personalised",
                text: "Skill Scan",
                tone: "text-violet-300",
              },
              {
                icon: Map,
                label: "Role-wise",
                text: "Roadmap",
                tone: "text-cyan-300",
              },
              {
                icon: BadgeCheck,
                label: "Practical",
                text: "Skill Proof",
                tone: "text-emerald-300",
              },
            ].map(({ icon: Icon, label, text, tone }) => (
              <div
                key={text}
                className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 backdrop-blur-sm"
              >
                <Icon className={`mb-3 h-5 w-5 ${tone}`} />
                <p className="text-xs font-semibold text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-bold text-white">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/diagnostic")}
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-950/60 transition hover:scale-[1.02] hover:from-violet-400 hover:to-cyan-500"
            >
              Start my Skill Scan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate("/roadmap")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
            >
              <Globe2 className="h-4 w-4" />
              Explore career paths
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <Check className="h-4 w-4 text-emerald-400" />
            Built for focused learning—not generic advice.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative"
        >
          <div className="absolute -right-20 top-12 h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />
          <div className="absolute -left-12 bottom-4 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px]" />

          <SkillDnaVisual />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="absolute -bottom-5 -left-3 z-40 max-w-[245px] rounded-2xl border border-white/12 bg-[#132446]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:-left-8"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-cyan-400/15 p-2">
                <Sparkles className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sahyog Insight</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  Your strongest momentum is in{" "}
                  <span className="font-semibold text-cyan-200">
                    Web Development.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
            className="absolute -right-2 top-20 z-40 rounded-2xl border border-emerald-300/20 bg-[#112d35]/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:-right-8"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-400/15 p-2">
                <BadgeCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">React Components</p>
                <p className="mt-0.5 text-[11px] text-emerald-200">
                  Level 1 • Earned
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}