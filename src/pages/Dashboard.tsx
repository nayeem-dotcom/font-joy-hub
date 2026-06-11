import { useState, useMemo } from "react";
import {
  Users,
  Zap,
  MinusCircle,
  Clock,
  FileText,
  AlertTriangle,
  UserPlus,
  CheckCircle2,
  Layers,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Target,
  Award,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useBuyers, TEAM_MEMBERS, VERTICALS } from "@/contexts/BuyerContext";

type Period = "Week" | "Month" | "Year";

const activities = [
  { icon: CheckCircle2, color: "text-primary-container", title: "Buyer Onboarded: SolarTech Inc.", sub: "Managed by Nayeem Ahmad", time: "2 hours ago" },
  { icon: FileText, color: "text-tertiary", title: 'Note added to "BlueWave Logistics"', sub: "Pending final documentation.", time: "5 hours ago" },
  { icon: AlertTriangle, color: "text-amber-500", title: "Drop-off Alert: Nexus Retail", sub: "Stuck in 'Qualification' for 5 days.", time: "Yesterday" },
  { icon: UserPlus, color: "text-primary-container", title: "New Buyer Assigned", sub: "Assigned to Joe Austin", time: "2 days ago" },
];

const VERTICAL_COLORS = [
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-sky-500",
  "from-lime-400 to-emerald-500",
  "from-fuchsia-400 to-pink-500",
];

