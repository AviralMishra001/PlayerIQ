import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  CircleCheck,
  Code2,
  Copy,
  Lightbulb,
  Play,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Trophy,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";

const starterCode = `export function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
    </article>
  );
}`;

export default function SkillsLabTaskPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(starterCode);
  const [submitted, setSubmitted] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell eyebrow="Skills Lab" title="Repair the Product Card">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <button
              onClick={() => navigate("/roadmap")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-cyan-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              My Roadmap / Week 1
            </button>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Repair the Product Card
              </h2>
              <span className="rounded-full border border-violet-300/18 bg-violet-500/10 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-violet-200">
                BUILDER MISSION
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              A practical React mission designed to strengthen real UI engineering habits.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
              ~18 min
            </span>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:bg-white/[0.07]">
              <Save className="h-3.5 w-3.5 text-cyan-300" />
              Save draft
            </button>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <section className="rounded-[26px] border border-white/10 bg-[#0c1730]/80 p-5 shadow-xl shadow-black/15 backdrop-blur-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-400/10">
                <TerminalSquare className="h-5 w-5 text-cyan-300" />
              </div>

              <p className="mt-5 text-[10px] font-bold tracking-[0.16em] text-cyan-300">
                YOUR MISSION
              </p>
              <h3 className="mt-2 text-xl font-black text-white">
                Make the component resilient.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A product card renders the wrong price format and fails when a product image
                is missing. Fix it so it handles incomplete data with confidence.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["React Components", "Defensive UI", "INR Formatting"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/8 bg-white/[0.035] px-2.5 py-1.5 text-[10px] font-semibold text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-white/10 bg-[#0c1730]/72 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <p className="text-[10px] font-bold tracking-[0.15em] text-emerald-200">
                  SUCCESS CRITERIA
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  "Show a safe fallback if image is missing",
                  "Format the price accurately in INR",
                  "Keep component logic clean and reusable",
                ].map((criterion) => (
                  <div key={criterion} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/8">
                      <Check className="h-3 w-3 text-emerald-300" />
                    </span>
                    <p className="text-xs leading-5 text-slate-400">{criterion}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[22px] border border-amber-300/12 bg-amber-400/[0.045] p-4">
              <div className="flex gap-2.5">
                <Lightbulb className="h-4 w-4 shrink-0 text-amber-300" />
                <p className="text-xs leading-5 text-slate-300">
                  Think like a product engineer: what happens when real user data is incomplete?
                </p>
              </div>
            </section>
          </aside>

          <section className="min-w-0">
            <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#081120] shadow-2xl shadow-black/30">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 bg-[#0c1730] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-cyan-300/15 bg-cyan-400/8 px-3 py-1.5 text-xs font-bold text-cyan-200">
                    ProductCard.jsx
                  </div>
                  <button className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300">
                    Preview
                  </button>
                </div>

                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy code"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute bottom-0 left-0 top-0 w-12 border-r border-white/5 bg-[#07101f] pt-5 text-right font-mono text-xs leading-6 text-slate-700">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} className="pr-3">
                      {i + 1}
                    </div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  spellCheck={false}
                  className="min-h-[415px] w-full resize-y bg-transparent py-5 pl-16 pr-5 font-mono text-sm leading-6 text-slate-200 outline-none selection:bg-violet-500/60"
                  aria-label="Code editor"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-white/8 bg-[#0c1730]/90 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Your work is evaluated against practical engineering signals.
                </p>

                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/[0.08]">
                    <Play className="h-3.5 w-3.5 text-cyan-300" />
                    Run preview
                  </button>

                  <button
                    onClick={() => setSubmitted(true)}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-950/50 transition hover:from-violet-400 hover:to-cyan-500"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit for AI review
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.section
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative mt-6 overflow-hidden rounded-[26px] border border-emerald-300/18 bg-[linear-gradient(135deg,rgba(52,211,153,0.1),rgba(34,211,238,0.07),rgba(139,92,246,0.1))] p-5 shadow-xl shadow-emerald-950/15 sm:p-6"
                >
                  <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />

                  <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[6px] border-emerald-400/30 bg-[#102d32]">
                        <span className="text-2xl font-black text-white">84</span>
                        <span className="absolute -bottom-5 text-[9px] font-bold tracking-[0.12em] text-emerald-200">
                          SCORE
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-cyan-300" />
                          <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-200">
                            SAHYOG REVIEW
                          </p>
                        </div>
                        <h3 className="mt-2 text-xl font-black text-white">
                          Strong product thinking.
                        </h3>
                        <p className="mt-1 text-sm text-slate-300">
                          Your solution protects the experience when real data is incomplete.
                        </p>
                      </div>
                    </div>

                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-300/14 bg-[#08222a]/55 p-3.5">
                        <CircleCheck className="h-4 w-4 text-emerald-300" />
                        <p className="mt-2 text-xs font-bold text-emerald-100">What worked</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          You added a safe image fallback and handled optional data cleanly.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-amber-300/14 bg-[#2b2414]/35 p-3.5">
                        <WandSparkles className="h-4 w-4 text-amber-300" />
                        <p className="mt-2 text-xs font-bold text-amber-100">Next improvement</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Move currency formatting into a reusable utility.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#081826]/55 p-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/12">
                        <Trophy className="h-5 w-5 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">
                          React Components • Level 1 unlocked
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Evidence recorded in your Skill DNA
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/roadmap")}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-100"
                    >
                      Continue roadmap
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </AppShell>
  );
}