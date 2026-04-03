import { useState } from "react";
import {
  X,
  CheckCircle2,
  FileText,
  UserPlus,
  Upload,
  Phone,
  Mail,
  MapPin,
  Globe,
  Building2,
  Calendar,
  Download,
  MessageSquare,
  Clock,
  AlertTriangle,
  Briefcase,
  Users,
  StickyNote,
  Save,
} from "lucide-react";
import type { BuyerData } from "@/pages/AllBuyers";

interface BuyerDetailPanelProps {
  buyer: BuyerData;
  onClose: () => void;
  onUpdate: (updated: BuyerData) => void;
}

const tabs = ["Overview", "Contact", "Business Info", "Timeline", "Documents", "Notes"];

const timelineEvents = [
  { icon: CheckCircle2, color: "text-primary-container", title: "Stage Changed: Negotiation", sub: "Moved from Consideration after successful demo session.", time: "Today, 2:45 PM" },
  { icon: FileText, color: "text-tertiary", title: "Document Uploaded", sub: "Sarah Chen uploaded Acme_Proposal_v2.pdf", time: "Oct 23, 11:20 AM" },
  { icon: UserPlus, color: "text-muted-foreground", title: "New Contact Added", sub: "Michael Scott (CTO) was added as a stakeholder.", time: "Oct 22, 4:15 PM" },
  { icon: MessageSquare, color: "text-primary", title: "Note Added", sub: "Follow-up call scheduled for next week regarding contract terms.", time: "Oct 21, 3:00 PM" },
  { icon: AlertTriangle, color: "text-amber-500", title: "Risk Flag Raised", sub: "Legal review pending for more than 3 business days.", time: "Oct 19, 9:30 AM" },
  { icon: Mail, color: "text-tertiary", title: "Email Sent", sub: "Proposal document sent to buyer's procurement team.", time: "Oct 18, 2:15 PM" },
  { icon: Calendar, color: "text-primary-container", title: "Meeting Scheduled", sub: "Demo call booked with CTO and VP of Engineering.", time: "Oct 15, 10:00 AM" },
  { icon: UserPlus, color: "text-primary-container", title: "Buyer Created", sub: "Account initialized and assigned to Sarah Chen.", time: "Oct 12, 9:00 AM" },
];

const documents = [
  { name: "Acme_Proposal_v2.pdf", type: "Proposal", size: "2.4 MB", date: "Oct 23, 2023", status: "Final" },
  { name: "NDA_Signed.pdf", type: "Legal", size: "540 KB", date: "Oct 20, 2023", status: "Signed" },
  { name: "Technical_Requirements.docx", type: "Technical", size: "1.1 MB", date: "Oct 18, 2023", status: "Draft" },
  { name: "Onboarding_Checklist.pdf", type: "Process", size: "320 KB", date: "Oct 15, 2023", status: "Active" },
  { name: "Meeting_Notes_Oct15.pdf", type: "Notes", size: "180 KB", date: "Oct 15, 2023", status: "Final" },
];

const notes = [
  { author: "Sarah Chen", date: "Oct 24, 2023 at 3:15 PM", content: "Client expressed strong interest in the premium tier. They want to start with a 6-month pilot program before committing to annual. Need to prepare a custom pricing proposal by EOW." },
  { author: "Marc Kellner", date: "Oct 22, 2023 at 11:00 AM", content: "Had a productive call with their CTO. Technical requirements are straightforward — standard API integration with their existing CRM. No major blockers identified." },
  { author: "Sarah Chen", date: "Oct 19, 2023 at 4:30 PM", content: "Legal team flagged a clause in section 4.2 of the NDA regarding data residency. Need to coordinate with our legal to provide alternative language." },
  { author: "David Liu", date: "Oct 15, 2023 at 10:45 AM", content: "Initial discovery call went well. Key decision makers: CTO (Michael Scott) and VP Engineering (Jim Palmer). Budget approved internally, timeline is Q1 next year." },
];