export default function Dashboard() {
  const { buyers } = useBuyers();
  const [period, setPeriod] = useState<Period>("Month");

  const totalBuyers = buyers.length;
  const activeBuyers = buyers.filter((b) => b.active).length;
  const inactiveBuyers = totalBuyers - activeBuyers;
  const avgDays = (buyers.reduce((sum, b) => sum + b.daysInStage, 0) / (totalBuyers || 1)).toFixed(1);

  const liveBuyers = buyers.filter((b) => b.stage === "Live").length;
  const stuckBuyers = buyers.filter((b) => b.stage === "Voided/Stuck").length;
  const conversionRate = totalBuyers ? Math.round((liveBuyers / totalBuyers) * 100) : 0;

  const kpis = [
    {
      icon: Users,
      label: "Total Buyers",
      value: String(totalBuyers),
      change: "+12.5%",
      positive: true,
      spark: [22, 28, 26, 34, 31, 42, 48, 55, 52, 64, 70, 78],
      tint: "emerald",
    },
    {
      icon: Zap,
      label: "Active Pipeline",
      value: String(activeBuyers),
      change: "+4.2%",
      positive: true,
      spark: [40, 38, 44, 42, 48, 46, 52, 55, 58, 56, 62, 65],
      tint: "sky",
    },
    {
      icon: Target,
      label: "Conversion",
      value: `${conversionRate}%`,
      change: "+2.1pt",
      positive: true,
      spark: [12, 14, 13, 18, 22, 24, 28, 30, 32, 35, 38, 42],
      tint: "violet",
    },
    {
      icon: Clock,
      label: "Avg. Days to Live",
      value: avgDays,
      change: "-2 days",
      positive: true,
      spark: [70, 65, 68, 60, 58, 55, 52, 50, 48, 46, 42, 40],
      tint: "amber",
    },
  ];

  const tintMap: Record<string, { glow: string; ring: string; chip: string; stroke: string; fill: string }> = {
    emerald: { glow: "from-emerald-500/20", ring: "ring-emerald-400/30", chip: "bg-emerald-400/10 text-emerald-300", stroke: "stroke-emerald-400", fill: "fill-emerald-400/20" },
    sky:     { glow: "from-sky-500/20",     ring: "ring-sky-400/30",     chip: "bg-sky-400/10 text-sky-300",         stroke: "stroke-sky-400",     fill: "fill-sky-400/20" },
    violet:  { glow: "from-violet-500/20",  ring: "ring-violet-400/30",  chip: "bg-violet-400/10 text-violet-300",   stroke: "stroke-violet-400",  fill: "fill-violet-400/20" },
    amber:   { glow: "from-amber-500/20",   ring: "ring-amber-400/30",   chip: "bg-amber-400/10 text-amber-300",     stroke: "stroke-amber-400",   fill: "fill-amber-400/20" },
  };

  // Team data from real buyers
  const teamData = (() => {
    const map: Record<string, number> = {};
    TEAM_MEMBERS.forEach((m) => { map[m] = 0; });
    buyers.forEach((b) => { map[b.owner] = (map[b.owner] || 0) + 1; });
    const max = Math.max(...Object.values(map), 1);
    return Object.entries(map).map(([name, value]) => ({ name, value, max })).sort((a, b) => b.value - a.value);
  })();

  // Team details with live + active counts
  const teamDetails = TEAM_MEMBERS.map((name) => {
    const owned = buyers.filter((b) => b.owner === name);
    const live = owned.filter((b) => b.stage === "Live").length;
    const active = owned.filter((b) => b.active).length;
    return { name, total: owned.length, live, active, conv: owned.length ? Math.round((live / owned.length) * 100) : 0 };
  }).sort((a, b) => b.total - a.total);

  // Category (vertical) breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    VERTICALS.forEach((v) => { map[v] = 0; });
    buyers.forEach((b) => { map[b.vertical] = (map[b.vertical] || 0) + 1; });
    const entries = Object.entries(map).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
    return entries.map(([name, value], i) => ({
      name,
      value,
      pct: Math.round((value / total) * 100),
      gradient: VERTICAL_COLORS[i % VERTICAL_COLORS.length],
    }));
  }, [buyers]);

  // Donut math for top 6 verticals
  const donut = useMemo(() => {
    const top = categoryData.slice(0, 6);
    const total = top.reduce((s, c) => s + c.value, 0) || 1;
    let acc = 0;
    const C = 2 * Math.PI * 70;
    return top.map((c, i) => {
      const len = (c.value / total) * C;
      const seg = { ...c, len, offset: -acc, color: ["#34d399","#38bdf8","#a78bfa","#fbbf24","#f472b6","#22d3ee"][i] };
      acc += len;
      return seg;
    });
  }, [categoryData]);

  // Sparkline path helper
  const sparkPath = (data: number[]) => {
    const w = 100, h = 32;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1);
    const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`);
    return { line: `M${pts.join(" L")}`, area: `M0,${h} L${pts.join(" L")} L${w},${h} Z` };
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card via-card to-surface-container-high p-8">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-sky-500/15 via-violet-500/10 to-transparent blur-3xl" />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live · Real-time sync
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              Welcome back, Nayeem
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Here&apos;s how your buyer funnel is performing today. <span className="text-emerald-300">{liveBuyers} live</span> · <span className="text-sky-300">{activeBuyers} active</span> · <span className="text-amber-300">{stuckBuyers} need attention</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-container-high/80 backdrop-blur rounded-xl p-1 border border-border/40">
              {(["Week", "Month", "Year"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-primary-foreground shadow-lg shadow-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/40 text-sm font-medium text-foreground inline-flex items-center gap-2 transition-colors">
              <Sparkles className="w-4 h-4 text-emerald-300" /> Insights
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const t = tintMap[kpi.tint];
          const path = sparkPath(kpi.spark);
          return (
            <div
              key={kpi.label}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 transition-all hover:border-border/70 hover:-translate-y-0.5"
            >
              <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.chip} ring-1 ${t.ring}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${kpi.positive ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}>
                    {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-4xl font-headline font-bold text-foreground tracking-tight">{kpi.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-10 mt-4 overflow-visible">
                  <path d={path.area} className={t.fill} />
                  <path d={path.line} fill="none" strokeWidth="1.8" className={t.stroke} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funnel velocity + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(158_84%_42%/0.08),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-headline font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-300" />
                  Funnel Velocity
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Stage-by-stage progression of all active buyers</p>
              </div>
              <button className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1">
                Download report <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {(() => {
                const stages = [
                  { label: "Buyer Created", color: "from-sky-400 to-blue-500" },
                  { label: "Onboarding",    color: "from-violet-400 to-purple-500" },
                  { label: "Qualification", color: "from-fuchsia-400 to-pink-500" },
                  { label: "Ready to Launch", color: "from-amber-400 to-orange-500" },
                  { label: "Live",          color: "from-emerald-400 to-teal-500" },
                ];
                const counts = stages.map(s => buyers.filter(b => b.stage === s.label).length);
                const max = Math.max(...counts, 1);
                return stages.map((s, i) => {
                  const pct = (counts[i] / max) * 100;
                  return (
                    <div key={s.label} className="grid grid-cols-[140px_1fr_56px] items-center gap-4 group">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">{s.label}</span>
                      <div className="relative h-9 rounded-lg bg-surface-container/60 overflow-hidden">
                        <div
                          className={`h-full rounded-lg bg-gradient-to-r ${s.color} shadow-lg transition-all duration-700 relative`}
                          style={{ width: `${pct}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10" />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground text-right tabular-nums">{counts[i]}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-headline font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-300" />
              Recent Activity
            </h2>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="space-y-1">
            {activities.map((a, i) => (
              <div key={i} className="relative flex gap-3 p-3 rounded-xl hover:bg-foreground/[0.03] transition-colors cursor-pointer group">
                <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-foreground/[0.04] ${a.color}`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.sub}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">{a.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/40 rounded-xl hover:bg-foreground/5 transition-colors">
            View all activity →
          </button>
        </div>
      </div>

      {/* Volume chart + Category donut */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-headline font-bold text-foreground">12-Month Volume</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Buyers onboarded per month · trailing 12 mo.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-gradient-to-br from-emerald-400 to-teal-500" /> <span className="text-muted-foreground">Onboarded</span></span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-sky-400/40" /> <span className="text-muted-foreground">Target</span></span>
            </div>
          </div>
          {(() => {
            const data = [
              { label: "Jan", value: 35 }, { label: "Feb", value: 42 },
              { label: "Mar", value: 55 }, { label: "Apr", value: 48 },
              { label: "May", value: 60 }, { label: "Jun", value: 72 },
              { label: "Jul", value: 65 }, { label: "Aug", value: 80 },
              { label: "Sep", value: 75 }, { label: "Oct", value: 88 },
              { label: "Nov", value: 70 }, { label: "Dec", value: 92 },
            ];
            return (
              <>
                <div className="flex items-end gap-2.5 h-48 px-1">
                  {data.map((bar, i) => (
                    <div key={i} className="group flex-1 flex flex-col items-center justify-end h-full relative">
                      <span className="absolute -top-1 text-[10px] font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}</span>
                      <div className="w-full rounded-t-md bg-sky-400/10 absolute bottom-0" style={{ height: `${Math.min(bar.value + 8, 100)}%` }} />
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 via-emerald-400 to-teal-300 shadow-lg shadow-emerald-500/20 transition-all duration-500 group-hover:from-emerald-400 relative"
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[11px] text-muted-foreground px-1">
                  {data.map((b) => <span key={b.label}>{b.label}</span>)}
                </div>
              </>
            );
          })()}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-headline font-bold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-300" />
                By Category
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Top verticals breakdown</p>
            </div>
          </div>
          <div className="relative flex items-center justify-center my-2">
            <svg viewBox="0 0 160 160" className="w-44 h-44 -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--surface-container))" strokeWidth="16" />
              {donut.map((seg, i) => (
                <circle
                  key={i}
                  cx="80" cy="80" r="70" fill="none"
                  stroke={seg.color} strokeWidth="16" strokeLinecap="butt"
                  strokeDasharray={`${seg.len} ${2 * Math.PI * 70}`}
                  strokeDashoffset={seg.offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-headline font-bold text-foreground tabular-nums">{totalBuyers}</span>
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Buyers</span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {donut.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
                  <span className="text-foreground truncate">{seg.name}</span>
                </span>
                <span className="text-muted-foreground tabular-nums">{seg.value} · {seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team leaderboard + Full vertical list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-headline font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                Team Performance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Buyer ownership and conversion velocity</p>
            </div>
            <a href="/team" className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1">
              Full breakdown <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-2">
            {teamDetails.map((m, i) => {
              const initials = m.name.split(" ").map(n => n[0]).slice(0,2).join("");
              const maxTotal = Math.max(...teamDetails.map(t => t.total), 1);
              const pct = (m.total / maxTotal) * 100;
              return (
                <div key={m.name} className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 rounded-xl hover:bg-foreground/[0.03] transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums w-4">{i + 1}</span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${i === 0 ? "from-amber-400 to-orange-500" : i === 1 ? "from-slate-300 to-slate-500" : i === 2 ? "from-orange-400 to-amber-700" : "from-emerald-500 to-teal-600"} flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.live} live · {m.active} active</p>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-lg font-headline font-bold text-foreground tabular-nums leading-none">{m.total}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Buyers</p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-semibold tabular-nums ${m.conv >= 50 ? "bg-emerald-400/10 text-emerald-300" : m.conv >= 25 ? "bg-amber-400/10 text-amber-300" : "bg-rose-400/10 text-rose-300"}`}>
                      {m.conv}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-headline font-bold text-foreground flex items-center gap-2">
              <Flame className="w-4 h-4 text-pink-300" />
              All Verticals
            </h2>
            <span className="text-xs text-muted-foreground">{categoryData.length} total</span>
          </div>
          <div className="space-y-3 max-h-[380px] overflow-auto pr-1 -mr-1">
            {categoryData.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground truncate">{c.name}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums">{c.value} <span className="text-muted-foreground">· {c.pct}%</span></span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700`} style={{ width: `${Math.max(c.pct, 4)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-500/10 via-card to-card p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/15 ring-1 ring-rose-400/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-300" />
            </div>
            <a href="/pipeline" className="text-xs font-semibold text-rose-300 hover:text-rose-200 inline-flex items-center gap-1">Resolve <ArrowUpRight className="w-3 h-3" /></a>
          </div>
          <p className="text-3xl font-headline font-bold text-foreground tabular-nums">{stuckBuyers}</p>
          <p className="text-sm text-muted-foreground mt-1">Voided / Stuck buyers</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/15 ring-1 ring-emerald-400/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <a href="/buyers?stage=Live" className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1">View <ArrowUpRight className="w-3 h-3" /></a>
          </div>
          <p className="text-3xl font-headline font-bold text-foreground tabular-nums">{liveBuyers}</p>
          <p className="text-sm text-muted-foreground mt-1">Live & monetizing</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 via-card to-card p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-400/15 ring-1 ring-sky-400/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-sky-300" />
            </div>
            <a href="/pipeline" className="text-xs font-semibold text-sky-300 hover:text-sky-200 inline-flex items-center gap-1">Triage <ArrowUpRight className="w-3 h-3" /></a>
          </div>
          <p className="text-3xl font-headline font-bold text-foreground tabular-nums">{buyers.filter(b => b.stage === "Buyer Created").length}</p>
          <p className="text-sm text-muted-foreground mt-1">New buyers awaiting action</p>
        </div>
      </div>
    </div>
  );
}
