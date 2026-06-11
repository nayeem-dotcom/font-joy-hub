import { useState, useMemo } from "react";
import {
  Users, Zap, Clock, AlertTriangle, UserPlus, CheckCircle2, Layers,
  ArrowUpRight, ArrowDownRight, Sparkles, Activity, Target, Award,
  Flame, ChevronRight, FileText, TrendingUp,
} from "lucide-react";
import { useBuyers, TEAM_MEMBERS, VERTICALS } from "@/contexts/BuyerContext";

type Period = "Week" | "Month" | "Year";

const activities = [
  { icon: CheckCircle2, color: "text-emerald-300", bg: "bg-emerald-400/10", title: "SolarTech Inc. went live", sub: "Nayeem Ahmad", time: "2h" },
  { icon: FileText,     color: "text-foreground/70",  bg: "bg-foreground/[0.06]",     title: "Note on BlueWave Logistics", sub: "Pending final docs", time: "5h" },
  { icon: AlertTriangle,color: "text-amber-300",   bg: "bg-amber-400/10",   title: "Drop-off: Nexus Retail", sub: "Stuck 5 days in Qualification", time: "1d" },
  { icon: UserPlus,     color: "text-foreground/70",  bg: "bg-foreground/[0.06]",  title: "New buyer assigned",      sub: "Assigned to Joe Austin", time: "2d" },
];

const VERTICAL_COLORS = [
  "from-emerald-300 to-teal-400","from-emerald-400 to-teal-500","from-emerald-500 to-teal-600",
  "from-teal-400 to-cyan-500","from-emerald-400/80 to-teal-500/80","from-emerald-300/70 to-teal-400/70",
  "from-emerald-500/90 to-teal-600/90","from-teal-500 to-emerald-600",
];

