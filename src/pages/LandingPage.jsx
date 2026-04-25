import { Link } from 'react-router-dom';
import { BadgeCheck, CheckCircle2, Footprints, Package, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

import { Button, Card } from '@/components';

const steps = [
  {
    step: '01',
    title: 'Request',
    icon: Package,
    copy: 'Tell us what you need. Grocery pickups, pharmacy runs, documents, and everyday tasks all start here.',
  },
  {
    step: '02',
    title: 'Match',
    icon: Footprints,
    copy: 'A local runner accepts your job and heads out fast, so you are not left waiting.',
  },
  {
    step: '03',
    title: 'Relax',
    icon: CheckCircle2,
    copy: 'Track your order in real-time while your errand moves from pickup to drop-off.',
  },
];

const requesterPoints = [
  'Save time on the tasks that pull you away from work, family, or focus.',
  'Get clear updates without making call after call.',
  'Count on nearby help for the errands that cannot wait.',
];

const runnerPoints = [
  'Earn on your own schedule and choose the jobs that fit your day.',
  'Turn free hours into flexible income without a rigid shift.',
  'Be the local go-to for people who need something done right now.',
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-128 bg-[radial-gradient(circle_at_top_left,rgba(246,168,74,0.24),transparent_42%),radial-gradient(circle_at_top_right,rgba(255,239,224,0.9),transparent_34%),linear-gradient(180deg,rgba(255,250,244,0.92)_0%,rgba(247,244,240,0)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-orange/10 blur-3xl" />

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-orange/20 bg-surface-white px-4 py-2 text-sm font-medium text-primary-orange shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Community-powered errands for busy locals
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl font-heading text-5xl font-black tracking-tight text-ink-default sm:text-6xl lg:text-7xl">
              Get your errands done, or get paid to run them.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-ink-mid sm:text-xl">
              The community-powered platform connecting busy people with reliable local runners.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg" className="sm:px-6">
              <Link to="/auth?mode=signup">
                Post an Errand
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="sm:px-6">
              <Link to="/auth?mode=signup">
                Become a Runner
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border-rule bg-surface-white px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-ink-default">Fast turnarounds</p>
              <p className="text-sm text-ink-mid">Get matched with nearby help when timing matters.</p>
            </div>
            <div className="rounded-2xl border border-border-rule bg-surface-white px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-ink-default">Built for trust</p>
              <p className="text-sm text-ink-mid">Follow every handoff with clear, real-time updates.</p>
            </div>
            <div className="rounded-2xl border border-border-rule bg-surface-white px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-ink-default">Flexible earning</p>
              <p className="text-sm text-ink-mid">Runners choose jobs that fit their schedule.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 self-center lg:pl-6">
          <Card variant="highlight" className="gap-4 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-orange text-surface-white">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-orange">For requesters</p>
                <p className="text-lg font-semibold text-ink-default">A dependable local hand, on demand.</p>
              </div>
            </div>
            <p className="text-base leading-7 text-ink-mid">
              Post one task and let a vetted runner handle the errand while you stay focused on the day ahead.
            </p>
          </Card>

          <Card className="gap-4 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-orange-bg text-primary-orange">
                <BadgeCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-orange">For runners</p>
                <p className="text-lg font-semibold text-ink-default">Turn free time into flexible earnings.</p>
              </div>
            </div>
            <p className="text-base leading-7 text-ink-mid">
              Pick up nearby jobs, earn on your own schedule, and build a reputation for showing up when it counts.
            </p>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-orange">How it works</p>
          <h2 className="font-heading text-3xl font-black tracking-tight text-ink-default sm:text-4xl">Three steps from request to delivery.</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card key={step.title} className="gap-5 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-orange-bg text-primary-orange">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-border-rule bg-surface-default px-3 py-1 text-sm font-semibold text-ink-mid">
                    {step.step}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-ink-default">{step.title}</h3>
                  <p className="text-base leading-7 text-ink-mid">{step.copy}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="value-proposition" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <Card variant="highlight" className="gap-6 rounded-3xl p-6 sm:p-8 lg:p-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-orange">Requesters</p>
              <h2 className="font-heading text-3xl font-black tracking-tight text-ink-default sm:text-4xl">Save time. Focus on what matters.</h2>
            </div>
            <ul className="space-y-4">
              {requesterPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-base leading-7 text-ink-mid">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary-orange" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="gap-6 rounded-3xl p-6 sm:p-8 lg:p-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-orange">Runners</p>
              <h2 className="font-heading text-3xl font-black tracking-tight text-ink-default sm:text-4xl">Earn on your own schedule. Be your own boss.</h2>
            </div>
            <ul className="space-y-4">
              {runnerPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-base leading-7 text-ink-mid">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary-orange" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <Card className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-surface-white p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-orange">Ready to get started?</p>
            <h2 className="font-heading text-3xl font-black tracking-tight text-ink-default sm:text-4xl">Join the platform built for fast local help.</h2>
          </div>
          <Button asChild variant="brand" size="lg" className="sm:px-8">
            <Link to="/auth?mode=signup">Sign Up Now</Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}