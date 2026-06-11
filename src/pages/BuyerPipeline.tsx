import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ArrowRight, ArrowLeft, Check, X, Clock, AlertTriangle, User,
  Inbox, ChevronDown, Calendar as CalendarIcon, FileText, Zap,
  UserCog, Building2, Tag, ChevronRight, MessageSquare, ExternalLink, Search,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useBuyers, FUNNEL_STEPS, VERTICALS, TEAM_MEMBERS, ALL_STAGES,
  type BuyerData,
} from "@/contexts/BuyerContext";
import BuyerDetailPanel from "@/components/BuyerDetailPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

type QueueFilter = "needs_action" | "stuck" | "all";

const stageDot: Record<string, string> = {
  "Buyer Created": "bg-tertiary",
  "Paperwork": "bg-amber-500",
  "Creative Submission": "bg-purple-500",
  "Technical Setup": "bg-sky-500",
  "Live": "bg-primary",
  "Voided/Stuck": "bg-destructive",
};

const stageActionLabel: Record<string, string> = {
  "Buyer Created": "Send paperwork",
  "Paperwork": "Approve & request creatives",
  "Creative Submission": "Approve creatives",
  "Technical Setup": "Confirm tracking & go live",
  "Live": "Already live",
  "Voided/Stuck": "Re-engage buyer",
};

