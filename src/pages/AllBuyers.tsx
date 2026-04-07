import { useState } from "react";
import { Download, Plus, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Filter, User } from "lucide-react";
import { Link } from "react-router-dom";
import BuyerDetailPanel from "@/components/BuyerDetailPanel";
import { useBuyers, type BuyerData } from "@/contexts/BuyerContext";

export type { BuyerData } from "@/contexts/BuyerContext";

const verticalColors: Record<string, string> = {
  FINTECH: "bg-primary/10 text-primary",
  SAAS: "bg-tertiary/10 text-tertiary",
  "ECO-TECH": "bg-primary-container/10 text-primary-container-foreground",
  "E-COMMERCE": "bg-inverse-surface/10 text-foreground",
  AUTOMOTIVE: "bg-primary/10 text-primary",
  "AI/ML": "bg-tertiary/10 text-tertiary",
  "REAL ESTATE": "bg-primary-container/10 text-primary-container-foreground",
  MEDICAL: "bg-tertiary/10 text-tertiary",
  CREATIVE: "bg-primary/10 text-primary",
  RETAIL: "bg-primary-container/10 text-primary-container-foreground",
  ADTECH: "bg-tertiary/10 text-tertiary",
};

export default function AllBuyers() {
  const { buyers, updateBuyer } = useBuyers();
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerData | null>(null);

  const handleUpdateBuyer = (updated: BuyerData) => {
    updateBuyer(updated);
    setSelectedBuyer(updated);
  };

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
          { label: "NEW THIS MONTH", value: "+42" },
          { label: "AVG. ONBOARDING", value: "4.2 Days" },
          { label: "TOTAL BUYERS", value: String(buyers.length) },
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
          {["All Verticals", "All Stages"].map((f) => (
            <button key={f} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card text-sm text-foreground hover:bg-accent transition-colors">
              {f}
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card text-sm text-foreground hover:bg-accent transition-colors">
            📅 Date Range
            <ChevronRight className="w-3 h-3 rotate-90" />
          </button>
        </div>
        <span className="text-sm text-muted-foreground">Showing 1-{buyers.length} of {buyers.length}</span>
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
            {buyers.map((b) => (
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
