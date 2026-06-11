import { useState, useMemo, useCallback } from "react";
import {
  ArrowRight, X, AlertTriangle, Calendar as CalendarIcon, Search, Sparkles,
  Filter, Layers, ChevronDown, Check, ArrowUpDown, MoreHorizontal,
} from "lucide-react";
import {
  useBuyers, FUNNEL_STEPS, VERTICALS, TEAM_MEMBERS, ALL_STAGES,
  type BuyerData,
} from "@/contexts/BuyerContext";
import BuyerDetailPanel from "@/components/BuyerDetailPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const STAGE_THEME: Record<string, { dot: string; chip: string; hover: string }> = {
  "Buyer Created":       { dot: "bg-slate-400",  chip: "bg-slate-100 text-slate-700 ring-slate-200",    hover: "hover:bg-slate-200" },
  "Paperwork":           { dot: "bg-violet-500", chip: "bg-violet-100 text-violet-700 ring-violet-200", hover: "hover:bg-violet-200" },
  "Creative Submission": { dot: "bg-sky-500",    chip: "bg-sky-100 text-sky-700 ring-sky-200",          hover: "hover:bg-sky-200" },
  "Technical Setup":     { dot: "bg-amber-500",  chip: "bg-amber-100 text-amber-700 ring-amber-200",    hover: "hover:bg-amber-200" },
  "Live":                { dot: "bg-emerald-500",chip: "bg-emerald-100 text-emerald-700 ring-emerald-200", hover: "hover:bg-emerald-200" },
  "Voided/Stuck":        { dot: "bg-rose-500",   chip: "bg-rose-100 text-rose-700 ring-rose-200",       hover: "hover:bg-rose-200" },
};

type SortKey = "company" | "stage" | "owner" | "vertical" | "daysInStage";

