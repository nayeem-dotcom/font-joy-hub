import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Shield, Sparkles, Headphones } from "lucide-react";
import { useBuyers, VERTICALS, TEAM_MEMBERS } from "@/contexts/BuyerContext";

const steps = ["Business Info", "Contact Details", "Verticals & Tier", "Special Notes"];

export default function AddNewBuyer() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { addBuyer } = useBuyers();
  const [formData, setFormData] = useState({
    company: "", website: "", industry: "",
    firstName: "", lastName: "", email: "", phone: "",
    vertical: "", tier: "", owner: TEAM_MEMBERS[0] as string, notes: "",
  });

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <button onClick={() => navigate("/buyers")} className="hover:text-foreground">Buyers</button>
        <span>›</span>
        <span className="text-foreground font-medium">Add New Buyer</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-1">Onboard New Buyer</h1>
      <p className="text-muted-foreground mb-8">Initialize a new buyer funnel record with precision tracking and offer mapping.</p>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i <= currentStep
                ? "gradient-primary text-primary-foreground"
                : "bg-surface-container-high text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-xs font-label uppercase tracking-wider ${
              i <= currentStep ? "text-primary font-semibold" : "text-muted-foreground"
            }`}>
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 rounded-full ${i < currentStep ? "bg-primary-container" : "bg-surface-container-high"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="surface-card p-8 mb-8">
        {currentStep === 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Business Information</h2>
            <p className="text-sm text-muted-foreground mb-6">Define the core identity of the company and industry segment.</p>
            <div className="mb-5">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Company Name</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData(p => ({...p, company: e.target.value}))} placeholder="e.g. Carfax Logistics" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData(p => ({...p, website: e.target.value}))} placeholder="https://example.com" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Industry</label>
                <input type="text" value={formData.industry} onChange={(e) => setFormData(p => ({...p, industry: e.target.value}))} placeholder="Enter industry..." className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Contact Details</h2>
            <p className="text-sm text-muted-foreground mb-6">Primary point of contact for this buyer account.</p>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData(p => ({...p, firstName: e.target.value}))} placeholder="John" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData(p => ({...p, lastName: e.target.value}))} placeholder="Doe" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} placeholder="john@company.com" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))} placeholder="+1 (555) 000-0000" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Verticals & Tier</h2>
            <p className="text-sm text-muted-foreground mb-6">Assign this buyer to performance cohorts.</p>
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Vertical</label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData(p => ({...p, vertical: e.target.value}))}
                  className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">Select vertical...</option>
                  {VERTICALS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Buyer Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData(p => ({...p, tier: e.target.value}))}
                  className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="">Select tier...</option>
                  <option>Direct Buyer</option>
                  <option>Agency</option>
                  <option>Network</option>
                  <option>Broker</option>
                  <option>Aggregator</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Assign Owner</label>
              <select
                value={formData.owner}
                onChange={(e) => setFormData(p => ({...p, owner: e.target.value}))}
                className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Special Notes</h2>
            <p className="text-sm text-muted-foreground mb-6">Add any additional context for the onboarding team.</p>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(p => ({...p, notes: e.target.value}))}
              placeholder="Enter any special instructions, requirements, or notes..."
              className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none h-32"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => currentStep === 0 ? navigate("/buyers") : setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                addBuyer({
                  name: `${formData.firstName} ${formData.lastName}`.trim() || formData.company,
                  company: formData.company || "New Company",
                  owner: formData.owner,
                  vertical: formData.vertical || "Other",
                  tier: formData.tier || "Direct Buyer",
                  stage: "Buyer Created",
                  stageColor: "bg-tertiary",
                  active: true,
                  inDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                  liveDate: "Pending...",
                  daysInStage: 0,
                });
                navigate("/pipeline");
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {currentStep < steps.length - 1 ? "Next Step" : "Create Buyer"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom features */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { icon: Shield, title: "Encrypted Data", desc: "All buyer contact details are end-to-end encrypted and PII compliant." },
          { icon: Sparkles, title: "Auto-Tagging", desc: "Buyers are automatically mapped to performance cohorts based on vertical." },
          { icon: Headphones, title: "Concierge Flow", desc: "Need help? Press Ctrl+H for documentation." },
        ].map((f) => (
          <div key={f.title} className="surface-card p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
