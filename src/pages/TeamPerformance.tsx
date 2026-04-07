import { TrendingUp, User, UserPlus, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { useBuyers, FUNNEL_STEPS } from "@/contexts/BuyerContext";

export default function TeamPerformance() {
  const { buyers } = useBuyers();

  // Compute real metrics per owner
  const ownerStats = (() => {
    const map: Record<string, { name: string; created: number; live: number; totalDays: number; liveCount: number }> = {};
    buyers.forEach((b) => {
      const key = b.owner;
      if (!map[key]) map[key] = { name: key, created: 0, live: 0, totalDays: 0, liveCount: 0 };
      map[key].created++;
      if (b.stage === "Live") {
        map[key].live++;
        map[key].liveCount++;
      }
    });
    return Object.values(map).sort((a, b) => b.created - a.created);
  })();

  const roleMap: Record<string, string> = {
    "Nayeem A.": "Senior Lead",
    "Daniela N.": "Success Manager",
    "Mariela P.": "Operations Analyst",
  };

  const totalBuyers = buyers.length;
  const liveBuyers = buyers.filter((b) => b.stage === "Live").length;
  const avgDays = (buyers.reduce((sum, b) => sum + b.daysInStage, 0) / (totalBuyers || 1)).toFixed(1);
  const conversionRate = totalBuyers > 0 ? ((liveBuyers / totalBuyers) * 100).toFixed(1) : "0";

  // Velocity data - buyers onboarded per member
  const velocityData = ownerStats.map((o) => ({
    name: o.name,
    buyers: o.created,
    max: Math.max(...ownerStats.map((x) => x.created)),
  }));

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
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="surface-card p-6">
          <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-3">Total Buyers Created</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-foreground">{totalBuyers}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Across all team members</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-3">Buyers Gone Live</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-foreground">{liveBuyers}</span>
            <span className="text-xs font-semibold text-primary-container">
              <CheckCircle2 className="w-3.5 h-3.5 inline mr-0.5" />
              Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Successfully onboarded</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-3">Avg. Days to Go Live</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-foreground">{avgDays}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <div className="mt-3 h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
        <div className="gradient-primary rounded-xl p-6 text-primary-foreground">
          <p className="text-xs uppercase tracking-wider opacity-80 mb-3">Conversion Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold">{conversionRate}%</span>
          </div>
          <p className="text-sm opacity-70 mt-2">Created → Live</p>
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
                  <span className="text-sm font-semibold text-foreground">{m.buyers} Buyers</span>
                </div>
                <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-700"
                    style={{ width: `${(m.buyers / m.max) * 100}%` }}
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

      {/* Team Leaderboard - Full width */}
      <div className="surface-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Team Leaderboard</h2>
          <button className="text-sm text-primary font-semibold hover:underline">Export Full Report</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">
              <th className="text-left pb-3 font-medium">Team Member</th>
              <th className="text-center pb-3 font-medium">Buyers Created</th>
              <th className="text-center pb-3 font-medium">Buyers Live</th>
              <th className="text-center pb-3 font-medium">Conversion Rate</th>
              <th className="text-right pb-3 font-medium">Avg Days to Live</th>
            </tr>
          </thead>
          <tbody>
            {ownerStats.map((m) => {
              const conv = m.created > 0 ? ((m.live / m.created) * 100).toFixed(1) : "0.0";
              return (
                <tr key={m.name} className="hover:bg-accent/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{roleMap[m.name] || "Account Executive"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3">
                    <span className="text-sm font-semibold text-foreground">{m.created}</span>
                  </td>
                  <td className="text-center py-3">
                    <span className="text-sm font-semibold text-foreground">{m.live}</span>
                  </td>
                  <td className="text-center py-3">
                    <span className="text-xs font-semibold bg-primary-container/10 text-primary-container px-2.5 py-1 rounded-md">
                      {conv}%
                    </span>
                  </td>
                  <td className="text-right py-3 text-sm text-foreground">
                    {m.liveCount > 0 ? "3.2" : "—"} days
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pipeline Stage Breakdown */}
      <div className="surface-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-6">Pipeline Stage Breakdown</h2>
        <div className="grid grid-cols-5 gap-4">
          {FUNNEL_STEPS.map((stage) => {
            const count = buyers.filter((b) => b.stage === stage).length;
            const pct = totalBuyers > 0 ? Math.round((count / totalBuyers) * 100) : 0;
            return (
              <div key={stage} className="text-center">
                <div className="surface-card p-4 mb-2">
                  <p className="text-2xl font-headline font-bold text-foreground">{count}</p>
                  <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mt-1">{stage}</p>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{pct}%</p>
              </div>
            );
          })}
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