export default function BuyerPipeline() {
  const { buyers, updateBuyerStage, updateBuyer } = useBuyers();
  const [profileOpen, setProfileOpen] = useState<BuyerData | null>(null);
  const [search, setSearch] = useState("");
  const [filterMember, setFilterMember] = useState("All");
  const [filterVertical, setFilterVertical] = useState("All");
  const [filterStage, setFilterStage] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortKey, setSortKey] = useState<SortKey>("daysInStage");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [movingId, setMovingId] = useState<string | null>(null);

  const filtered = useMemo(() => buyers.filter((b) => {
    if (filterMember !== "All" && b.owner !== filterMember) return false;
    if (filterVertical !== "All" && b.vertical !== filterVertical) return false;
    if (filterStage !== "All" && b.stage !== filterStage) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !b.name.toLowerCase().includes(q) &&
        !b.company.toLowerCase().includes(q) &&
        !b.vertical.toLowerCase().includes(q) &&
        !b.owner.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  }), [buyers, filterMember, filterVertical, filterStage, search]);

  const visible = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] as any, bv = b[sortKey] as any;
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const stageCounts = useMemo(() => {
    const m: Record<string, number> = {};
    ALL_STAGES.forEach((s) => (m[s] = 0));
    filtered.forEach((b) => { m[b.stage] = (m[b.stage] || 0) + 1; });
    return m;
  }, [filtered]);

  const setStage = useCallback((b: BuyerData, next: string) => {
    if (next === b.stage) return;
    setMovingId(b.id);
    setTimeout(() => {
      updateBuyerStage(b.id, next);
      toast({ title: `${b.company} → ${next}` });
      setMovingId(null);
    }, 200);
  }, [updateBuyerStage]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const totalVisible = visible.length;

  return (
    <div className="animate-fade-in space-y-4">
      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(220_70%_35%/0.06),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/30 to-transparent" />
        <div className="relative flex items-end justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-700/[0.08] border border-blue-700/15 text-blue-700 text-[11px] font-semibold tracking-wide mb-3">
              <Layers className="w-3 h-3" /> BUYER FUNNEL
            </div>
            <h1 className="text-[2.25rem] leading-[1.05] font-headline font-bold tracking-tight text-foreground">
              Your pipeline, one click away
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm max-w-2xl">
              <span className="text-foreground font-semibold tabular-nums">{totalVisible}</span> buyers ·
              Click any <span className="mx-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px] ring-1 ring-emerald-200">stage pill</span>
              to instantly move a buyer to a different stage. Sort columns by clicking headers.
            </p>
          </div>
        </div>
      </div>

      {/* ===== STAGE TABS ===== */}
      <div className="rounded-2xl border border-border/50 bg-card p-2 flex items-center gap-1 flex-wrap">
        <StageTab label="All stages" count={filtered.length} active={filterStage === "All"} onClick={() => setFilterStage("All")} />
        {ALL_STAGES.map((s) => (
          <StageTab key={s} label={s} count={stageCounts[s] || 0} active={filterStage === s}
                    dot={STAGE_THEME[s].dot} onClick={() => setFilterStage(s)} />
        ))}
      </div>

      {/* ===== FILTERS BAR ===== */}
      <div className="rounded-2xl border border-border/50 bg-card p-3 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1 min-w-[240px] ring-1 ring-border/30 focus-within:ring-blue-700/30">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search company, contact, vertical, owner…"
                 className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground" />
          {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
        </div>
        <FilterDropdown label="Member" value={filterMember} options={["All", ...TEAM_MEMBERS]} onChange={setFilterMember} />
        <FilterDropdown label="Vertical" value={filterVertical} options={["All", ...VERTICALS]} onChange={setFilterVertical} />
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/50 text-sm text-foreground">
              <CalendarIcon className="w-3.5 h-3.5" /> {dateFrom ? format(dateFrom, "MMM dd") : "From"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground text-xs">—</span>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/50 text-sm text-foreground">
              <CalendarIcon className="w-3.5 h-3.5" /> {dateTo ? format(dateTo, "MMM dd") : "To"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* ===== TABLE ===== */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.4fr)_minmax(140px,1fr)_minmax(140px,1fr)_90px_44px] gap-3 px-4 py-2.5 bg-muted/40 border-b border-border/50 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          <SortHeader label="Buyer" k="company" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
          <SortHeader label="Stage" k="stage" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
          <SortHeader label="Owner" k="owner" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
          <SortHeader label="Vertical" k="vertical" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
          <SortHeader label="Days" k="daysInStage" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} align="right" />
          <span />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/40">
          {visible.map((b) => (
            <BuyerRow key={b.id} buyer={b} moving={movingId === b.id}
                      onOpen={() => setProfileOpen(b)} onSetStage={(s) => setStage(b, s)} />
          ))}
          {visible.length === 0 && (
            <div className="py-16 text-center">
              <Sparkles className="w-10 h-10 text-blue-700 mx-auto mb-3" />
              <h2 className="text-base font-headline font-bold text-foreground">Nothing matches</h2>
              <p className="text-sm text-muted-foreground mt-1">Try clearing filters or adjusting your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {visible.length > 0 && (
          <div className="px-4 py-2.5 bg-muted/30 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Showing <span className="text-foreground font-semibold tabular-nums">{visible.length}</span> of {buyers.length} buyers</span>
            <span className="hidden sm:inline">Tip: click the colored stage pill to change a buyer&apos;s stage.</span>
          </div>
        )}
      </div>

      {profileOpen && (
        <BuyerDetailPanel
          buyer={profileOpen}
          onClose={() => setProfileOpen(null)}
          onUpdate={(u) => { updateBuyer(u); setProfileOpen(u); }}
        />
      )}
    </div>
  );
}

/* ---------- StageTab ---------- */
function StageTab({ label, count, active, dot, onClick }: { label: string; count: number; active: boolean; dot?: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              active ? "bg-blue-700 text-primary-foreground shadow shadow-blue-700/25" : "text-foreground/80 hover:bg-muted"
            }`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white" : dot}`} />}
      <span>{label}</span>
      <span className={`tabular-nums px-1.5 rounded text-[10px] ${active ? "bg-white/20 text-white" : "bg-foreground/[0.08] text-muted-foreground"}`}>{count}</span>
    </button>
  );
}

