import { Navigate, Route, Routes } from "react-router-dom";
import DiagnosticPage from "./pages/DiagnosticPage";
import OnboardingPage from "./pages/OnboardingPage";
import SkillDnaResultsPage from "./pages/SkillDnaResultsPage";
import RoadmapPage from "./pages/RoadmapPage";
import SkillsLabTaskPage from "./pages/SkillsLabTaskPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060b17] px-6 text-center text-slate-100">
      <div className="max-w-md rounded-3xl border border-white/10 bg-[#0c1730] p-10 shadow-2xl">
        <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
          SAHYOG AI
        </p>
        <h1 className="mt-3 text-3xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This experience is being designed for your personalised skill journey.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/diagnostic" element={<DiagnosticPage />} />
      <Route path="/diagnostic/results" element={<SkillDnaResultsPage />} />
      <Route path="/careers" element={<PlaceholderPage title="Career Paths" />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/skills-lab" element={<PlaceholderPage title="Skills Lab" />} />
      <Route path="/skills-lab/task-1" element={<SkillsLabTaskPage />} />
      <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}