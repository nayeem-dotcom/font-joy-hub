import { Plus, User } from "lucide-react";

const columns = [
  {
    title: "MEETING CLOSED",
    count: 12,
    dotColor: "bg-tertiary",
    cards: [
      { name: "Lumina Flow", vertical: "Fintech", days: 4, progress: 15, owner: "A" },
      { name: "Vortex Digital", vertical: "Creative", days: 2, progress: 8, owner: "B" },
    ],
  },
  {
    title: "PAPERWORK STATUS",
    count: 8,
    dotColor: "bg-primary-container",
    cards: [
      { name: "Helix Logistics", vertical: "Retail", days: 11, progress: 32, owner: "C" },
    ],
  },
  {
    title: "CREATIVE SUBMISSION",
    count: 5,
    dotColor: "",
    cards: [
      { name: "Nova Brands", vertical: "E-commerce", days: 6, progress: 48, owner: "D" },
    ],
  },
  {
    title: "TECHNICAL SETUP",
    count: 3,
    dotColor: "",
    cards: [],
  },
  {
    title: "LIVE",
    count: 15,
    dotColor: "bg-primary-container",
    cards: [],
  },
];

export default function BuyerPipeline() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buyer Pipeline</h1>
          <p className="text-muted-foreground mt-1">Real-time visualization of your active sales funnel.</p>
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
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.title} className="min-w-[300px] flex-1">
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {col.dotColor && <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />}
                <span className="text-xs font-label uppercase tracking-wider text-muted-foreground font-medium">{col.title}</span>
              </div>
              <span className="text-xs font-semibold bg-surface-container-high text-foreground w-6 h-6 rounded-full flex items-center justify-center">
                {col.count}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {col.cards.map((card) => (
                <div
                  key={card.name}
                  className="surface-card p-5 hover:shadow-lg transition-shadow cursor-pointer border-l-[3px] border-primary-container/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">{card.name}</h3>
                    <span className="text-[10px] font-medium uppercase tracking-wider bg-surface-container-high text-muted-foreground px-2 py-0.5 rounded-md">
                      {card.vertical}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center">
                      <User className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">{card.days} days in stage</span>
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
