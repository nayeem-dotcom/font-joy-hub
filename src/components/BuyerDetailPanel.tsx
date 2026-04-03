import { X, CheckCircle2, FileText, UserPlus, Upload } from "lucide-react";

interface BuyerDetailPanelProps {
  buyer: {
    name: string;
    company: string;
    stage: string;
  };
  onClose: () => void;
}

const activities = [
  { icon: CheckCircle2, color: "text-primary-container", title: "Stage Changed: Negotiation", sub: "Moved from Consideration after successful demo session.", time: "Today, 2:45 PM" },
  { icon: FileText, color: "text-muted-foreground", title: "Document Uploaded", sub: "Sarah Chen uploaded Acme_Proposal_v2.pdf", time: "Oct 23, 11:20 AM" },
  { icon: UserPlus, color: "text-muted-foreground", title: "New Contact Added", sub: "Michael Scott (CTO) was added as a stakeholder.", time: "Oct 22, 4:15 PM" },
];

export default function BuyerDetailPanel({ buyer, onClose }: BuyerDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" />
      <div
        className="relative w-[580px] h-full bg-card overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">{buyer.company.charAt(0)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{buyer.company}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">Enterprise</span>
                </div>
                <p className="text-sm text-muted-foreground">Industrial Manufacturing • San Francisco, CA</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Funnel Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label uppercase tracking-wider text-primary">Funnel Completion</span>
              <span className="text-xl font-headline font-bold text-primary">72%</span>
            </div>
            <div className="flex gap-1 mb-2">
              {[100, 100, 100, 40].map((w, i) => (
                <div key={i} className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-label uppercase tracking-wider text-muted-foreground">
              <span>Awareness</span><span>Consideration</span><span className="text-primary font-bold">Negotiation</span><span>Closing</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 border-b border-outline-variant/15">
            {["Overview", "Contact", "Business Info", "Timeline", "Documents", "Notes"].map((tab, i) => (
              <button
                key={tab}
                className={`pb-3 text-sm font-medium transition-colors ${
                  i === 0
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Opportunity Status */}
          <div className="surface-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Opportunity Status</h3>
                <p className="text-xs text-muted-foreground">Last updated by Sarah Chen • Oct 24, 2023</p>
              </div>
              <div className="flex items-center bg-surface-container rounded-lg p-1">
                <button className="px-4 py-1.5 rounded-md text-xs font-semibold gradient-primary text-primary-foreground">Active</button>
                <button className="px-4 py-1.5 rounded-md text-xs font-medium text-muted-foreground">Inactive</button>
              </div>
            </div>
            <textarea
              placeholder="Add a reason for status change or update..."
              className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none h-20 focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-end mt-2">
              <button className="text-sm text-primary font-semibold hover:underline">Update</button>
            </div>
          </div>

          {/* Deal + Owner */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="surface-card p-5">
              <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-1">Projected Deal Value</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-foreground">$45,000</span>
                <span className="text-xs text-primary-container font-semibold">+12% vs last est.</span>
              </div>
            </div>
            <div className="surface-card p-5 flex items-center gap-3">
              <div>
                <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-1">Account Owner</p>
                <p className="text-sm font-semibold text-foreground">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">Senior Account Exec</p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
              <button className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                Full History →
              </button>
            </div>
            <div className="space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <a.icon className={`w-5 h-5 mt-0.5 shrink-0 ${a.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button className="flex-1 py-3 rounded-xl border border-outline-variant/20 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
              Save as PDF
            </button>
            <button className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Generate New Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
