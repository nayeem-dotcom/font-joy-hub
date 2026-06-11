import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Plus, User, Command, ArrowRight, ArrowLeft, Check, X, Search,
  AlertTriangle, ChevronDown, Keyboard, Zap, UserCog,
  Calendar as CalendarIcon,
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

const stageDot: Record<string, string> = {
  "Buyer Created": "bg-tertiary",
  "Paperwork": "bg-amber-500",
  "Creative Submission": "bg-purple-500",
  "Technical Setup": "bg-sky-500",
  "Live": "bg-primary",
  "Voided/Stuck": "bg-destructive",
};

export default function BuyerPipeline() {
  const { buyers, updateBuyerStage, updateBuyer } = useBuyers();
  const navigate = useNavigate();

  const [selectedBuyer, setSelectedBuyer] = useState<BuyerData | null>(null);
  const [cursorIdx, setCursorIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [filterMember, setFilterMember] = useState("All");
  const [filterVertical, setFilterVertical] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const paletteRef = useRef<HTMLInputElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  // Filtering
  const filtered = useMemo(() => {
    return buyers.filter((b) => {
      if (filterMember !== "All" && b.owner !== filterMember) return false;
      if (filterVertical !== "All" && b.vertical !== filterVertical) return false;
      if (filterStage !== "All" && b.stage !== filterStage) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !b.name.toLowerCase().includes(q) &&
          !b.company.toLowerCase().includes(q) &&
          !b.vertical.toLowerCase().includes(q) &&
          !b.owner.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [buyers, filterMember, filterVertical, filterStage, query]);

  useEffect(() => {
    if (cursorIdx >= filtered.length) setCursorIdx(Math.max(0, filtered.length - 1));
  }, [filtered.length, cursorIdx]);

  // Stage helpers
  const advance = useCallback((b: BuyerData, dir: 1 | -1) => {
    const i = FUNNEL_STEPS.indexOf(b.stage as any);
    if (i < 0) return;
    const next = FUNNEL_STEPS[Math.min(Math.max(i + dir, 0), FUNNEL_STEPS.length - 1)];
    if (next === b.stage) return;
    updateBuyerStage(b.id, next);
    toast({ title: `${b.company} → ${next}`, description: dir === 1 ? "Advanced to next stage" : "Moved back a stage" });
  }, [updateBuyerStage]);

  const setStage = useCallback((b: BuyerData, stage: string) => {
    if (stage === b.stage) return;
    updateBuyerStage(b.id, stage);
    toast({ title: `${b.company} → ${stage}` });
  }, [updateBuyerStage]);

  const bulkAdvance = useCallback(() => {
    if (!selectedIds.size) return;
    let moved = 0;
    selectedIds.forEach((id) => {
      const b = buyers.find((x) => x.id === id);
      if (!b) return;
      const i = FUNNEL_STEPS.indexOf(b.stage as any);
      if (i >= 0 && i < FUNNEL_STEPS.length - 1) {
        updateBuyerStage(id, FUNNEL_STEPS[i + 1]);
        moved++;
      }
    });
    toast({ title: `Advanced ${moved} buyer${moved === 1 ? "" : "s"}` });
    setSelectedIds(new Set());
  }, [selectedIds, buyers, updateBuyerStage]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA";

      // Command palette toggle
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (paletteOpen && e.key === "Escape") { setPaletteOpen(false); return; }
      if (selectedBuyer && e.key === "Escape") { setSelectedBuyer(null); return; }
      if (isTyping || paletteOpen || selectedBuyer) return;

      const cur = filtered[cursorIdx];
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setCursorIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setCursorIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "ArrowRight" && cur) {
        e.preventDefault();
        advance(cur, 1);
      } else if (e.key === "ArrowLeft" && cur) {
        e.preventDefault();
        advance(cur, -1);
      } else if (e.key === "Enter" && cur) {
        e.preventDefault();
        setSelectedBuyer(cur);
      } else if (e.key === " " && cur) {
        e.preventDefault();
        toggleSelect(cur.id);
      } else if (e.key.toLowerCase() === "v" && cur) {
        setStage(cur, "Voided/Stuck");
      } else if (e.key.toLowerCase() === "l" && cur) {
        setStage(cur, "Live");
      } else if (e.key === "/" || (e.shiftKey && e.key === "?")) {
        // focus search
        const el = document.getElementById("pipeline-search") as HTMLInputElement | null;
        el?.focus();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursorIdx, filtered, advance, setStage, paletteOpen, selectedBuyer]);

  // Scroll cursor row into view
  useEffect(() => {
    const row = rowsRef.current?.querySelector<HTMLElement>(`[data-row-idx="${cursorIdx}"]`);
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursorIdx]);

  useEffect(() => {
    if (paletteOpen) setTimeout(() => paletteRef.current?.focus(), 30);
    else setPaletteQuery("");
  }, [paletteOpen]);

  // Stage counts
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    ALL_STAGES.forEach((s) => { m[s] = 0; });
    buyers.forEach((b) => { m[b.stage] = (m[b.stage] ?? 0) + 1; });
    return m;
  }, [buyers]);

  const stageIdx = (s: string) => FUNNEL_STEPS.indexOf(s as any);

  // Palette actions
  const paletteActions = useMemo(() => {
    const cur = filtered[cursorIdx];
    const base = [
      cur && { label: `Advance "${cur.company}" →`, run: () => advance(cur, 1), hint: "→" },
      cur && { label: `Step back "${cur.company}" ←`, run: () => advance(cur, -1), hint: "←" },
      cur && { label: `Mark "${cur.company}" as Live`, run: () => setStage(cur, "Live"), hint: "L" },
      cur && { label: `Mark "${cur.company}" as Voided/Stuck`, run: () => setStage(cur, "Voided/Stuck"), hint: "V" },
      cur && { label: `Open profile: ${cur.company}`, run: () => setSelectedBuyer(cur), hint: "↵" },
      { label: "Add new buyer", run: () => navigate("/buyers/new") },
      selectedIds.size > 0 && { label: `Bulk advance ${selectedIds.size} selected`, run: bulkAdvance },
      ...ALL_STAGES.map((s) => cur && { label: `Move "${cur.company}" to ${s}`, run: () => setStage(cur, s) }),
    ].filter(Boolean) as { label: string; run: () => void; hint?: string }[];
    if (!paletteQuery.trim()) return base.slice(0, 8);
    const q = paletteQuery.toLowerCase();
    return base.filter((a) => a.label.toLowerCase().includes(q)).slice(0, 10);
  }, [filtered, cursorIdx, paletteQuery, advance, setStage, navigate, selectedIds, bulkAdvance]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buyer Funnel</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            Move buyers in seconds with the keyboard — no drag, no scroll.
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/80">
              <Keyboard className="w-3.5 h-3.5" />
              <Kbd>J</Kbd>/<Kbd>K</Kbd> nav · <Kbd>→</Kbd> advance · <Kbd>↵</Kbd> open · <Kbd>⌘K</Kbd> commands
            </span>
          </p>
        </div>
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-card text-sm text-muted-foreground hover:text-foreground transition"
        >
          <Command className="w-4 h-4" /> Command Bar
          <Kbd>⌘K</Kbd>
        </button>
      </div>

      {/* Stage chips */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilterStage("All")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${filterStage === "All" ? "bg-primary text-primary-foreground" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground"}`}
        >
          All <span className="opacity-70 ml-1">{buyers.length}</span>
        </button>
        {ALL_STAGES.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStage(s)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${filterStage === s ? "bg-primary text-primary-foreground" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${stageDot[s]}`} />
            {s}
            <span className="opacity-70">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Filter / search bar */}
      <div className="surface-card p-3 mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            id="pipeline-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, contact, owner, vertical…  (press /)"
            className="bg-transparent outline-none text-sm w-full"
          />
          {query && <button onClick={() => setQuery("")}><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
        </div>

        <FilterDropdown label="Member" value={filterMember} options={["All", ...TEAM_MEMBERS]} onChange={setFilterMember} />
        <FilterDropdown label="Vertical" value={filterVertical} options={["All", ...VERTICALS]} onChange={setFilterVertical} />

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card border border-border/40 text-sm text-foreground">
              <CalendarIcon className="w-3.5 h-3.5" />
              {dateFrom ? format(dateFrom, "MMM dd") : "From"}
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
              <CalendarIcon className="w-3.5 h-3.5" />
              {dateTo ? format(dateTo, "MMM dd") : "To"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="surface-card p-3 mb-4 flex items-center justify-between bg-primary/5 border border-primary/30">
          <span className="text-sm font-semibold text-foreground">{selectedIds.size} selected</span>
          <div className="flex items-center gap-2">
            <button onClick={bulkAdvance} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> Advance all
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 rounded-lg border border-border/40 text-xs font-semibold text-muted-foreground hover:text-foreground">Clear</button>
          </div>
        </div>
      )}

      {/* List */}
      <div ref={rowsRef} className="surface-card overflow-hidden">
        <div className="grid grid-cols-[36px_1.6fr_1fr_1fr_2fr_90px_120px] gap-3 px-4 py-2.5 bg-surface-container text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/30">
          <span></span>
          <span>Company / Contact</span>
          <span>Vertical</span>
          <span>Owner</span>
          <span>Stage</span>
          <span className="text-right">Days</span>
          <span className="text-right">Quick Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">No buyers match these filters.</div>
        )}

        {filtered.map((b, i) => {
          const idx = stageIdx(b.stage);
          const isCursor = i === cursorIdx;
          const isSel = selectedIds.has(b.id);
          const stuck = b.daysInStage > 7;
          return (
            <div
              key={b.id}
              data-row-idx={i}
              onClick={() => setCursorIdx(i)}
              onDoubleClick={() => setSelectedBuyer(b)}
              className={`grid grid-cols-[36px_1.6fr_1fr_1fr_2fr_90px_120px] gap-3 px-4 py-3 items-center border-b border-border/20 cursor-pointer transition-colors ${
                isCursor ? "bg-primary/10 ring-1 ring-inset ring-primary/40" : "hover:bg-accent/40"
              } ${isSel ? "bg-primary/5" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSel}
                onChange={(e) => { e.stopPropagation(); toggleSelect(b.id); }}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 accent-primary"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{b.company}</p>
                  {stuck && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">{b.name}</p>
              </div>
              <span className="text-xs text-foreground truncate">{b.vertical}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-xs text-foreground truncate">{b.owner}</span>
              </div>
              {/* Inline stepper */}
              <div className="flex items-center gap-1">
                {FUNNEL_STEPS.map((s, si) => {
                  const reached = idx >= si;
                  const isCurrent = idx === si;
                  return (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); setStage(b, s); }}
                      title={s}
                      className={`flex-1 h-1.5 rounded-full transition ${
                        b.stage === "Voided/Stuck"
                          ? "bg-destructive/30"
                          : reached
                          ? isCurrent ? "bg-primary" : "bg-primary/70"
                          : "bg-surface-container hover:bg-primary/30"
                      }`}
                    />
                  );
                })}
                <span className="text-[10px] font-semibold text-muted-foreground ml-2 w-24 truncate">{b.stage}</span>
              </div>
              <span className={`text-xs text-right font-semibold ${stuck ? "text-amber-500" : "text-foreground"}`}>{b.daysInStage}d</span>
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); advance(b, -1); }}
                  className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                  title="Step back (←)"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); advance(b, 1); }}
                  className="p-1.5 rounded-md gradient-primary text-primary-foreground"
                  title="Advance (→)"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setStage(b, "Voided/Stuck"); }}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  title="Mark voided (V)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/buyers/new")}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Detail Panel */}
      {selectedBuyer && (
        <BuyerDetailPanel
          buyer={selectedBuyer}
          onClose={() => setSelectedBuyer(null)}
          onUpdate={(u) => { updateBuyer(u); setSelectedBuyer(u); }}
        />
      )}

      {/* Command Palette */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-background/70 backdrop-blur-sm" onClick={() => setPaletteOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl surface-card overflow-hidden border border-border/60 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
              <Command className="w-4 h-4 text-muted-foreground" />
              <input
                ref={paletteRef}
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Type a command, buyer, or stage…"
                className="bg-transparent outline-none text-sm w-full"
              />
              <Kbd>esc</Kbd>
            </div>
            <div className="max-h-80 overflow-auto py-1">
              {paletteActions.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">No matches</div>
              )}
              {paletteActions.map((a, i) => (
                <button
                  key={i}
                  onClick={() => { a.run(); setPaletteOpen(false); }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-foreground hover:bg-accent transition"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <UserCog className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{a.label}</span>
                  </span>
                  {a.hint && <Kbd>{a.hint}</Kbd>}
                </button>
              ))}
            </div>
          </div>
        </div>
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/40 text-sm text-foreground"
      >
        <span className="text-muted-foreground text-xs">{label}:</span>
        {value === "All" ? `All ${label}s` : value}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 bg-card border border-border/40 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px] max-h-64 overflow-y-auto">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-accent transition ${value === o ? "text-primary" : "text-foreground"}`}
              >
                {value === o && <Check className="w-3 h-3 inline mr-1.5" />}
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
