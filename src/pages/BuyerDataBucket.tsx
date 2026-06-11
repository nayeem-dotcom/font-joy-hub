import { useMemo, useState } from "react";
import { Building2, Users, BadgeCheck, Search, Plus, Pencil } from "lucide-react";

interface Partner {
  type: string;
  category: string;
  legalName: string;
  contacts: string[];
  positions: string[];
  emails: string[];
}

const seed: Partner[] = [
  { type: "PPC & Leadgen", category: "Insurance", legalName: "Leads Icon LLC", contacts: ["Joy Miskovich", "Dudas", "Candace Paez"], positions: ["CEO/Founder", "Partner Success & Operations Manager"], emails: ["joy@offerwebmail.com", "candace@offerwebmail.com"] },
  ...Array.from({ length: 7 }).map(() => ({
    type: "PPC & Leadgen",
    category: "Home Services",
    legalName: "Leads Icon LLC",
    contacts: ["Manuel Perez-Trujillo", "Marian Urrutia"],
    positions: ["CEO"],
    emails: ["joy@offerwebmail.com", "candace@offerwebmail.com"],
  })),
];

export default function BuyerDataBucket() {
  const [rows, setRows] = useState<Partner[]>(seed);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [cat, setCat] = useState("All Categories");

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (type === "All types" || r.type === type) &&
          (cat === "All Categories" || r.category === cat) &&
          (r.legalName.toLowerCase().includes(query.toLowerCase()) ||
            r.contacts.join(" ").toLowerCase().includes(query.toLowerCase()) ||
            r.emails.join(" ").toLowerCase().includes(query.toLowerCase()))
      ),
    [rows, type, cat, query]
  );

  const totalContacts = rows.reduce((s, r) => s + r.contacts.length, 0);
  const complete = rows.filter((r) => r.contacts.length && r.emails.length && r.positions.length).length;
  const completeness = `${Math.round((complete / rows.length) * 100)}%`;

  const kpis = [
    { icon: Building2, label: "Total Partners", value: String(rows.length), tint: "bg-primary/10 text-primary" },
    { icon: Users, label: "Total Contacts", value: String(totalContacts), tint: "bg-tertiary/10 text-tertiary" },
    { icon: BadgeCheck, label: "Comprehensive Contacts", value: completeness, tint: "bg-primary-container/10 text-primary-container" },
  ];

  const addRow = () =>
    setRows((p) => [
      ...p,
      { type: "PPC & Leadgen", category: "Other", legalName: "New Partner", contacts: [], positions: [], emails: [] },
    ]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Buyer Data Bucket</h1>
        <p className="text-muted-foreground mt-1">Premium Search, Filtering, and Buyer Lead CRM System</p>
      </div>

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

      <div className="surface-card overflow-hidden">
        <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-foreground">LeadGen Wishlist</h2>
            <p className="text-xs text-muted-foreground">Pay-per-call campaigns with static & RTB pricing</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-input rounded-xl px-3 py-2 w-72">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search advertiser, contact, email..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            <select value={type} onChange={(e) => setType(e.target.value)} className="bg-input rounded-xl px-3 py-2 text-sm outline-none">
              <option>All types</option>
              <option>PPC & Leadgen</option>
            </select>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="bg-input rounded-xl px-3 py-2 text-sm outline-none">
              <option>All Categories</option>
              <option>Insurance</option>
              <option>Home Services</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container text-xs uppercase tracking-wider text-muted-foreground">
                {["Type", "Category", "Advertiser Legal Name", "Contact Name", "Position", "Email"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-t border-border/30 hover:bg-accent/40 transition align-top">
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-2.5 py-1 text-foreground">
                      {r.type}<Pencil className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{r.category}</td>
                  <td className="px-4 py-3 text-foreground">{r.legalName}</td>
                  <td className="px-4 py-3 text-foreground">
                    {r.contacts.map((c) => <div key={c}>{c}</div>)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {r.positions.map((p) => <div key={p}>{p}</div>)}
                  </td>
                  <td className="px-4 py-3 text-primary">
                    {r.emails.map((e) => <div key={e}>{e}</div>)}
                  </td>
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