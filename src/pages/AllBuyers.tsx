import { useState } from "react";
import { Download, Plus, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Filter, User, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import BuyerDetailPanel from "@/components/BuyerDetailPanel";
import { useBuyers, VERTICALS, FUNNEL_STEPS, TEAM_MEMBERS, type BuyerData } from "@/contexts/BuyerContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export type { BuyerData } from "@/contexts/BuyerContext";

const verticalColors: Record<string, string> = {
  "Insurance": "bg-primary/10 text-primary",
  "Home Improvement": "bg-tertiary/10 text-tertiary",
  "Financial Services": "bg-primary-container/10 text-primary-container",
  "Credit Score": "bg-inverse-surface/10 text-foreground",
  "Nutra": "bg-primary/10 text-primary",
  "Sweepstakes": "bg-tertiary/10 text-tertiary",
  "Legal": "bg-primary-container/10 text-primary-container",
  "Firearms & Safety": "bg-tertiary/10 text-tertiary",
  "Rewards": "bg-primary/10 text-primary",
  "Travel": "bg-primary-container/10 text-primary-container",
  "Education": "bg-tertiary/10 text-tertiary",
  "Ecommerce": "bg-primary/10 text-primary",
  "Other": "bg-surface-container text-muted-foreground",
};

export default function AllBuyers() {
  const { buyers, updateBuyer } = useBuyers();
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerData | null>(null);
  const [filterVertical, setFilterVertical] = useState<string>("All");
  const [filterStage, setFilterStage] = useState<string>("All");
  const [showVerticalDD, setShowVerticalDD] = useState(false);
  const [showStageDD, setShowStageDD] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const handleUpdateBuyer = (updated: BuyerData) => {
    updateBuyer(updated);
    setSelectedBuyer(updated);
  };

  const parseDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const filteredBuyers = buyers.filter((b) => {
    if (filterVertical !== "All" && b.vertical !== filterVertical) return false;
    if (filterStage !== "All" && b.stage !== filterStage) return false;
    if (dateFrom || dateTo) {
      const bDate = parseDate(b.inDate);
      if (!bDate) return false;
      if (dateFrom && bDate < dateFrom) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (bDate > end) return false;
      }
    }
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Buyers</h1>
          <p className="text-muted-foreground mt-1">Managing {buyers.filter(b => b.active).length} active buyers across {new Set(buyers.map(b => b.vertical)).size} verticals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/20 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
          <Link to="/buyers/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Add New Buyer
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "NEW THIS MONTH", value: `+${filteredBuyers.length}` },
          { label: "AVG. ONBOARDING", value: "4.2 Days" },
          { label: "TOTAL BUYERS", value: String(filteredBuyers.length) },
          { label: "RETENTION RATE", value: "98.4%", highlight: true },
        ].map((kpi) => (
          <div key={kpi.label} className="surface-card p-6">
            <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-2">{kpi.label}</p>
            <p className={`text-2xl font-headline font-bold ${kpi.highlight ? "text-primary" : "text-foreground"}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filter by:
          </div>
          {/* Vertical filter */}
          <div className="relative">
            <button
              onClick={() => { setShowVerticalDD(!showVerticalDD); setShowStageDD(false); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card text-sm text-foreground hover:bg-accent transition-colors"
            >
              {filterVertical === "All" ? "All Verticals" : filterVertical}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showVerticalDD && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-20 overflow-hidden min-w-[180px] max-h-72 overflow-y-auto">
                <button onClick={() => { setFilterVertical("All"); setShowVerticalDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterVertical === "All" ? "bg-accent" : ""}`}>All Verticals</button>
                {VERTICALS.map((v) => (
                  <button key={v} onClick={() => { setFilterVertical(v); setShowVerticalDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterVertical === v ? "bg-accent" : ""}`}>{v}</button>
                ))}
              </div>
            )}
          </div>
          {/* Stage filter */}
          <div className="relative">
            <button
              onClick={() => { setShowStageDD(!showStageDD); setShowVerticalDD(false); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card text-sm text-foreground hover:bg-accent transition-colors"
            >
              {filterStage === "All" ? "All Stages" : filterStage}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showStageDD && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-20 overflow-hidden min-w-[180px]">
                <button onClick={() => { setFilterStage("All"); setShowStageDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterStage === "All" ? "bg-accent" : ""}`}>All Stages</button>
                {FUNNEL_STEPS.map((s) => (
                  <button key={s} onClick={() => { setFilterStage(s); setShowStageDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterStage === s ? "bg-accent" : ""}`}>{s}</button>
                ))}
              </div>
            )}
          </div>
          {/* Date range */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card text-sm text-foreground hover:bg-accent transition-colors">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground text-xs">—</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card text-sm text-foreground hover:bg-accent transition-colors">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {dateTo ? format(dateTo, "MMM dd") : "To"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">Showing 1-{filteredBuyers.length} of {filteredBuyers.length}</span>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-label uppercase tracking-wider text-muted-foreground">
              <th className="text-left py-4 px-6 font-medium">Buyer & Company</th>
              <th className="text-left py-4 px-4 font-medium">Onboarded By</th>
              <th className="text-left py-4 px-4 font-medium">Vertical</th>
              <th className="text-left py-4 px-4 font-medium">Tier</th>
              <th className="text-left py-4 px-4 font-medium">Stage</th>
              <th className="text-left py-4 px-4 font-medium">Status</th>
              <th className="text-left py-4 px-4 font-medium">Key Dates</th>
              <th className="py-4 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((b) => (
              <tr
                key={b.id}
                className="group hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedBuyer(b)}
              >
                <td className="py-4 px-6">
                  <p className="text-sm font-semibold text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.company}</p>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">{b.owner}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${verticalColors[b.vertical] || "bg-muted text-muted-foreground"}`}>
                    {b.vertical}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-foreground">{b.tier}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${b.stage === "Live" ? "bg-primary-container" : b.stage === "Buyer Created" ? "bg-tertiary" : "bg-primary-container"}`} />
                    <span className="text-sm text-foreground">{b.stage}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${b.active ? "bg-primary-container" : "bg-surface-dim"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow-sm transition-all ${b.active ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-xs text-muted-foreground">In: {b.inDate}</p>
                  <p className="text-xs text-primary font-medium">{b.liveDate}</p>
                </td>
                <td className="py-4 px-4">
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm text-muted-foreground">Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><ChevronsLeft className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg text-sm font-medium gradient-primary text-primary-foreground">1</button>
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><ChevronsRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {selectedBuyer && (
        <BuyerDetailPanel buyer={selectedBuyer} onClose={() => setSelectedBuyer(null)} onUpdate={handleUpdateBuyer} />
      )}
    </div>
  );
}
