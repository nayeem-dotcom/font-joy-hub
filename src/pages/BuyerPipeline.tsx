import { useState, DragEvent } from "react";
import { Plus, User, GripVertical } from "lucide-react";

interface Card {
  id: string;
  name: string;
  vertical: string;
  days: number;
  progress: number;
  owner: string;
}

interface Column {
  id: string;
  title: string;
  dotColor: string;
  cards: Card[];
}

const initialColumns: Column[] = [
  {
    id: "meeting_closed",
    title: "MEETING CLOSED",
    dotColor: "bg-tertiary",
    cards: [
      { id: "c1", name: "Lumina Flow", vertical: "Fintech", days: 4, progress: 15, owner: "Sarah J." },
      { id: "c2", name: "Vortex Digital", vertical: "Creative", days: 2, progress: 8, owner: "Marc K." },
      { id: "c3", name: "Apex Solutions", vertical: "SaaS", days: 7, progress: 22, owner: "David L." },
    ],
  },
  {
    id: "paperwork",
    title: "PAPERWORK STATUS",
    dotColor: "bg-primary-container",
    cards: [
      { id: "c4", name: "Helix Logistics", vertical: "Retail", days: 11, progress: 32, owner: "Sarah J." },
      { id: "c5", name: "Quantum Media", vertical: "AdTech", days: 5, progress: 28, owner: "Marc K." },
    ],
  },
  {
    id: "creative",
    title: "CREATIVE SUBMISSION",
    dotColor: "",
    cards: [
      { id: "c6", name: "Nova Brands", vertical: "E-commerce", days: 6, progress: 48, owner: "David L." },
    ],
  },
  {
    id: "technical",
    title: "TECHNICAL SETUP",
    dotColor: "",
    cards: [
      { id: "c7", name: "Skyline Tech", vertical: "AI/ML", days: 3, progress: 60, owner: "Sarah J." },
    ],
  },
  {
    id: "live",
    title: "LIVE",
    dotColor: "bg-primary-container",
    cards: [
      { id: "c8", name: "BlueWave Corp", vertical: "Fintech", days: 0, progress: 100, owner: "Marc K." },
      { id: "c9", name: "GreenLeaf Inc", vertical: "Eco-Tech", days: 0, progress: 100, owner: "David L." },
    ],
  },
];

export default function BuyerPipeline() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedCard, setDraggedCard] = useState<{ card: Card; fromColumnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, card: Card, columnId: string) => {
    setDraggedCard({ card, fromColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedCard(null);
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

    if (!draggedCard || draggedCard.fromColumnId === toColumnId) {
      setDraggedCard(null);
      return;
    }

    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === draggedCard.fromColumnId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== draggedCard.card.id) };
        }
        if (col.id === toColumnId) {
          return { ...col, cards: [...col.cards, { ...draggedCard.card, days: 0 }] };
        }
        return col;
      });
    });

    setDraggedCard(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buyer Pipeline</h1>
          <p className="text-muted-foreground mt-1">Drag and drop leads between stages to update their status.</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: "TEAM MEMBER", value: "All Members" },
            { label: "VERTICAL", value: "All Verticals" },
            { label: "DATE RANGE", value: "Last 30 Days" },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">{f.label}</p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card text-sm text-foreground shadow-ambient">
                {f.value}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-5 overflow-x-auto pb-4">
        {columns.map((col) => (
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
                {col.cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 min-h-[120px]">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, col.id)}
                  onDragEnd={handleDragEnd}
                  className="surface-card p-5 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-l-[3px] border-primary-container/30 group select-none"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">{card.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider bg-surface-container-high text-muted-foreground px-2 py-0.5 rounded-md">
                        {card.vertical}
                      </span>
                      <GripVertical className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {card.owner} • {card.days} days in stage
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">Onboarding Progress</span>
                      <span className="text-xs font-bold text-foreground">{card.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-700"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state / drop zone indicator */}
              {col.cards.length === 0 && (
                <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-6 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Drop leads here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
