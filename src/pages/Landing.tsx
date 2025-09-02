import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Code2,
  Sparkles,
  LayoutDashboard,
  CalendarCheck,
  NotebookText,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50/50 to-purple-50">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-300/40 to-purple-300/40 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-100/60 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
              <Code2 className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold text-gray-900">
              Dev<span className="text-blue-600">Hub</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="ghost" className="text-gray-600">
              <a href="#features">Overview</a>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              New: Unified workspace for your dev life
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Your personal development workspace
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-600">
              Organize projects, track tasks, capture notes, and use handy tools — all in one sleek, fast dashboard.
            </p>
            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                No sign-up. Data stays in your browser.
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-blue-200/50 to-purple-200/50 blur-2xl" />
            <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* Window chrome */}
              <div className="flex items-center gap-1 border-b border-gray-100 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="ml-3 h-3 w-24 rounded bg-gray-200" />
              </div>

              {/* Fake dashboard preview */}
              <div className="grid gap-4 p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="h-4 w-32 rounded bg-gray-200" />
                      <div className="h-4 w-16 rounded bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 rounded-lg bg-gray-100" />
                      <div className="h-20 rounded-lg bg-gray-100" />
                      <div className="h-20 rounded-lg bg-gray-100" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 h-4 w-24 rounded bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-gray-100" />
                      <div className="h-3 w-5/6 rounded bg-gray-100" />
                      <div className="h-3 w-4/6 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <LayoutDashboard className="h-4 w-4 text-blue-600" /> Projects
                    </div>
                    <div className="h-16 rounded-lg bg-gray-100" />
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CalendarCheck className="h-4 w-4 text-purple-600" /> Tasks
                    </div>
                    <div className="h-16 rounded-lg bg-gray-100" />
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <NotebookText className="h-4 w-4 text-emerald-600" /> Notes
                    </div>
                    <div className="h-16 rounded-lg bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              Everything you need to stay in flow
            </h2>
            <p className="mt-3 text-gray-600">
              Simple, fast, and thoughtfully designed features that keep you focused on shipping.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<LayoutDashboard className="h-5 w-5 text-blue-600" />} title="Unified dashboard" description="See projects, tasks, and notes at a glance." />
            <Feature icon={<CalendarCheck className="h-5 w-5 text-purple-600" />} title="Task tracking" description="Plan sprints and check off progress quickly." />
            <Feature icon={<NotebookText className="h-5 w-5 text-emerald-600" />} title="Quick notes" description="Capture ideas and snippets without leaving the flow." />
            <Feature icon={<Wrench className="h-5 w-5 text-orange-600" />} title="Built-in tools" description="Handy utilities to speed up your daily work." />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 py-8 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-6xl px-6">
          © {new Date().getFullYear()} DevHub. Built for developers.
        </div>
      </footer>
    </div>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md">
      <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-gray-50 p-2">
        {icon}
      </div>
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default Landing;