export default function BuyerDetailPanel({ buyer, onClose, onUpdate }: BuyerDetailPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [editData, setEditData] = useState<BuyerData>({ ...buyer });
  const [isActive, setIsActive] = useState(buyer.active);
  const [statusNote, setStatusNote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [allNotes, setAllNotes] = useState(notes);
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = (field: keyof BuyerData, value: string | boolean) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const updated = { ...editData, active: isActive };
    onUpdate(updated);
    setHasChanges(false);
  };

  const handleToggleActive = (val: boolean) => {
    setIsActive(val);
    setHasChanges(true);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setAllNotes([
      { author: "You", date: new Date().toLocaleString(), content: newNote },
      ...allNotes,
    ]);
    setNewNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" />
      <div
        className="relative w-[600px] h-full bg-card overflow-y-auto animate-fade-in"
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
                <p className="text-sm text-muted-foreground">
                  {buyer.vertical || "Technology"} • San Francisco, CA
                </p>
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
          <div className="flex gap-5 mb-6 border-b border-outline-variant/15 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  i === activeTab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 0 && (
            <div>
              {/* Opportunity Status */}
              <div className="surface-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Opportunity Status</h3>
                    <p className="text-xs text-muted-foreground">Last updated by Sarah Chen • Oct 24, 2023</p>
                  </div>
                  <div className="flex items-center bg-surface-container rounded-lg p-1">
                    <button
                      onClick={() => handleToggleActive(true)}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        isActive ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => handleToggleActive(false)}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        !isActive ? "bg-destructive text-destructive-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
                {!isActive && (
                  <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-3 mb-3">
                    <p className="text-xs text-destructive font-medium">⚠ This buyer is marked as inactive. Funnel tracking is paused.</p>
                  </div>
                )}
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a reason for status change or update..."
                  className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none h-20 focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex justify-end mt-2">
                  <button className="text-sm text-primary font-semibold hover:underline">Update</button>
                </div>
              </div>

              {/* Account Owner */}
              <div className="surface-card p-5 mb-6">
                <p className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-1">Account Owner</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{buyer.owner || "Sarah Chen"}</p>
                    <p className="text-xs text-muted-foreground">Senior Account Exec</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
                  <button
                    onClick={() => setActiveTab(3)}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Full History →
                  </button>
                </div>
                <div className="space-y-4">
                  {timelineEvents.slice(0, 3).map((a, i) => (
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
            </div>
          )}

          {/* ===== CONTACT TAB ===== */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {/* Primary Contact */}
              <div className="surface-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Primary Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                      <span className="text-lg font-semibold text-foreground">{buyer.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{buyer.name}</p>
                      <p className="text-xs text-muted-foreground">Chief Technology Officer</p>
                    </div>
                  </div>
                  <div className="grid gap-3 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Email</p>
                        <p className="text-sm text-foreground">{buyer.name.toLowerCase().replace(" ", ".")}@{buyer.company.toLowerCase().replace(/\s+/g, "")}.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Phone</p>
                        <p className="text-sm text-foreground">+1 (415) 555-0142</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-input rounded-xl">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Location</p>
                        <p className="text-sm text-foreground">San Francisco, CA 94105</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stakeholders */}
              <div className="surface-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Additional Stakeholders</h3>
                <div className="space-y-3">
                  {[
                    { name: "Michael Scott", role: "VP of Engineering", email: "m.scott@company.com" },
                    { name: "Jim Palmer", role: "Procurement Lead", email: "j.palmer@company.com" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-input rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                          <span className="text-xs font-semibold text-foreground">{s.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.role}</p>
                        </div>
                      </div>
                      <button className="p-1.5 rounded-lg hover:bg-accent">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-4 flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                  <UserPlus className="w-4 h-4" />
                  Add Stakeholder
                </button>
              </div>
            </div>
          )}

          {/* ===== BUSINESS INFO TAB ===== */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="surface-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Company Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-input rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Company</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{buyer.company}</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Industry</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{buyer.vertical || "Technology"}</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Website</p>
                    </div>
                    <p className="text-sm text-primary font-medium">www.{buyer.company.toLowerCase().replace(/\s+/g, "")}.com</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">Company Size</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">250-500 employees</p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Buyer Tier</p>
                    <p className="text-sm font-semibold text-foreground">{buyer.tier || "Direct Buyer"}</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Current Stage</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary-container" />
                      <p className="text-sm font-semibold text-foreground">{buyer.stage}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Onboard Date</p>
                    <p className="text-sm font-semibold text-foreground">{buyer.inDate || "Oct 12, 2023"}</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Live Date</p>
                    <p className="text-sm font-semibold text-foreground">{buyer.liveDate || "Pending"}</p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Revenue & Billing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Annual Revenue</p>
                    <p className="text-sm font-semibold text-foreground">$12.5M</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Payment Terms</p>
                    <p className="text-sm font-semibold text-foreground">Net 30</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Contract Length</p>
                    <p className="text-sm font-semibold text-foreground">12 Months</p>
                  </div>
                  <div className="p-3 bg-input rounded-xl">
                    <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Billing Cycle</p>
                    <p className="text-sm font-semibold text-foreground">Monthly</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TIMELINE TAB ===== */}
          {activeTab === 3 && (
            <div>
              <h3 className="text-base font-bold text-foreground mb-6">Full Activity Timeline</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant/20" />
                <div className="space-y-6">
                  {timelineEvents.map((event, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="relative z-10 w-6 h-6 rounded-full bg-card flex items-center justify-center ring-2 ring-surface-container">
                        <event.icon className={`w-3.5 h-3.5 ${event.color}`} />
                      </div>
                      <div className="flex-1 surface-card p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-foreground">{event.title}</p>
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== DOCUMENTS TAB ===== */}
          {activeTab === 4 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-foreground">Shared Documents</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </button>
              </div>
              <div className="space-y-3">
                {documents.map((doc, i) => {
                  const statusColor =
                    doc.status === "Final" || doc.status === "Signed"
                      ? "bg-primary-container/10 text-primary-container"
                      : doc.status === "Active"
                      ? "bg-tertiary/10 text-tertiary"
                      : "bg-surface-container text-muted-foreground";
                  return (
                    <div key={i} className="surface-card p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} • {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${statusColor}`}>
                          {doc.status}
                        </span>
                        <button className="p-2 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== NOTES TAB ===== */}
          {activeTab === 5 && (
            <div>
              <h3 className="text-base font-bold text-foreground mb-4">Notes & Comments</h3>

              {/* Add note */}
              <div className="surface-card p-4 mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this buyer..."
                  className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none h-24 focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <StickyNote className="w-3.5 h-3.5" />
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes list */}
              <div className="space-y-4">
                {allNotes.map((note, i) => (
                  <div key={i} className="surface-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center">
                          <span className="text-xs font-semibold text-foreground">{note.author.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{note.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.date}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-outline-variant/15">
            <button className="flex-1 py-3 rounded-xl border border-outline-variant/20 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
              Save as PDF
            </button>
            {hasChanges ? (
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            ) : (
              <button className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Generate New Proposal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
