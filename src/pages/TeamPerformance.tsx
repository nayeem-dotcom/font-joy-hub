import { TrendingUp, User, UserPlus } from "lucide-react";

const velocityData = [
  { name: "Dan Davies", units: 342, max: 342 },
  { name: "Nayeem Ahmad", units: 289, max: 342 },
  { name: "Joe Austin", units: 212, max: 342 },
  { name: "Elena Rodriguez", units: 198, max: 342 },
];

const leaderboard = [
  { name: "Dan Davies", role: "Senior Lead", onboarded: 42, yr: 412, conv: "92.4%", days: "3.1" },
  { name: "Nayeem Ahmad", role: "Success Manager", onboarded: 38, yr: 356, conv: "88.1%", days: "4.2" },
  { name: "Joe Austin", role: "Operations Analyst", onboarded: 31, yr: 298, conv: "76.5%", days: "5.5" },
  { name: "Elena Rodriguez", role: "Account Executive", onboarded: 29, yr: 242, conv: "81.2%", days: "4.8" },
];

const funnelSteps = [
  { label: "LEADS CAPTURED", value: "2,480" },
  { label: "ONBOARDING INITIATED", value: "1,942" },
  { label: "TECHNICALLY VERIFIED", value: "1,610" },
  { label: "LIVE STATUS", value: "1,284" },
];

export default function TeamPerformance() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-1">Operational Audit</p>
          <h1 className="text-3xl font-bold text-foreground">Team Efficiency Pulse</h1>
        </div>
        <div className="flex items-center bg-card rounded-xl p-1">
          {["Weekly", "Monthly", "Yearly", "Custom"].map((p, i) => (
            <button
              key={p}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                i === 1 ? "bg-primary-container text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="surface-card p-6">
          <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-3">Total Onboarded</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-foreground">1,284</span>
            <span className="text-xs font-semibold text-primary-container">+12%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Current Month Velocity</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-3">Avg. Days to Live</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-foreground">4.2</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <div className="mt-3 h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: "75%" }} />
          </div>
          <p className="text-[10px] text-primary-container font-semibold mt-1 text-right">Top 5%</p>
        </div>
        <div className="gradient-primary rounded-xl p-6 text-primary-foreground">
          <p className="text-xs uppercase tracking-wider opacity-80 mb-3">Onboarding-to-Live Ratio</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold">94.8%</span>
            <span className="text-sm font-semibold opacity-80">Velocity Peak</span>
          </div>
          <p className="text-sm opacity-70 mt-2">Optimized funnel throughput</p>
        </div>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Onboarding Velocity */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Onboarding Velocity</h2>
            <span className="text-xs font-label uppercase tracking-wider text-muted-foreground">By Team Member</span>
          </div>
          <div className="space-y-5">
            {velocityData.map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{m.name}</span>
                  <span className="text-sm font-semibold text-foreground">{m.units} Units</span>
                </div>
                <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-700"
                    style={{ width: `${(m.units / m.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Days to Live Trend */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Avg. Days to Live Trend</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="text-xs text-muted-foreground">30-Day Moving Average</span>
            </div>
          </div>
          {/* Simple chart visualization */}
          <div className="h-36 flex items-end gap-1 relative">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
              <polyline
                points="0,80 40,70 80,40 120,50 160,30 200,20"
                fill="none"
                stroke="hsl(var(--primary-container))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />
              <polyline
                points="0,80 40,70 80,40 120,50 160,30 200,20"
                fill="url(#grad)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary-container))" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {["WK 1", "WK 2", "WK 3", "WK 4", "WK 5"].map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 bg-surface-container rounded-xl p-3">
            <TrendingUp className="w-4 h-4 text-primary-container" />
            <p className="text-sm">
              <span className="text-primary-container font-semibold">18% Improvement</span>
              <span className="text-muted-foreground"> in deployment speed over the last 5 weeks.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-6">
        {/* Funnel Drop-off */}
        <div className="col-span-2 bg-inverse-surface rounded-2xl p-6 text-inverse-on-surface">
          <h2 className="text-lg font-bold mb-6">Funnel Drop-off</h2>
          <div className="space-y-4">
            {funnelSteps.map((step, i) => (
              <div key={step.label}>
                <div className="bg-inverse-surface border border-inverse-on-surface/10 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-[10px] font-label uppercase tracking-wider opacity-70">{step.label}</span>
                  <span className="text-xl font-headline font-bold">{step.value}</span>
                </div>
                <div className="h-1.5 bg-primary-container/30 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: `${30 + i * 10}%` }} />
                </div>
                {i < funnelSteps.length - 1 && (
                  <div className="flex justify-center my-2 text-primary-container/60">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="col-span-3 surface-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Team Leaderboard</h2>
            <button className="text-sm text-primary font-semibold hover:underline">Export Full Report</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">
                <th className="text-left pb-3 font-medium">Team Member</th>
                <th className="text-center pb-3 font-medium">Onboarded (Mo/Yr)</th>
                <th className="text-center pb-3 font-medium">Conv. Rate</th>
                <th className="text-right pb-3 font-medium">Avg Days to Live</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((m) => (
                <tr key={m.name} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3">
                    <span className="text-sm font-semibold text-foreground">{m.onboarded}</span>
                    <span className="text-sm text-muted-foreground"> / {m.yr}</span>
                  </td>
                  <td className="text-center py-3">
                    <span className="text-xs font-semibold bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-md">
                      {m.conv}
                    </span>
                  </td>
                  <td className="text-right py-3 text-sm text-foreground">{m.days} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite CTA */}
      <button className="fixed bottom-8 left-72 gradient-primary text-primary-foreground rounded-xl px-5 py-3 flex items-center gap-2 font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity">
        <UserPlus className="w-4 h-4" />
        Invite Member
      </button>
    </div>
  );
}
