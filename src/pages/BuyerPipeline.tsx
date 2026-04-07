import { useState, DragEvent } from "react";
import { Plus, User, GripVertical, ExternalLink, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuyers, FUNNEL_STEPS, COLUMN_STAGE_MAP, STAGE_COLUMN_MAP, VERTICALS, TEAM_MEMBERS, type BuyerData } from "@/contexts/BuyerContext";
import BuyerDetailPanel from "@/components/BuyerDetailPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface Column {
  id: string;
  title: string;
  dotColor: string;
}

const pipelineColumns: Column[] = [
  { id: "buyer_created", title: "BUYER CREATED", dotColor: "bg-tertiary" },
  { id: "paperwork", title: "PAPERWORK", dotColor: "bg-primary-container" },
  { id: "creative", title: "CREATIVE SUBMISSION", dotColor: "" },
  { id: "technical", title: "TECHNICAL SETUP", dotColor: "" },
  { id: "live", title: "LIVE", dotColor: "bg-primary-container" },
];

export default function BuyerPipeline() {
  const { buyers, updateBuyerStage, updateBuyer } = useBuyers();
  const navigate = useNavigate();
  const [draggedBuyer, setDraggedBuyer] = useState<{ buyer: BuyerData; fromColumnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerData | null>(null);
  const [filterMember, setFilterMember] = useState("All");
  const [filterVertical, setFilterVertical] = useState("All");
  const [showMemberDD, setShowMemberDD] = useState(false);
  const [showVerticalDD, setShowVerticalDD] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const filteredBuyers = buyers.filter((b) => {
    if (filterMember !== "All" && b.owner !== filterMember) return false;
    if (filterVertical !== "All" && b.vertical !== filterVertical) return false;
    return true;
  });

  const getBuyersForColumn = (columnId: string) => {
    const stage = COLUMN_STAGE_MAP[columnId];
    return filteredBuyers.filter((b) => b.stage === stage);
  };

  const getFunnelProgress = (stage: string) => {
    const idx = FUNNEL_STEPS.indexOf(stage as any);
    return idx >= 0 ? Math.round(((idx + 1) / FUNNEL_STEPS.length) * 100) : 20;
  };

  const handleDragStart = (e: DragEvent, buyer: BuyerData, columnId: string) => {
    setDraggedBuyer({ buyer, fromColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedBuyer(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent, toColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedBuyer || draggedBuyer.fromColumnId === toColumnId) {
      setDraggedBuyer(null);
      return;
    }

    const newStage = COLUMN_STAGE_MAP[toColumnId];
    updateBuyerStage(draggedBuyer.buyer.id, newStage);
    setDraggedBuyer(null);
  };

  const handleCardClick = (buyer: BuyerData) => {
    setSelectedBuyer(buyer);
  };

  const handleUpdateBuyer = (updated: BuyerData) => {
    updateBuyer(updated);
    setSelectedBuyer(updated);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buyer Pipeline</h1>
          <p className="text-muted-foreground mt-1">Drag and drop buyers between stages. Click a card to open the buyer profile.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Team Member filter */}
          <div className="relative">
            <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">TEAM MEMBER</p>
            <button
              onClick={() => { setShowMemberDD(!showMemberDD); setShowVerticalDD(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card text-sm text-foreground shadow-ambient"
            >
              {filterMember === "All" ? "All Members" : filterMember}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showMemberDD && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px] max-h-64 overflow-y-auto">
                <button onClick={() => { setFilterMember("All"); setShowMemberDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterMember === "All" ? "bg-accent" : ""}`}>All Members</button>
                {TEAM_MEMBERS.map((m) => (
                  <button key={m} onClick={() => { setFilterMember(m); setShowMemberDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterMember === m ? "bg-accent" : ""}`}>{m}</button>
                ))}
              </div>
            )}
          </div>
          {/* Vertical filter */}
          <div className="relative">
            <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">VERTICAL</p>
            <button
              onClick={() => { setShowVerticalDD(!showVerticalDD); setShowMemberDD(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card text-sm text-foreground shadow-ambient"
            >
              {filterVertical === "All" ? "All Verticals" : filterVertical}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showVerticalDD && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-20 overflow-hidden min-w-[200px] max-h-64 overflow-y-auto">
                <button onClick={() => { setFilterVertical("All"); setShowVerticalDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterVertical === "All" ? "bg-accent" : ""}`}>All Verticals</button>
                {VERTICALS.map((v) => (
                  <button key={v} onClick={() => { setFilterVertical(v); setShowVerticalDD(false); }} className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${filterVertical === v ? "bg-accent" : ""}`}>{v}</button>
                ))}
              </div>
            )}
          </div>
          {/* Date Range */}
          <div>
            <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">DATE RANGE</p>
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card text-sm text-foreground shadow-ambient">
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
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-card text-sm text-foreground shadow-ambient">
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
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-5 overflow-x-auto pb-4">
        {pipelineColumns.map((col) => {
          const columnBuyers = getBuyersForColumn(col.id);
          return (
            <div
              key={col.id}
              className={`min-w-[280px] flex-1 rounded-2xl p-3 transition-colors duration-200 ${
                dragOverColumn === col.id
                  ? "bg-primary/5 ring-2 ring-primary/20"
                  : "bg-transparent"
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  {col.dotColor && <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />}
                  <span className="text-xs font-label uppercase tracking-wider text-muted-foreground font-medium">
                    {col.title}
                  </span>
                </div>
                <span className="text-xs font-semibold bg-surface-container-high text-foreground w-6 h-6 rounded-full flex items-center justify-center">
                  {columnBuyers.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[120px]">
                {columnBuyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, buyer, col.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleCardClick(buyer)}
                    className="surface-card p-5 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-l-[3px] border-primary-container/30 group select-none"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-bold text-foreground">{buyer.company}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium uppercase tracking-wider bg-surface-container-high text-muted-foreground px-2 py-0.5 rounded-md">
                          {buyer.vertical}
                        </span>
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {buyer.owner} • {buyer.daysInStage} days in stage
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">Funnel Progress</span>
                        <span className="text-xs font-bold text-foreground">{getFunnelProgress(buyer.stage)}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-700"
                          style={{ width: `${getFunnelProgress(buyer.stage)}%` }}
                        />
                      </div>
                    </div>
                    {col.id === "paperwork" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/legal");
                        }}
                        className="flex items-center gap-1.5 mt-3 text-[10px] font-semibold text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View in Legal & Compliance
                      </button>
                    )}
                  </div>
                ))}

                {columnBuyers.length === 0 && (
                  <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-6 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Drop buyers here</p>
                  </div>
                )}
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

      {/* Buyer Detail Panel */}
      {selectedBuyer && (
        <BuyerDetailPanel
          buyer={selectedBuyer}
          onClose={() => setSelectedBuyer(null)}
          onUpdate={handleUpdateBuyer}
        />
      )}
    </div>
  );
}
