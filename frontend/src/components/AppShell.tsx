import {
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  FlaskConical,
  LayoutDashboard,
  Languages,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
};

const navigation = [
  { label: "Home", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Skill Scan", icon: Compass, to: "/diagnostic" },
  { label: "Career Paths", icon: BriefcaseBusiness, to: "/careers" },
  { label: "My Roadmap", icon: BookOpenCheck, to: "/roadmap" },
  { label: "Skills Lab", icon: FlaskConical, to: "/skills-lab" },
  { label: "Achievements", icon: Award, to: "/dashboard#achievements" },
];

function BrandMark() {
  return (
    <Link to="/dashboard" className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
        <div className="absolute h-5 w-5 rounded-full border-2 border-white/90" />
        <div className="absolute h-2 w-2 rounded-full bg-white" />
      </div>
      <div>
        <p className="text-lg font-black tracking-tight text-white">
          Sahyog <span className="text-cyan-300">AI</span>
        </p>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Career Intelligence
        </p>
      </div>
    </Link>
  );
}

export default function AppShell({
  children,
  title,
  eyebrow,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <>
      <div className="px-5 pb-7 pt-6">
        <BrandMark />
      </div>

      <nav className="flex-1 px-3">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
          Your journey
        </p>

        <div className="space-y-1.5">
          {navigation.map(({ label, icon: Icon, to }) => {
            const active =
              location.pathname === to ||
              (to !== "/dashboard" && location.pathname.startsWith(to));

            return (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "border border-violet-300/15 bg-gradient-to-r from-violet-500/18 to-cyan-400/8 text-white shadow-[inset_3px_0_0_#8b5cf6]"
                    : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    active
                      ? "text-cyan-300"
                      : "text-slate-500 group-hover:text-cyan-300"
                  }`}
                />
                <span>{label}</span>
                {active && <ChevronRight className="ml-auto h-4 w-4 text-cyan-300" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="m-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-black text-slate-950">
            AV
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">Aviral Mishra</p>
            <p className="truncate text-[11px] text-slate-500">
              Computer Engineering • Year 3
            </p>
          </div>
          <Settings className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#060b17] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/7 bg-[#081120]/92 backdrop-blur-xl lg:flex">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/65 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-[#081120] transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="absolute right-4 top-5 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          {sidebarContent}
        </aside>
      </div>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-white/7 bg-[#060b17]/75 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              {eyebrow && (
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h1 className="mt-0.5 text-lg font-black tracking-tight text-white sm:text-xl">
                  {title}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/8 sm:flex">
              <Languages className="h-4 w-4 text-cyan-300" />
              हिंदी + English
            </button>

            <button
              aria-label="Sahyog notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300 transition hover:bg-white/8"
            >
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-black text-slate-950">
              AV
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] px-5 py-7 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}