export default function Dashboard() {
  const { buyers } = useBuyers();
  const [period, setPeriod] = useState<Period>("Month");

  const totalBuyers = buyers.length;
  const activeBuyers = buyers.filter((b) => b.active).length;
  const liveBuyers = buyers.filter((b) => b.stage === "Live").length;
  const stuckBuyers = buyers.filter((b) => b.stage === "Voided/Stuck").length;
  const newBuyers = buyers.filter((b) => b.stage === "Buyer Created").length;
  const avgDays = (buyers.reduce((sum, b) => sum + b.daysInStage, 0) / (totalBuyers || 1)).toFixed(1);
  const conversion = totalBuyers ? Math.round((liveBuyers / totalBuyers) * 100) : 0;

  const teamDetails = useMemo(() => TEAM_MEMBERS.map((name) => {
    const owned = buyers.filter((b) => b.owner === name);
    const live = owned.filter((b) => b.stage === "Live").length;
    const active = owned.filter((b) => b.active).length;
    return { name, total: owned.length, live, active, conv: owned.length ? Math.round((live / owned.length) * 100) : 0 };
  }).sort((a, b) => b.total - a.total), [buyers]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    VERTICALS.forEach((v) => { map[v] = 0; });
    buyers.forEach((b) => { map[b.vertical] = (map[b.vertical] || 0) + 1; });
    const entries = Object.entries(map).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
    return entries.map(([name, value], i) => ({
      name, value, pct: Math.round((value / total) * 100),
      gradient: VERTICAL_COLORS[i % VERTICAL_COLORS.length],
      color: ["#34d399","#10b981","#059669","#5eead4","#2dd4bf","#14b8a6","#047857","#6ee7b7"][i % 8],
    }));
  }, [buyers]);

  const donut = useMemo(() => {
    const top = categoryData.slice(0, 6);
    const total = top.reduce((s, c) => s + c.value, 0) || 1;
    const C = 2 * Math.PI * 70;
    let acc = 0;
    return top.map((c) => {
      const len = (c.value / total) * C;
      const seg = { ...c, len, offset: -acc };
      acc += len;
      return seg;
    });
  }, [categoryData]);

  const sparkPath = (data: number[]) => {
    const w = 100, h = 32;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1);
    const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`);
    return { line: `M${pts.join(" L")}`, area: `M0,${h} L${pts.join(" L")} L${w},${h} Z` };
  };

  const months = [
    { l: "Jan", v: 35 },{ l: "Feb", v: 42 },{ l: "Mar", v: 55 },{ l: "Apr", v: 48 },
    { l: "May", v: 60 },{ l: "Jun", v: 72 },{ l: "Jul", v: 65 },{ l: "Aug", v: 80 },
    { l: "Sep", v: 75 },{ l: "Oct", v: 88 },{ l: "Nov", v: 70 },{ l: "Dec", v: 92 },
  ];

  // Build SVG line path for area chart
  const chart = (() => {
    const w = 600, h = 180;
    const max = 100;
    const stepX = w / (months.length - 1);
    const pts = months.map((m, i) => `${i * stepX},${h - (m.v / max) * h}`);
    return { line: `M${pts.join(" L")}`, area: `M0,${h} L${pts.join(" L")} L${w},${h} Z`, points: pts };
  })();

  return (
    <div className="animate-fade-in space-y-5">
      {/* ===== HERO ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card via-card to-surface-container-high p-7">
        <div className="absolute -top-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-emerald-500/25 via-teal-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-sky-500/20 via-violet-500/10 to-transparent blur-3xl" />
        <div className="relative flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium mb-3">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative rounded-full bg-emerald-400 w-1.5 h-1.5" />
              </span>
              Live · Synced just now
            </div>
            <h1 className="text-4xl font-headline font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
              Welcome back, Nayeem
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              <span className="text-emerald-300 font-semibold">{liveBuyers} live</span> · <span className="text-foreground font-semibold">{activeBuyers} active</span> · <span className="text-amber-300 font-semibold">{stuckBuyers} need attention</span> — your funnel today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-container-high/80 backdrop-blur rounded-xl p-1 border border-border/40">
              {(["Week","Month","Year"] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-primary-foreground shadow-lg shadow-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}>{p}</button>
              ))}
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/40 text-sm font-medium text-foreground inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" /> Insights
            </button>
          </div>
        </div>
      </div>

      {/* ===== BENTO GRID ===== */}
      <div className="grid grid-cols-12 auto-rows-[140px] gap-4">
        {/* Hero KPI — Total Buyers, big */}
        <BentoCard className="col-span-12 md:col-span-5 row-span-2 group bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-400/20">
          <Glow className="from-emerald-500/30" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-400/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-300" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-emerald-400/10 text-emerald-300">
              <ArrowUpRight className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Total Buyers</p>
          <p className="text-6xl font-headline font-bold text-foreground tracking-tight mt-1">{totalBuyers}</p>
          <p className="text-sm text-muted-foreground mt-3">Across {categoryData.length} verticals, {TEAM_MEMBERS.length} owners</p>
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              {(() => {
                const p = sparkPath([22,28,26,34,31,42,48,55,52,64,70,78]);
                return (<>
                  <defs>
                    <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={p.area} fill="url(#ga)" />
                  <path d={p.line} fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>);
              })()}
            </svg>
          </div>
        </BentoCard>

        {/* Active */}
        <KpiTile className="col-span-6 md:col-span-3 row-span-1" tint="emerald" icon={Zap} label="Active" value={String(activeBuyers)} change="+4.2%" />
        {/* Conversion */}
        <KpiTile className="col-span-6 md:col-span-2 row-span-1" tint="neutral" icon={Target} label="Conv." value={`${conversion}%`} change="+2.1pt" />
        {/* Avg days */}
        <KpiTile className="col-span-6 md:col-span-2 row-span-1" tint="amber" icon={Clock} label="Avg days" value={avgDays} change="-2d" />

        {/* New buyers */}
        <BentoCard className="col-span-6 md:col-span-3 row-span-1">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">New today</p>
              <p className="text-3xl font-headline font-bold text-foreground mt-1 tabular-nums">{newBuyers}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-foreground/[0.06] ring-1 ring-foreground/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-foreground/70" />
            </div>
          </div>
        </BentoCard>

        {/* Stuck */}
        <BentoCard className="col-span-6 md:col-span-2 row-span-1 bg-gradient-to-br from-rose-500/10 via-card to-card border-rose-400/20">
          <a href="/pipeline" className="flex items-center justify-between h-full group">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-rose-300/80 font-semibold">Stuck</p>
              <p className="text-3xl font-headline font-bold text-foreground mt-1 tabular-nums">{stuckBuyers}</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
          </a>
        </BentoCard>

        {/* ===== VOLUME CHART — wide ===== */}
        <BentoCard className="col-span-12 md:col-span-7 row-span-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-300" /> Volume Trend
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Buyers onboarded per month · last 12 months</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> <span className="text-muted-foreground">Onboarded</span></span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-foreground/30" /> <span className="text-muted-foreground">Target</span></span>
            </div>
          </div>
          <div className="relative flex-1 -mx-2">
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaG" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0,1,2,3].map(i => (
                <line key={i} x1="0" x2="600" y1={i*60} y2={i*60} stroke="hsl(var(--border))" strokeOpacity="0.3" strokeDasharray="3,4" />
              ))}
              <path d={chart.area} fill="url(#areaG)" transform="translate(0, 10)" />
              <path d={chart.line} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 10)" />
              {chart.points.map((pt, i) => {
                const [x, y] = pt.split(",").map(Number);
                return <circle key={i} cx={x} cy={y + 10} r="3.5" fill="hsl(var(--background))" stroke="#34d399" strokeWidth="2" />;
              })}
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground px-1">
            {months.map(m => <span key={m.l}>{m.l}</span>)}
          </div>
        </BentoCard>

        {/* ===== DONUT — categories ===== */}
        <BentoCard className="col-span-12 md:col-span-5 row-span-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-300" /> By Category
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Top verticals</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center flex-1">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-auto max-w-[180px] -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--surface-container))" strokeWidth="14" />
                {donut.map((seg, i) => (
                  <circle key={i} cx="80" cy="80" r="70" fill="none"
                    stroke={seg.color} strokeWidth="14"
                    strokeDasharray={`${seg.len} ${2 * Math.PI * 70}`}
                    strokeDashoffset={seg.offset} />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-headline font-bold text-foreground tabular-nums">{totalBuyers}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Buyers</span>
              </div>
            </div>
            <div className="space-y-2">
              {donut.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
                    <span className="text-foreground truncate">{seg.name}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">{seg.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* ===== FUNNEL STAGES — wide ===== */}
        <BentoCard className="col-span-12 md:col-span-8 row-span-3">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-300" /> Funnel Stages
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Where buyers sit right now</p>
            </div>
            <a href="/pipeline" className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1">
              Open funnel <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            {(() => {
              const stages = [
                { label: "Buyer Created",       color: "from-emerald-300/40 to-teal-400/40",  chip: "bg-foreground/[0.06] text-foreground/80" },
                { label: "Paperwork",           color: "from-emerald-400/55 to-teal-500/55", chip: "bg-foreground/[0.08] text-foreground/85" },
                { label: "Creative Submission", color: "from-emerald-400/70 to-teal-500/70", chip: "bg-emerald-400/10 text-emerald-300/80" },
                { label: "Technical Setup",     color: "from-emerald-400/85 to-teal-500/85", chip: "bg-emerald-400/15 text-emerald-300" },
                { label: "Live",                color: "from-emerald-400 to-teal-500",       chip: "bg-emerald-400/20 text-emerald-200" },
              ];
              const counts = stages.map(s => buyers.filter(b => b.stage === s.label).length);
              const max = Math.max(...counts, 1);
              return stages.map((s, i) => (
                <div key={s.label} className="grid grid-cols-[150px_1fr_50px] items-center gap-3 group">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${s.chip} w-fit`}>{s.label}</span>
                  <div className="relative h-7 rounded-md bg-surface-container/50 overflow-hidden">
                    <div className={`h-full rounded-md bg-gradient-to-r ${s.color} shadow-lg transition-all duration-700`}
                         style={{ width: `${(counts[i] / max) * 100}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10 rounded-md" />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground text-right tabular-nums">{counts[i]}</span>
                </div>
              ));
            })()}
          </div>
        </BentoCard>

        {/* ===== ACTIVITY ===== */}
        <BentoCard className="col-span-12 md:col-span-4 row-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-300" /> Activity
            </h2>
            <span className="text-[11px] text-muted-foreground">Today</span>
          </div>
          <div className="space-y-1 flex-1 overflow-hidden">
            {activities.map((a, i) => (
              <div key={i} className="flex gap-2.5 p-2 rounded-lg hover:bg-foreground/[0.03] transition-colors cursor-pointer group">
                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${a.bg} ${a.color}`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{a.sub} · {a.time}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 self-center" />
              </div>
            ))}
          </div>
        </BentoCard>

        {/* ===== TEAM LEADERBOARD ===== */}
        <BentoCard className="col-span-12 md:col-span-7 row-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" /> Team Performance
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Ownership and conversion velocity</p>
            </div>
            <a href="/team" className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1">
              Full breakdown <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-1.5 flex-1 overflow-auto">
            {teamDetails.map((m, i) => {
              const initials = m.name.split(" ").map(n => n[0]).slice(0,2).join("");
              const maxTotal = Math.max(...teamDetails.map(t => t.total), 1);
              const pct = (m.total / maxTotal) * 100;
              const medal = i === 0 ? "from-amber-400 to-orange-500" : i === 1 ? "from-slate-300 to-slate-500" : i === 2 ? "from-orange-400 to-amber-700" : "from-emerald-500 to-teal-600";
              return (
                <div key={m.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 rounded-lg hover:bg-foreground/[0.03] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums w-3">{i + 1}</span>
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${medal} flex items-center justify-center text-xs font-bold text-primary-foreground shadow`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground">{m.live} live · {m.active} active</p>
                    </div>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-sm font-bold text-foreground tabular-nums w-6">{m.total}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${m.conv >= 50 ? "bg-emerald-400/10 text-emerald-300" : m.conv >= 25 ? "bg-amber-400/10 text-amber-300" : "bg-rose-400/10 text-rose-300"}`}>
                      {m.conv}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>

        {/* ===== ALL VERTICALS LIST ===== */}
        <BentoCard className="col-span-12 md:col-span-5 row-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-headline font-bold text-foreground flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-300" /> All Verticals
            </h2>
            <span className="text-[11px] text-muted-foreground">{categoryData.length} active</span>
          </div>
          <div className="space-y-2.5 flex-1 overflow-auto pr-1">
            {categoryData.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground truncate">{c.name}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums">{c.value} <span className="text-muted-foreground">· {c.pct}%</span></span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700`} style={{ width: `${Math.max(c.pct, 4)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
}

/* ---------- Reusable bento components ---------- */

function BentoCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/40 bg-card p-5 flex flex-col transition-all hover:border-border/70 ${className}`}>
      {children}
    </div>
  );
}

function Glow({ className }: { className: string }) {
  return <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br to-transparent blur-3xl opacity-60 pointer-events-none ${className}`} />;
}

function KpiTile({
  className = "", tint, icon: Icon, label, value, change,
}: { className?: string; tint: "neutral"|"amber"|"emerald"; icon: any; label: string; value: string; change: string }) {
  const map = {
    neutral: { chip: "bg-foreground/[0.06] text-foreground/80 ring-foreground/10", badge: "bg-foreground/[0.06] text-foreground/70" },
    amber:   { chip: "bg-amber-400/15 text-amber-300 ring-amber-400/30",           badge: "bg-amber-400/10 text-amber-300" },
    emerald: { chip: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",     badge: "bg-emerald-400/10 text-emerald-300" },
  }[tint];
  return (
    <BentoCard className={className}>
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg ${map.chip} ring-1 flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${map.badge} tabular-nums`}>{change}</span>
      </div>
      <p className="text-2xl font-headline font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </BentoCard>
  );
}
