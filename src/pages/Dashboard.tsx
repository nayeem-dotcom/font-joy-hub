import { useState } from "react";
import {
  Users,
  Zap,
  MinusCircle,
  Clock,
  FileText,
  AlertTriangle,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useBuyers, TEAM_MEMBERS } from "@/contexts/BuyerContext";

type Period = "Week" | "Month" | "Year";

const activities = [
  { icon: CheckCircle2, color: "text-primary-container", title: "Buyer Onboarded: SolarTech Inc.", sub: "Managed by Nayeem Ahmad", time: "2 hours ago" },
  { icon: FileText, color: "text-tertiary", title: 'Note added to "BlueWave Logistics"', sub: "Pending final documentation.", time: "5 hours ago" },
  { icon: AlertTriangle, color: "text-amber-500", title: "Drop-off Alert: Nexus Retail", sub: "Stuck in 'Qualification' for 5 days.", time: "Yesterday" },
  { icon: UserPlus, color: "text-primary-container", title: "New Buyer Assigned", sub: "Assigned to Joe Austin", time: "2 days ago" },
];

export default function Dashboard() {
  const { buyers } = useBuyers();
  const [period, setPeriod] = useState<Period>("Month");

  const totalBuyers = buyers.length;
  const activeBuyers = buyers.filter((b) => b.active).length;
  const inactiveBuyers = totalBuyers - activeBuyers;
  const avgDays = (buyers.reduce((sum, b) => sum + b.daysInStage, 0) / (totalBuyers || 1)).toFixed(1);

  const kpis = [
    { icon: Users, label: "Total Buyers", value: String(totalBuyers), change: "+12.5%", positive: true, color: "bg-primary/10 text-primary" },
    { icon: Zap, label: "Active", value: String(activeBuyers), change: "Steady", positive: true, color: "bg-primary-container/10 text-primary-container" },
    { icon: MinusCircle, label: "Inactive", value: String(inactiveBuyers), change: "-3%", positive: false, color: "bg-destructive/10 text-destructive" },
    { icon: Clock, label: "Avg. Days to Live", value: avgDays, change: "-2 days", positive: true, color: "bg-tertiary/10 text-tertiary" },
  ];

  // Team data from real buyers
  const teamData = (() => {
    const map: Record<string, number> = {};
    TEAM_MEMBERS.forEach((m) => { map[m] = 0; });
    buyers.forEach((b) => { map[b.owner] = (map[b.owner] || 0) + 1; });
    const max = Math.max(...Object.values(map), 1);
    return Object.entries(map).map(([name, value]) => ({ name, value, max })).sort((a, b) => b.value - a.value);
  })();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time funnel performance and buyer acquisition metrics.</p>
        </div>
        <div className="flex items-center bg-card rounded-xl p-1">
          {(["Week", "Month", "Year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p ? "bg-primary-container text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-semibold ${kpi.positive ? "text-primary-container" : "text-destructive"}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-3xl font-headline font-bold text-foreground">{kpi.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Funnel + Activity */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 surface-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">Funnel Velocity</h2>
            <button className="text-sm text-primary font-semibold hover:underline">Download Report</button>
          </div>
          <div className="space-y-5">
            {[
              { label: "Onboarded", value: buyers.filter(b => b.stage === "Live").length, width: "100%", bg: "gradient-primary" },
              { label: "In Progress", value: buyers.filter(b => b.stage !== "Live" && b.stage !== "Buyer Created").length, width: "60%", bg: "gradient-primary" },
              { label: "New", value: buyers.filter(b => b.stage === "Buyer Created").length, width: "30%", bg: "bg-tertiary/80" },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-4">
                <div className={`rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground ${bar.bg} min-w-[120px]`}>
                  {bar.label}
                </div>
                <div className="flex-1 bg-surface-container rounded-full h-10 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.bg} flex items-center justify-end pr-4 transition-all duration-700`}
                    style={{ width: bar.width }}
                  >
                    <span className="text-sm font-bold text-primary-foreground">{bar.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
          </div>
          <div className="space-y-5">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-3">
                <a.icon className={`w-5 h-5 mt-0.5 shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-medium text-muted-foreground border border-outline-variant/20 rounded-xl hover:bg-accent transition-colors">
            View Full Activity Feed
          </button>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="surface-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Onboarded by Team</h2>
          <div className="space-y-4">
            {teamData.map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{m.name}</span>
                  <span className="text-sm font-semibold text-foreground">{m.value}</span>
                </div>
                <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-700"
                    style={{ width: `${(m.value / m.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">12-Month Volume</h2>
          <div className="flex items-end gap-2 h-40">
            {[35, 42, 55, 48, 60, 72, 65, 80, 75, 88, 70, 92].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-md transition-all duration-500 ${i % 2 === 0 ? "gradient-primary" : "bg-primary-container/30"}`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span><span>Jun</span><span>Dec</span>
          </div>
        </div>
      </div>

      {/* Bottom KPIs */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { icon: Zap, label: "Efficiency Score", value: "94.2%" },
          { icon: Clock, label: "Market Uptime", value: "99.9%" },
        ].map((item) => (
          <div key={item.label} className="surface-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-headline font-bold text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