/* ---------- SortHeader ---------- */
function SortHeader({ label, k, sortKey, sortDir, onClick, align = "left" }: {
  label: string; k: SortKey; sortKey: SortKey; sortDir: "asc" | "desc"; onClick: (k: SortKey) => void; align?: "left" | "right";
}) {
  const active = sortKey === k;
  return (
    <button onClick={() => onClick(k)}
            className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${align === "right" ? "justify-end" : ""} ${active ? "text-foreground" : ""}`}>
      {label}
      <ArrowUpDown className={`w-3 h-3 ${active ? "text-blue-700" : "opacity-40"} ${active && sortDir === "desc" ? "rotate-180" : ""} transition-transform`} />
    </button>
  );
}

/* ---------- BuyerRow ---------- */
function BuyerRow({ buyer, moving, onOpen, onSetStage }: {
  buyer: BuyerData; moving: boolean; onOpen: () => void; onSetStage: (s: string) => void;
}) {
  const initials = buyer.company.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const stuck = buyer.daysInStage >= 5 && buyer.stage !== "Live" && buyer.stage !== "Voided/Stuck";
  const theme = STAGE_THEME[buyer.stage] || STAGE_THEME["Buyer Created"];
  return (
    <div className={`grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.4fr)_minmax(140px,1fr)_minmax(140px,1fr)_90px_44px] gap-3 items-center px-4 py-2.5 hover:bg-muted/40 transition-all ${moving ? "opacity-40 -translate-x-2" : "opacity-100"}`}
         style={{ transitionDuration: "200ms" }}>
      {/* Buyer */}
      <button onClick={onOpen} className="flex items-center gap-3 min-w-0 text-left">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-blue-800 flex items-center justify-center text-[11px] font-bold text-primary-foreground shadow shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">{buyer.company}</p>
          <p className="text-[11px] text-muted-foreground truncate">{buyer.name}</p>
        </div>
      </button>

      {/* Stage pill (interactive) */}
      <StagePicker current={buyer.stage} onPick={onSetStage} />

      {/* Owner */}
      <span className="text-sm text-foreground truncate">{buyer.owner}</span>

      {/* Vertical */}
      <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground/70 w-fit truncate">{buyer.vertical}</span>

      {/* Days */}
      <div className="text-right">
        {stuck ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 ring-1 ring-amber-200 px-1.5 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" />{buyer.daysInStage}d
          </span>
        ) : (
          <span className="text-sm text-muted-foreground tabular-nums">{buyer.daysInStage}d</span>
        )}
      </div>

      {/* Open */}
      <button onClick={onOpen} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors justify-self-end" title="Open buyer">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---------- StagePicker ---------- */
function StagePicker({ current, onPick }: { current: string; onPick: (s: string) => void }) {
  const theme = STAGE_THEME[current] || STAGE_THEME["Buyer Created"];
  const currentIdx = FUNNEL_STEPS.indexOf(current as any);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 transition-all ${theme.chip} ${theme.hover} w-fit`}>
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          {current}
          <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-1.5" align="start">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-2 py-1">Move to stage</p>
        {ALL_STAGES.map((s, i) => {
          const t = STAGE_THEME[s];
          const isNext = i === currentIdx + 1 && currentIdx >= 0 && currentIdx < FUNNEL_STEPS.length - 1;
          return (
            <button key={s} onClick={() => onPick(s)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors ${s === current ? "bg-muted/60" : ""}`}>
              <span className={`w-2 h-2 rounded-full ${t.dot}`} />
              <span className="flex-1 text-left text-foreground">{s}</span>
              {isNext && <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">NEXT</span>}
              {s === current && <Check className="w-3.5 h-3.5 text-blue-700" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

/* ---------- FilterDropdown ---------- */
function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[] | string[]; onChange: (v: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/50 text-sm text-foreground">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium">{value}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="end">
        <div className="max-h-72 overflow-auto">
          {options.map((o) => (
            <button key={o} onClick={() => onChange(o)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm hover:bg-accent ${value === o ? "bg-accent font-semibold" : ""}`}>
              {o}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
