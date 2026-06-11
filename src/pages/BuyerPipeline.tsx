import { useState, useMemo, useCallback } from "react";
import {
  ArrowRight, ArrowLeft, X, Clock, AlertTriangle, Building2,
  Calendar as CalendarIcon, Search, Sparkles, Filter, Layers,
  ChevronRight, MoreHorizontal, User as UserIcon, Zap,
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

// Lane theming per stage
const LANES = [
  { stage: "Buyer Created",       accent: "from-sky-400 to-blue-500",        chip: "bg-sky-400/15 text-sky-300 ring-sky-400/30",        dot: "bg-sky-400" },
  { stage: "Paperwork",           accent: "from-violet-400 to-purple-500",   chip: "bg-violet-400/15 text-violet-300 ring-violet-400/30",dot: "bg-violet-400" },
  { stage: "Creative Submission", accent: "from-fuchsia-400 to-pink-500",    chip: "bg-fuchsia-400/15 text-fuchsia-300 ring-fuchsia-400/30", dot: "bg-fuchsia-400" },
  { stage: "Technical Setup",     accent: "from-amber-400 to-orange-500",    chip: "bg-amber-400/15 text-amber-300 ring-amber-400/30",   dot: "bg-amber-400" },
  { stage: "Live",                accent: "from-emerald-400 to-teal-500",    chip: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30", dot: "bg-emerald-400" },
  { stage: "Voided/Stuck",        accent: "from-rose-400 to-red-500",        chip: "bg-rose-400/15 text-rose-300 ring-rose-400/30",      dot: "bg-rose-400" },
] as const;

export default function BuyerPipeline() {
  const { buyers, updateBuyerStage, updateBuyer } = useBuyers();
  const [profileOpen, setProfileOpen] = useState<BuyerData | null>(null);
  const [search, setSearch] = useState("");
  const [filterMember, setFilterMember] = useState("All");
  const [filterVertical, setFilterVertical] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [movingId, setMovingId] = useState<string | null>(null);

  const visible = useMemo(() => buyers.filter((b) => {
    if (filterMember !== "All" && b.owner !== filterMember) return false;
    if (filterVertical !== "All" && b.vertical !== filterVertical) return false;
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
  }), [buyers, filterMember, filterVertical, search]);

  const byStage = useMemo(() => {
    const map: Record<string, BuyerData[]> = {};
    LANES.forEach((l) => { map[l.stage] = []; });
    visible.forEach((b) => { if (map[b.stage]) map[b.stage].push(b); });
    return map;
  }, [visible]);

  const advance = useCallback((b: BuyerData) => {
    const i = FUNNEL_STEPS.indexOf(b.stage as any);
    if (i < 0 || i >= FUNNEL_STEPS.length - 1) return;
    setMovingId(b.id);
    const next = FUNNEL_STEPS[i + 1];
    setTimeout(() => {
      updateBuyerStage(b.id, next);
      toast({ title: `${b.company} → ${next}` });
      setMovingId(null);
    }, 280);
  }, [updateBuyerStage]);

  const stepBack = useCallback((b: BuyerData) => {
    const i = FUNNEL_STEPS.indexOf(b.stage as any);
    if (i <= 0) return;
    setMovingId(b.id);
    const prev = FUNNEL_STEPS[i - 1];
    setTimeout(() => {
      updateBuyerStage(b.id, prev);
      toast({ title: `${b.company} ← ${prev}` });
      setMovingId(null);
    }, 280);
  }, [updateBuyerStage]);

  const voidBuyer = useCallback((b: BuyerData) => {
    setMovingId(b.id);
    setTimeout(() => {
      updateBuyerStage(b.id, "Voided/Stuck");
      toast({ title: `${b.company} marked stuck` });
      setMovingId(null);
    }, 280);
  }, [updateBuyerStage]);

  const restore = useCallback((b: BuyerData) => {
    setMovingId(b.id);
    setTimeout(() => {
      updateBuyerStage(b.id, "Buyer Created");
      toast({ title: `${b.company} restored` });
      setMovingId(null);
    }, 280);
  }, [updateBuyerStage]);

  const totalVisible = visible.length;

  return (
    <div className="animate-fade-in space-y-5">
      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card via-card to-surface-container-high p-6">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="relative flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium mb-3">
              <Layers className="w-3 h-3" /> Swimlane funnel
            </div>
            <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">Buyer Funnel</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Click <ArrowRight className="inline w-3.5 h-3.5 text-emerald-300" /> to advance a buyer to the next lane. {totalVisible} buyers visible.
            </p>
          </div>
        </div>
      </div>

      {/* ===== FILTERS BAR ===== */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-3 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-input/60 rounded-lg px-3 py-2 flex-1 min-w-[240px]">
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
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border/40 text-sm text-foreground">
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
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border/40 text-sm text-foreground">
              <CalendarIcon className="w-3.5 h-3.5" /> {dateTo ? format(dateTo, "MMM dd") : "To"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* ===== SWIMLANES ===== */}
      <div className="space-y-3">
        {LANES.map((lane, laneIdx) => {
          const items = byStage[lane.stage] || [];
          const isLive = lane.stage === "Live";
          const isVoid = lane.stage === "Voided/Stuck";
          return (
            <div key={lane.stage} className="relative overflow-hidden rounded-2xl border border-border/40 bg-card group/lane">
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${lane.accent}`} />

              <div className="grid grid-cols-[220px_1fr] gap-3 items-center pl-4">
                {/* Lane header */}
                <div className="py-4 pr-2 border-r border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${lane.dot}`} />
                    <h3 className="text-sm font-headline font-bold text-foreground">{lane.stage}</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-headline font-bold text-foreground tabular-nums">{items.length}</span>
                    <span className="text-[11px] text-muted-foreground">buyer{items.length === 1 ? "" : "s"}</span>
                  </div>
                  {laneIdx < FUNNEL_STEPS.length - 1 && !isVoid && (
                    <p className="text-[10px] text-muted-foreground mt-1">→ {FUNNEL_STEPS[laneIdx + 1]}</p>
                  )}
                </div>

                {/* Lane cards (horizontal scroll) */}
                <div className="py-3 pr-4 overflow-x-auto">
                  {items.length === 0 ? (
                    <div className="h-[88px] flex items-center justify-center text-xs text-muted-foreground/60 italic border border-dashed border-border/30 rounded-lg">
                      No buyers here
                    </div>
                  ) : (
                    <div className="flex gap-2.5 min-w-min">
                      {items.map((b) => (
                        <MiniCard
                          key={b.id}
                          buyer={b}
                          lane={lane}
                          moving={movingId === b.id}
                          canAdvance={!isLive && !isVoid}
                          canBack={laneIdx > 0 && !isVoid}
                          onAdvance={() => advance(b)}
                          onBack={() => stepBack(b)}
                          onVoid={() => voidBuyer(b)}
                          onRestore={() => restore(b)}
                          onOpen={() => setProfileOpen(b)}
                          isVoid={isVoid}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {totalVisible === 0 && (
        <div className="rounded-2xl border border-border/40 bg-card p-16 text-center">
          <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
          <h2 className="text-xl font-headline font-bold text-foreground">Nothing matches</h2>
          <p className="text-muted-foreground mt-2">Try clearing filters or adjusting your search.</p>
        </div>
      )}

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

/* ---------- MiniCard ---------- */
function MiniCard({
  buyer, lane, moving, canAdvance, canBack, isVoid,
  onAdvance, onBack, onVoid, onRestore, onOpen,
}: {
  buyer: BuyerData;
  lane: typeof LANES[number];
  moving: boolean;
  canAdvance: boolean;
  canBack: boolean;
  isVoid: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onVoid: () => void;
  onRestore: () => void;
  onOpen: () => void;
}) {
  const stuck = buyer.daysInStage >= 5;
  const initials = buyer.company.split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase();

  return (
    <div
      className={`group relative w-[280px] shrink-0 rounded-xl border border-border/50 bg-surface-container/60 hover:bg-surface-container hover:border-border/80 transition-all overflow-hidden ${
        moving ? "translate-x-8 opacity-0" : "translate-x-0 opacity-100"
      }`}
      style={{ transitionDuration: "280ms" }}
    >
      {/* Top accent strip */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${lane.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />

      <button onClick={onOpen} className="w-full text-left p-3">
        <div className="flex items-start gap-2.5">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${lane.accent} flex items-center justify-center text-[11px] font-bold text-primary-foreground shadow shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">{buyer.company}</p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{buyer.name}</p>
          </div>
          {stuck && !isVoid && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
              <AlertTriangle className="w-2.5 h-2.5" />{buyer.daysInStage}d
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 text-muted-foreground">{buyer.vertical}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 text-muted-foreground inline-flex items-center gap-1">
            <UserIcon className="w-2.5 h-2.5" /> {buyer.owner.split(" ")[0]}
          </span>
        </div>
      </button>

      {/* Action rail */}
      <div className="flex items-center justify-between border-t border-border/40 bg-foreground/[0.02] px-2 py-1.5">
        <div className="flex items-center gap-1">
          {canBack && (
            <button onClick={(e) => { e.stopPropagation(); onBack(); }}
                    title="Step back"
                    className="p-1.5 rounded hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {!isVoid ? (
            <button onClick={(e) => { e.stopPropagation(); onVoid(); }}
                    title="Mark stuck"
                    className="p-1.5 rounded hover:bg-rose-400/10 text-muted-foreground hover:text-rose-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onRestore(); }}
                    title="Restore"
                    className="p-1.5 rounded hover:bg-emerald-400/10 text-muted-foreground hover:text-emerald-300 transition-colors text-[10px] font-semibold px-2">
              Restore
            </button>
          )}
        </div>
        {canAdvance && (
          <button onClick={(e) => { e.stopPropagation(); onAdvance(); }}
                  title="Advance to next lane"
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gradient-to-r ${lane.accent} text-primary-foreground shadow hover:shadow-lg hover:-translate-y-px transition-all`}>
            Advance <ArrowRight className="w-3 h-3" />
          </button>
        )}
        {!canAdvance && !isVoid && (
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300">
            <Zap className="w-3 h-3" /> Live
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- FilterDropdown ---------- */
function FilterDropdown({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[] | string[]; onChange: (v: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-border/40 text-sm text-foreground">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{label}:</span>
          <span className="font-medium">{value}</span>
          <ChevronRight className="w-3 h-3 text-muted-foreground rotate-90" />
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
