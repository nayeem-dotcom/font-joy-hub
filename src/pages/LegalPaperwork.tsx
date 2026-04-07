import { useState } from "react";
import {
  FileText,
  TrendingUp,
  RefreshCw,
  Download,
  Send,
  X,
  Upload,
  ChevronDown,
  MessageSquare,
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useBuyers } from "@/contexts/BuyerContext";

type DocStatus = "Needs Audit" | "In Progress" | "Approved";

interface LegalDoc {
  id: string;
  name: string;
  buyerCompany: string;
  buyerOwner: string;
  uploadedBy: string;
  uploadDate: string;
  status: DocStatus;
  type: string;
  size: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: "owner" | "compliance";
  time: string;
  content: string;
  attachment?: { name: string };
}

const statusColors: Record<DocStatus, string> = {
  "Needs Audit": "bg-amber-500/10 text-amber-600",
  "In Progress": "bg-tertiary/10 text-tertiary",
  "Approved": "bg-primary-container/10 text-primary-container",
};

const statusOptions: DocStatus[] = ["Needs Audit", "In Progress", "Approved"];

export default function LegalPaperwork() {
  const { buyers } = useBuyers();

  // Build docs from buyers in Paperwork stage or with paperwork docs
  const buyersWithPaperwork = buyers.filter(
    (b) => b.stage === "Paperwork" || b.stage === "Creative Submission" || b.stage === "Technical Setup" || b.stage === "Live"
  );

  const [docs, setDocs] = useState<LegalDoc[]>([
    ...buyersWithPaperwork.flatMap((b) => [
      {
        id: `${b.id}-nda`,
        name: `NDA_${b.company.replace(/\s+/g, "_")}.pdf`,
        buyerCompany: b.company,
        buyerOwner: b.owner,
        uploadedBy: b.owner,
        uploadDate: b.inDate,
        status: b.stage === "Live" ? "Approved" as DocStatus : "Needs Audit" as DocStatus,
        type: "Legal",
        size: "540 KB",
      },
      {
        id: `${b.id}-io`,
        name: `Insertion_Order_${b.company.replace(/\s+/g, "_")}.pdf`,
        buyerCompany: b.company,
        buyerOwner: b.owner,
        uploadedBy: b.owner,
        uploadDate: b.inDate,
        status: b.stage === "Live" ? "Approved" as DocStatus : b.stage === "Paperwork" ? "Needs Audit" as DocStatus : "In Progress" as DocStatus,
        type: "Contract",
        size: "1.2 MB",
      },
    ]),
  ]);

  const [selectedDoc, setSelectedDoc] = useState<LegalDoc | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [newMessage, setNewMessage] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  const getMessages = (docId: string): ChatMessage[] => {
    return messages[docId] || [
      {
        id: "default-1",
        sender: "Compliance Manager",
        role: "compliance",
        time: "10:24 AM",
        content: "Document received. Starting audit review process.",
      },
    ];
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedDoc) return;
    const docId = selectedDoc.id;
    const existing = getMessages(docId);
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      role: "compliance",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: newMessage,
    };
    setMessages((prev) => ({ ...prev, [docId]: [...existing, newMsg] }));
    setNewMessage("");
  };

  const handleStatusChange = (docId: string, newStatus: DocStatus) => {
    setDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, status: newStatus } : d)));
    setShowStatusDropdown(null);
  };

  const handleUploadDoc = () => {
    const newDoc: LegalDoc = {
      id: `upload-${Date.now()}`,
      name: `New_Document_${Date.now().toString().slice(-4)}.pdf`,
      buyerCompany: "Manual Upload",
      buyerOwner: "You",
      uploadedBy: "You",
      uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Needs Audit",
      type: "Legal",
      size: "0 KB",
    };
    setDocs((prev) => [newDoc, ...prev]);
  };

  const needsAuditCount = docs.filter((d) => d.status === "Needs Audit").length;
  const inProgressCount = docs.filter((d) => d.status === "In Progress").length;
  const approvedCount = docs.filter((d) => d.status === "Approved").length;

  // Document board view (when a doc is selected)
  if (selectedDoc) {
    const docMessages = getMessages(selectedDoc.id);
    return (
      <div className="animate-fade-in -mx-8 -mt-0">
        <div className="px-8 pb-6">
          <button
            onClick={() => setSelectedDoc(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Document Queue
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedDoc.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Buyer: {selectedDoc.buyerCompany} • Uploaded by {selectedDoc.uploadedBy} on {selectedDoc.uploadDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Status changer */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(showStatusDropdown === selectedDoc.id ? null : selectedDoc.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${statusColors[selectedDoc.status]}`}
                >
                  {selectedDoc.status}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showStatusDropdown === selectedDoc.id && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-10 overflow-hidden min-w-[160px]">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          handleStatusChange(selectedDoc.id, s);
                          setSelectedDoc((prev) => prev ? { ...prev, status: s } : null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors ${
                          s === selectedDoc.status ? "bg-accent" : ""
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/20 text-sm text-foreground hover:bg-accent transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 px-8">
          {/* Left — Document Preview / Info */}
          <div className="flex-1 min-w-0">
            <div className="surface-card p-6 mb-6">
              <h3 className="text-base font-bold text-foreground mb-4">Document Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-input rounded-xl">
                  <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Document Type</p>
                  <p className="text-sm font-semibold text-foreground">{selectedDoc.type}</p>
                </div>
                <div className="p-3 bg-input rounded-xl">
                  <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">File Size</p>
                  <p className="text-sm font-semibold text-foreground">{selectedDoc.size}</p>
                </div>
                <div className="p-3 bg-input rounded-xl">
                  <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Account Owner</p>
                  <p className="text-sm font-semibold text-foreground">{selectedDoc.buyerOwner}</p>
                </div>
                <div className="p-3 bg-input rounded-xl">
                  <p className="text-[10px] font-label uppercase tracking-wider text-muted-foreground mb-1">Upload Date</p>
                  <p className="text-sm font-semibold text-foreground">{selectedDoc.uploadDate}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="surface-card p-6">
              <h3 className="text-base font-bold text-foreground mb-4">Audit Workflow</h3>
              <div className="flex items-center gap-2">
                {statusOptions.map((s, i) => {
                  const isActive = statusOptions.indexOf(selectedDoc.status) >= i;
                  return (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={`flex items-center gap-2 flex-1 p-3 rounded-xl border-2 transition-all ${
                        isActive
                          ? s === "Approved"
                            ? "border-primary-container bg-primary-container/5"
                            : s === "In Progress"
                            ? "border-tertiary bg-tertiary/5"
                            : "border-amber-500 bg-amber-500/5"
                          : "border-outline-variant/20 bg-transparent"
                      }`}>
                        {s === "Needs Audit" && <AlertTriangle className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-500" : "text-muted-foreground/40"}`} />}
                        {s === "In Progress" && <Clock className={`w-4 h-4 shrink-0 ${isActive ? "text-tertiary" : "text-muted-foreground/40"}`} />}
                        {s === "Approved" && <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? "text-primary-container" : "text-muted-foreground/40"}`} />}
                        <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground/40"}`}>{s}</span>
                      </div>
                      {i < statusOptions.length - 1 && (
                        <div className={`w-6 h-0.5 rounded-full shrink-0 ${isActive ? "bg-primary-container" : "bg-outline-variant/20"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — Discussion Board */}
          <div className="w-[380px] shrink-0 surface-card flex flex-col h-[calc(100vh-220px)]">
            <div className="p-5 border-b border-outline-variant/10">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Comments</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Account Owner & Compliance Manager discussion
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {docMessages.map((msg) => (
                <div key={msg.id}>
                  <div className={`flex items-center gap-2 mb-1.5 ${msg.role === "compliance" ? "justify-end" : ""}`}>
                    <span className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">
                      {msg.sender} ({msg.role === "owner" ? "Account Owner" : "Compliance"})
                    </span>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "compliance"
                        ? "gradient-primary text-primary-foreground ml-6 rounded-tr-sm"
                        : "bg-surface-container text-foreground mr-6 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                    {msg.attachment && (
                      <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg ${
                        msg.role === "compliance" ? "bg-primary-foreground/10" : "bg-card"
                      }`}>
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-medium flex-1">{msg.attachment.name}</span>
                        <Download className="w-3.5 h-3.5 cursor-pointer hover:opacity-70" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-outline-variant/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Add a comment..."
                  className="flex-1 bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main queue view
  return (
    <div className="animate-fade-in -mx-8 -mt-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">Legal & Compliance</h1>
          <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2">
            <RefreshCw className="w-4 h-4 text-primary-container" />
            <span className="text-xs font-label uppercase tracking-wider text-foreground font-medium">
              Synced with Buyer Paperwork
            </span>
          </div>
        </div>
        <button
          onClick={handleUploadDoc}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="px-8">
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">Needs Audit</p>
            </div>
            <span className="text-2xl font-headline font-bold text-foreground">{needsAuditCount}</span>
            <span className="text-xs text-amber-500 font-medium ml-2">Documents pending review</span>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-tertiary" />
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">In Progress</p>
            </div>
            <span className="text-2xl font-headline font-bold text-foreground">{inProgressCount}</span>
            <span className="text-xs text-tertiary font-medium ml-2">Under review</span>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-primary-container" />
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">Approved</p>
            </div>
            <span className="text-2xl font-headline font-bold text-foreground">{approvedCount}</span>
            <span className="text-xs text-primary-container font-medium ml-2">Cleared</span>
          </div>
        </div>

        {/* Document Queue */}
        <div className="mb-6">
          <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-1">Queue</p>
          <h2 className="text-xl font-bold text-foreground">Document Review Pipeline</h2>
        </div>

        <div className="space-y-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="surface-card p-5 cursor-pointer transition-all hover:shadow-lg flex items-start gap-4 border-l-[3px] border-transparent hover:border-primary"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                doc.status === "Approved"
                  ? "bg-primary-container/10"
                  : doc.status === "Needs Audit"
                  ? "bg-amber-500/10"
                  : "bg-surface-container-high"
              }`}>
                <FileText className={`w-5 h-5 ${
                  doc.status === "Approved"
                    ? "text-primary-container"
                    : doc.status === "Needs Audit"
                    ? "text-amber-500"
                    : "text-muted-foreground"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Buyer: {doc.buyerCompany} • Owner: {doc.buyerOwner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Inline status changer */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStatusDropdown(showStatusDropdown === doc.id ? null : doc.id);
                        }}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1 ${statusColors[doc.status]}`}
                      >
                        {doc.status}
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                      {showStatusDropdown === doc.id && (
                        <div className="absolute right-0 top-full mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-10 overflow-hidden min-w-[140px]">
                          {statusOptions.map((s) => (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(doc.id, s);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-accent transition-colors ${
                                s === doc.status ? "bg-accent" : ""
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {doc.uploadDate}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{doc.type} • {doc.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
