import { useState } from "react";
import {
  FileText,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Download,
  Send,
  X,
  Eye,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  buyer: string;
  status: "APPROVED" | "REDLINED" | "UNDER REVIEW" | "PENDING";
  stage: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: "buyer" | "compliance";
  time: string;
  content: string;
  attachment?: { name: string };
}

const initialDocs: Document[] = [
  { id: "d1", name: "NDA_SolarTech.pdf", buyer: "SolarTech Solutions Inc.", status: "APPROVED", stage: "Initial Diligence Stage" },
  { id: "d2", name: "MSA_GlobalLogistics_Draft_v2.pdf", buyer: "Global Logistics Corp.", status: "REDLINED", stage: "Closing Documentation" },
  { id: "d3", name: "Compliance_Checklist_Q4.pdf", buyer: "Apex Retail Partners", status: "UNDER REVIEW", stage: "Verification Stage" },
  { id: "d4", name: "Data_Processing_Agreement.pdf", buyer: "BlueWave Analytics", status: "PENDING", stage: "Privacy Review" },
  { id: "d5", name: "Service_Level_Agreement.pdf", buyer: "Helix Logistics", status: "UNDER REVIEW", stage: "Contract Negotiation" },
];

const statusColors: Record<string, string> = {
  APPROVED: "bg-primary-container/10 text-primary-container",
  REDLINED: "bg-destructive/10 text-destructive",
  "UNDER REVIEW": "bg-tertiary/10 text-tertiary",
  PENDING: "bg-surface-container text-muted-foreground",
};

const initialChat: ChatMessage[] = [
  { id: "m1", sender: "Sarah", role: "buyer", time: "10:24 AM", content: "We've reviewed the standard NDA terms. Section 4.2 needs a slight adjustment regarding the non-solicitation duration." },
  { id: "m2", sender: "You", role: "compliance", time: "11:05 AM", content: "Agreed. I've updated the draft to 12 months instead of 24. Please see the revised redlined version below.", attachment: { name: "NDA_SolarTech_REDLINED.pdf" } },
  { id: "m3", sender: "Sarah", role: "buyer", time: "11:40 AM", content: "Perfect, this looks correct. Sending for final signature now." },
];

export default function LegalPaperwork() {
  const [docs] = useState<Document[]>(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<Document>(initialDocs[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [newMessage, setNewMessage] = useState("");
  const [showNotification, setShowNotification] = useState(true);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "You",
        role: "compliance",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: newMessage,
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="animate-fade-in -mx-8 -mt-0">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-8 pb-6">
        <h1 className="text-2xl font-bold text-primary">Legal Paperwork</h1>
        <div className="flex items-center gap-2 bg-surface-container rounded-full px-4 py-2">
          <RefreshCw className="w-4 h-4 text-primary-container" />
          <span className="text-xs font-label uppercase tracking-wider text-foreground font-medium">
            Connected to Active Onboarding Deals
          </span>
        </div>
      </div>

      <div className="flex gap-6 px-8">
        {/* Left — Document Queue */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-1">Queue</p>
            <h2 className="text-xl font-bold text-foreground">Legal Review Pipeline</h2>
          </div>

          {/* Document cards */}
          <div className="space-y-4 mb-8">
            {docs.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`surface-card p-5 cursor-pointer transition-all flex items-start gap-4 ${
                    isSelected
                      ? "border-l-[3px] border-primary ring-1 ring-primary/10"
                      : "border-l-[3px] border-transparent hover:shadow-lg"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    doc.status === "APPROVED"
                      ? "bg-primary-container/10"
                      : doc.status === "REDLINED"
                      ? "bg-destructive/10"
                      : "bg-surface-container-high"
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      doc.status === "APPROVED"
                        ? "text-primary-container"
                        : doc.status === "REDLINED"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">Buyer: {doc.buyer}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 ${statusColors[doc.status]}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{doc.stage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="surface-card p-5">
              <Sparkles className="w-5 h-5 text-primary-container mb-2" />
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-1">Active Funnel Load</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-headline font-bold text-foreground">12</span>
                <span className="text-xs text-primary-container font-medium">Documents pending</span>
              </div>
            </div>
            <div className="surface-card p-5">
              <TrendingUp className="w-5 h-5 text-primary-container mb-2" />
              <p className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-1">Review Speed</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-headline font-bold text-foreground">1.4</span>
                <span className="text-xs text-muted-foreground">Days average</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Discussion Panel */}
        <div className="w-[380px] shrink-0 surface-card flex flex-col h-[calc(100vh-180px)]">
          {/* Discussion header */}
          <div className="p-5 border-b border-outline-variant/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <h3 className="text-base font-bold text-foreground">Discussion: {selectedDoc.name.replace(".pdf", "")}</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Reviewing changes from {selectedDoc.buyer.split(" ")[0]} Legal Team
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex items-center gap-2 mb-1.5 ${msg.role === "compliance" ? "justify-end" : ""}`}>
                  <span className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">
                    {msg.sender} ({msg.role === "buyer" ? "Buyer Team" : "Compliance"})
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
                      msg.role === "compliance"
                        ? "bg-primary-foreground/10"
                        : "bg-card"
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

          {/* Message input */}
          <div className="p-4 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message or drop revisions..."
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

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3 shadow-lg max-w-sm animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider">Live Pipeline Sync</p>
            <p className="text-xs opacity-80 mt-0.5">4 new documents detected in 'Closing' stage of Buyer Funnel.</p>
          </div>
          <button onClick={() => setShowNotification(false)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
