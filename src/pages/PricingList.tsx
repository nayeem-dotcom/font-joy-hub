import { useState } from "react";
import { TrendingUp, DollarSign, Zap, RotateCcw, Plus, Search, Pencil } from "lucide-react";

type TabKey = "ppc" | "leadgen" | "specific";

interface Row {
  priority: number;
  campaign: string;
  staticRange: string;
  rtbRange: string;
  duration: string;
  expectedRPC: string;
  expectedCC: string;
  volume: string;
  source: string;
}

const seed: Row[] = Array.from({ length: 12 }).map((_, i) => ({
  priority: i + 1,
  campaign: i === 0 ? "ACA Transfer English" : "Medicare Transfer",
  staticRange: "$55 - $60",
  rtbRange: "$50 - $55",
  duration: "90 - 120",
  expectedRPC: "$18+",
  expectedCC: "10 - 15",
  volume: "500 / 1k / 2k - up to 5k",
  source: "Offshore call",
}));

export default function PricingList() {
  const [tab, setTab] = useState<TabKey>("ppc");
  const [rows, setRows] = useState<Row[]>(seed);
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) =>
    r.campaign.toLowerCase().includes(query.toLowerCase())
  );

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        priority: prev.length + 1,
        campaign: "New Campaign",
        staticRange: "$0 - $0",
        rtbRange: "$0 - $0",
        duration: "—",
        expectedRPC: "—",
        expectedCC: "—",
        volume: "—",
        source: "—",
      },
    ]);

  const kpis = [
    { icon: TrendingUp, label: "Campaigns", value: String(rows.length), tint: "bg-primary/10 text-primary" },
    { icon: DollarSign, label: "Avg Price", value: "$96.6", tint: "bg-tertiary/10 text-tertiary" },
    { icon: Zap, label: "High Volume", value: "0", tint: "bg-primary-container/10 text-primary-container" },
  ];

  const tabs: { key: TabKey; label: string }[] = [
    { key: "ppc", label: "PPC Wishlist" },
    { key: "leadgen", label: "LeadGen Wishlist" },
    { key: "specific", label: "Specific LeadGen" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Wishlist</h1>
          <p className="text-muted-foreground mt-1">Plan PPC, LeadGen and specific verticals. Edit inline, add rows or whole tables.</p>
        </div>
        <button
          onClick={() => setRows(seed)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 text-sm text-foreground hover:bg-accent transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-border/40">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
              tab === t.key ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="surface-card p-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${k.tint}`}>
              <k.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-headline font-bold text-foreground">{k.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">LeadGen Wishlist</h2>
            <p className="text-xs text-muted-foreground">Pay-per-call campaigns with static & RTB pricing</p>
          </div>
          <div className="flex items-center gap-2 bg-input rounded-xl px-3 py-2 w-72">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container text-xs uppercase tracking-wider text-muted-foreground">
                {["Priority", "Campaign", "Static Range", "RTB Range (Avg)", "Duration / Buffer (sec)", "Expected RPC", "Expected CC", "Volume / Day", "Traffic Source"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.priority} className="border-t border-border/30 hover:bg-accent/40 transition">
                  <td className="px-4 py-3 font-semibold text-foreground">{r.priority}</td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-2.5 py-1 text-foreground">
                      {r.campaign}
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{r.staticRange}</td>
                  <td className="px-4 py-3 text-foreground">{r.rtbRange}</td>
                  <td className="px-4 py-3 text-foreground">{r.duration}</td>
                  <td className="px-4 py-3 text-primary font-semibold">{r.expectedRPC}</td>
                  <td className="px-4 py-3 text-foreground">{r.expectedCC}</td>
                  <td className="px-4 py-3 text-foreground">{r.volume}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/30">
          <button onClick={addRow} className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>
      </div>
    </div>
  );
}