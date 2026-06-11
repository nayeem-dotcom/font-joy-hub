import { useState } from "react";
import { HardDrive, Star, Clock, Trash2, Plus, Search, LayoutGrid, List, FolderOpen, Info } from "lucide-react";

type View = "drive" | "starred" | "recent" | "trash";
type Filter = "all" | "documents" | "images" | "other";
type Layout = "grid" | "list";

export default function CreativeHub() {
  const [view, setView] = useState<View>("drive");
  const [filter, setFilter] = useState<Filter>("all");
  const [layout, setLayout] = useState<Layout>("grid");
  const [query, setQuery] = useState("");

  const sides: { key: View; label: string; icon: React.ElementType }[] = [
    { key: "drive", label: "My Drive", icon: HardDrive },
    { key: "starred", label: "Starred", icon: Star },
    { key: "recent", label: "Recent", icon: Clock },
    { key: "trash", label: "Trash", icon: Trash2 },
  ];

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Files" },
    { key: "documents", label: "Documents" },
    { key: "images", label: "Images" },
    { key: "other", label: "Other" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Creative Hub</h1>
        <p className="text-muted-foreground mt-1">Centralized creative assets, campaign sheets and brand collateral.</p>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="flex min-h-[640px]">
          {/* Side filters */}
          <aside className="w-56 border-r border-border/30 p-4 space-y-1">
            {sides.map((s) => (
              <button
                key={s.key}
                onClick={() => setView(s.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  view === s.key ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </aside>

          {/* Main */}
          <section className="flex-1 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-foreground capitalize">{sides.find(s => s.key === view)?.label}</h2>
              <div className="flex items-center gap-2 bg-input rounded-xl px-3 py-2 w-72">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search folders and files..." className="bg-transparent outline-none text-sm w-full" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-semibold">
                  <Plus className="w-4 h-4" /> New
                </button>
                <div className="flex items-center gap-1 ml-2">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        filter === f.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-input rounded-lg p-1">
                <button onClick={() => setLayout("grid")} className={`p-1.5 rounded ${layout === "grid" ? "bg-card text-foreground" : "text-muted-foreground"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setLayout("list")} className={`p-1.5 rounded ${layout === "list" ? "bg-card text-foreground" : "text-muted-foreground"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed border-border/40 rounded-2xl">
              <FolderOpen className="w-12 h-12 text-muted-foreground/60 mb-3" />
              <p className="text-foreground font-semibold">This directory folder is empty</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Drag & drop files onto this dashboard target or select '+ New' to create folders or batch upload folders with structure.
              </p>
            </div>
          </section>

          {/* Spectator Panel */}
          <aside className="w-64 border-l border-border/30 p-6 hidden xl:flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border-2 border-border/40 flex items-center justify-center mb-3">
              <Info className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">Workspace Spectator Panel</p>
            <p className="text-xs text-muted-foreground mt-2">Hover or select any matched buyer asset card once to review campaign sheets.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}