export default function BuyerPipeline() {
  const { buyers, updateBuyerStage, updateBuyer } = useBuyers();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState<BuyerData | null>(null);
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("needs_action");
  const [filterMember, setFilterMember] = useState("All");
  const [filterVertical, setFilterVertical] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Build queue
  const queue = useMemo(() => {
    return buyers
      .filter((b) => {
        if (snoozed.has(b.id)) return false;
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
        if (queueFilter === "needs_action") {
          if (b.stage === "Live") return false;
        } else if (queueFilter === "stuck") {
          if (b.daysInStage < 5) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Priority: voided/stuck first, then most-days-in-stage
        const sa = a.stage === "Voided/Stuck" ? -1 : 0;
        const sb = b.stage === "Voided/Stuck" ? -1 : 0;
        if (sa !== sb) return sa - sb;
        return b.daysInStage - a.daysInStage;
      });
  }, [buyers, snoozed, queueFilter, filterMember, filterVertical, filterStage, search]);

  // Active buyer (always points at first in queue unless user picks)
  const active = useMemo(() => {
    if (activeId) {
      const found = buyers.find((b) => b.id === activeId);
      if (found && queue.some((q) => q.id === activeId)) return found;
    }
    return queue[0] ?? null;
  }, [activeId, queue, buyers]);

  useEffect(() => {
    if (active && !activeId) setActiveId(active.id);
    if (active && activeId !== active.id && !queue.some((q) => q.id === activeId)) {
      setActiveId(active.id);
    }
  }, [active, activeId, queue]);

  const stageIdx = (s: string) => FUNNEL_STEPS.indexOf(s as any);

  const nextInQueue = useCallback(() => {
    if (!active) return;
    const i = queue.findIndex((b) => b.id === active.id);
    const next = queue[i + 1] ?? queue[0];
    if (next) setActiveId(next.id);
  }, [active, queue]);

  const prevInQueue = useCallback(() => {
    if (!active) return;
    const i = queue.findIndex((b) => b.id === active.id);
    const prev = queue[i - 1] ?? queue[queue.length - 1];
    if (prev) setActiveId(prev.id);
  }, [active, queue]);

  const advance = useCallback((b: BuyerData) => {
    const i = stageIdx(b.stage);
    if (i < 0 || i >= FUNNEL_STEPS.length - 1) return;
    updateBuyerStage(b.id, FUNNEL_STEPS[i + 1]);
    toast({ title: `${b.company} → ${FUNNEL_STEPS[i + 1]}` });
    setTimeout(nextInQueue, 50);
  }, [updateBuyerStage, nextInQueue]);

  const stepBack = useCallback((b: BuyerData) => {
    const i = stageIdx(b.stage);
    if (i <= 0) return;
    updateBuyerStage(b.id, FUNNEL_STEPS[i - 1]);
    toast({ title: `${b.company} ← ${FUNNEL_STEPS[i - 1]}` });
  }, [updateBuyerStage]);

  const setStage = useCallback((b: BuyerData, s: string) => {
    if (s === b.stage) return;
    updateBuyerStage(b.id, s);
    toast({ title: `${b.company} → ${s}` });
    setTimeout(nextInQueue, 50);
  }, [updateBuyerStage, nextInQueue]);

  const snooze = useCallback((b: BuyerData) => {
    setSnoozed((p) => new Set([...p, b.id]));
    toast({ title: `Snoozed ${b.company} for today` });
    setTimeout(nextInQueue, 50);
  }, [nextInQueue]);

  const reassign = useCallback((b: BuyerData, owner: string) => {
    updateBuyer({ ...b, owner });
    toast({ title: `${b.company} reassigned to ${owner}` });
  }, [updateBuyer]);

  // Keyboard shortcuts (only when not typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || profileOpen) return;
      if (!active) return;
      if (e.key === "ArrowDown" || e.key === "j") { e.preventDefault(); nextInQueue(); }
      else if (e.key === "ArrowUp" || e.key === "k") { e.preventDefault(); prevInQueue(); }
      else if (e.key === "ArrowRight" || e.key === "Enter") { e.preventDefault(); advance(active); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); stepBack(active); }
      else if (e.key.toLowerCase() === "s") snooze(active);
      else if (e.key.toLowerCase() === "l") setStage(active, "Live");
      else if (e.key.toLowerCase() === "v") setStage(active, "Voided/Stuck");
      else if (e.key.toLowerCase() === "o") setProfileOpen(active);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, nextInQueue, prevInQueue, advance, stepBack, snooze, setStage, profileOpen]);

  const queueCounts = useMemo(() => {
    const needs = buyers.filter((b) => b.stage !== "Live" && !snoozed.has(b.id)).length;
    const stuck = buyers.filter((b) => b.daysInStage >= 5 && !snoozed.has(b.id)).length;
    return { needs, stuck, all: buyers.filter((b) => !snoozed.has(b.id)).length };
  }, [buyers, snoozed]);

  const idx = active ? stageIdx(active.stage) : -1;
  const positionInQueue = active ? queue.findIndex((b) => b.id === active.id) + 1 : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Inbox className="w-7 h-7 text-primary" /> Triage Inbox
          </h1>
          <p className="text-muted-foreground mt-1">
            Clear your buyer queue one card at a time — focus, decide, move on.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs<QueueFilter>
            value={queueFilter}
            onChange={setQueueFilter}
            options={[
              { value: "needs_action", label: "Needs Action", count: queueCounts.needs },
              { value: "stuck", label: "Stuck", count: queueCounts.stuck },
              { value: "all", label: "All Active", count: queueCounts.all },
            ]}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="surface-card p-3 mb-6 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company, contact, owner…" className="bg-transparent outline-none text-sm w-full" />
          {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
        </div>
        <FilterDropdown label="Member" value={filterMember} options={["All", ...TEAM_MEMBERS]} onChange={setFilterMember} />
        <FilterDropdown label="Vertical" value={filterVertical} options={["All", ...VERTICALS]} onChange={setFilterVertical} />
        <FilterDropdown label="Stage" value={filterStage} options={["All", ...ALL_STAGES]} onChange={setFilterStage} />
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border/40 text-sm text-foreground">
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
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border/40 text-sm text-foreground">
              <CalendarIcon className="w-3.5 h-3.5" /> {dateTo ? format(dateTo, "MMM dd") : "To"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-[320px_1fr] gap-6 min-h-[680px]">
        {/* Queue */}
        <aside className="surface-card overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Queue</p>
            <span className="text-xs text-muted-foreground">{queue.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {queue.length === 0 && (
              <div className="p-8 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Inbox zero</p>
                <p className="text-xs text-muted-foreground mt-1">Nothing needs attention right now.</p>
              </div>
            )}
            {queue.map((b) => {
              const isActive = active?.id === b.id;
              const stuck = b.daysInStage >= 5;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveId(b.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border/20 transition flex items-center gap-3 ${
                    isActive ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-accent/40"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${stageDot[b.stage]} shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{b.company}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.stage} · {b.owner.split(" ")[0]}</p>
                  </div>
                  {stuck && (
                    <span className="text-[10px] font-semibold text-amber-500 flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3" /> {b.daysInStage}d
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Focus card */}
        <section className="relative">
          {active ? (
            <FocusCard
              key={active.id}
              buyer={active}
              idx={idx}
              position={positionInQueue}
              total={queue.length}
              onAdvance={() => advance(active)}
              onStepBack={() => stepBack(active)}
              onSnooze={() => snooze(active)}
              onMarkLive={() => setStage(active, "Live")}
              onVoid={() => setStage(active, "Voided/Stuck")}
              onSetStage={(s) => setStage(active, s)}
              onReassign={(o) => reassign(active, o)}
              onOpenProfile={() => setProfileOpen(active)}
              onPrev={prevInQueue}
              onNext={nextInQueue}
            />
          ) : (
            <div className="surface-card p-16 text-center">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground">You're all caught up</h2>
              <p className="text-muted-foreground mt-2">No buyers in the queue match your filters.</p>
            </div>
          )}
        </section>
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

function FocusCard({
  buyer, idx, position, total,
  onAdvance, onStepBack, onSnooze, onMarkLive, onVoid, onSetStage, onReassign, onOpenProfile, onPrev, onNext,
}: {
  buyer: BuyerData;
  idx: number;
  position: number;
  total: number;
  onAdvance: () => void;
  onStepBack: () => void;
  onSnooze: () => void;
  onMarkLive: () => void;
  onVoid: () => void;
  onSetStage: (s: string) => void;
  onReassign: (o: string) => void;
  onOpenProfile: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const stuck = buyer.daysInStage >= 5;
  const nextStage = idx >= 0 && idx < FUNNEL_STEPS.length - 1 ? FUNNEL_STEPS[idx + 1] : null;

  return (
    <div className="surface-card overflow-hidden animate-fade-in">
      {/* Top bar */}
      <div className="px-6 py-3 border-b border-border/30 flex items-center justify-between bg-surface-container/40">
        <span className="text-xs text-muted-foreground">{position} of {total} in queue</span>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-1.5 rounded hover:bg-accent text-muted-foreground"><ArrowLeft className="w-4 h-4" /></button>
          <button onClick={onNext} className="p-1.5 rounded hover:bg-accent text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={onOpenProfile} className="ml-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Full profile <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{buyer.company}</h2>
              <p className="text-sm text-muted-foreground">{buyer.name} · {buyer.tier}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill icon={Tag}>{buyer.vertical}</Pill>
            <Pill icon={User}>{buyer.owner}</Pill>
            <Pill icon={Clock} tone={stuck ? "warn" : "muted"}>
              {buyer.daysInStage}d in {buyer.stage}
            </Pill>
          </div>
        </div>

        {stuck && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            This buyer has been in <strong className="mx-1">{buyer.stage}</strong> for {buyer.daysInStage} days. Consider re-engaging or voiding.
          </div>
        )}

        {/* Stage progress */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            {FUNNEL_STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => onSetStage(s)}
                title={`Jump to ${s}`}
                className={`flex-1 h-2 rounded-full transition ${
                  buyer.stage === "Voided/Stuck"
                    ? "bg-destructive/30"
                    : i <= idx
                    ? i === idx ? "bg-primary" : "bg-primary/70"
                    : "bg-surface-container hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            {FUNNEL_STEPS.map((s) => (
              <span key={s} className={`truncate ${s === buyer.stage ? "text-foreground font-semibold" : ""}`}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Action area */}
      <div className="px-8 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Next step</p>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-stretch">
          <button
            onClick={onAdvance}
            disabled={!nextStage}
            className="flex items-center justify-between gap-3 p-5 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40 transition"
          >
            <span className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              <span className="text-left">
                <span className="block">{stageActionLabel[buyer.stage] ?? "Advance"}</span>
                {nextStage && <span className="block text-xs opacity-80 font-normal">→ {nextStage}</span>}
              </span>
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <ActionBtn icon={Clock} label="Snooze" hint="S" onClick={onSnooze} />
          <ActionBtn icon={Check} label="Mark Live" hint="L" tone="primary" onClick={onMarkLive} />
          <ActionBtn icon={X} label="Void" hint="V" tone="danger" onClick={onVoid} />
        </div>

        <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button onClick={onStepBack} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border/40">
              <ArrowLeft className="w-3.5 h-3.5" /> Step back
            </button>
            <ReassignPicker current={buyer.owner} onPick={onReassign} />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Kbd>→</Kbd> advance · <Kbd>S</Kbd> snooze · <Kbd>L</Kbd> live · <Kbd>V</Kbd> void · <Kbd>↑</Kbd>/<Kbd>↓</Kbd> queue
          </p>
        </div>
      </div>

      {/* Context strip */}
      <div className="border-t border-border/30 grid grid-cols-3 divide-x divide-border/30">
        <Stat label="In since" value={buyer.inDate} icon={CalendarIcon} />
        <Stat label="Live date" value={buyer.liveDate} icon={Sparkles} />
        <Stat label="Tier" value={buyer.tier} icon={Tag} />
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, hint, onClick, tone = "neutral" }: { icon: any; label: string; hint?: string; onClick: () => void; tone?: "neutral" | "primary" | "danger" }) {
  const styles =
    tone === "primary" ? "border-primary/40 text-primary hover:bg-primary/10"
      : tone === "danger" ? "border-destructive/30 text-destructive hover:bg-destructive/10"
      : "border-border/50 text-foreground hover:bg-accent";
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 px-5 py-4 rounded-2xl border ${styles} transition`}>
      <Icon className="w-5 h-5" />
      <span className="text-xs font-semibold">{label}</span>
      {hint && <Kbd>{hint}</Kbd>}
    </button>
  );
}

function Pill({ icon: Icon, children, tone = "muted" }: { icon: any; children: React.ReactNode; tone?: "muted" | "warn" }) {
  const cls = tone === "warn" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-surface-container text-muted-foreground border-border/40";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <Icon className="w-3 h-3" /> {children}
    </span>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="px-6 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className="text-sm font-semibold text-foreground mt-1">{value}</p>
    </div>
  );
}

function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count: number }[] }) {
  return (
    <div className="flex items-center bg-card border border-border/40 rounded-xl p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
            value === o.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
          <span className={`text-xs px-1.5 rounded ${value === o.value ? "bg-primary-foreground/20" : "bg-surface-container"}`}>{o.count}</span>
        </button>
      ))}
    </div>
  );
}

function ReassignPicker({ current, onPick }: { current: string; onPick: (m: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border/40">
        <UserCog className="w-3.5 h-3.5" /> Reassign
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border/40 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px]">
            {TEAM_MEMBERS.map((m) => (
              <button
                key={m}
                onClick={() => { onPick(m); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-accent transition ${m === current ? "text-primary" : "text-foreground"}`}
              >
                {m === current && <Check className="w-3 h-3 inline mr-1.5" />} {m}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border/50 bg-card text-[10px] font-semibold text-muted-foreground">
      {children}
    </kbd>
  );
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: readonly string[] | string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/40 text-sm text-foreground">
        <span className="text-muted-foreground text-xs">{label}:</span>
        {value === "All" ? `All` : value}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-card border border-border/40 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px] max-h-64 overflow-y-auto">
            {options.map((o) => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-accent transition ${value === o ? "text-primary" : "text-foreground"}`}>
                {value === o && <Check className="w-3 h-3 inline mr-1.5" />}{o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
