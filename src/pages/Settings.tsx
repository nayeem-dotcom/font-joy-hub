import { useState } from "react";
import {
  Users,
  Shield,
  Database,
  Plus,
  Check,
  Clock,
  X,
  Send,
  ChevronRight,
  Lock,
  Key,
  Eye,
  Download,
  FileText,
  Trash2,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Affiliate Manager" | "Advertiser Account Manager" | "Compliance Manager" | "Devops Manager" | "Affiliate Coordinator" | "Business Development Manager" | "Sales Executive" | "Project Manager";
  status: "Active" | "Pending" | "Inactive";
  lastActive: string;
}

const initialMembers: TeamMember[] = [
  { id: "1", name: "Nayeem Ahmad", email: "nayeem@rayfunnel.io", role: "Admin", status: "Active", lastActive: "Just now" },
  { id: "2", name: "Daniela Navarrete", email: "daniela@rayfunnel.io", role: "Affiliate Manager", status: "Active", lastActive: "2 hours ago" },
  { id: "3", name: "Mariela Perez", email: "mariela@rayfunnel.io", role: "Advertiser Account Manager", status: "Active", lastActive: "1 day ago" },
  { id: "4", name: "Joe Austin", email: "joe@rayfunnel.io", role: "Compliance Manager", status: "Active", lastActive: "3 hours ago" },
  { id: "5", name: "Ripon Kumar", email: "ripon@rayfunnel.io", role: "Devops Manager", status: "Active", lastActive: "5 hours ago" },
  { id: "6", name: "Dan Davies", email: "dan@rayfunnel.io", role: "Business Development Manager", status: "Active", lastActive: "1 day ago" },
];

const roles = [
  { value: "Admin", desc: "Full access to all features, settings, and user management" },
  { value: "Affiliate Manager", desc: "Manages affiliate relationships and performance" },
  { value: "Advertiser Account Manager", desc: "Manages advertiser accounts and campaigns" },
  { value: "Compliance Manager", desc: "Oversees legal compliance and document audits" },
  { value: "Devops Manager", desc: "Manages technical infrastructure and deployments" },
  { value: "Affiliate Coordinator", desc: "Coordinates affiliate onboarding and support" },
  { value: "Business Development Manager", desc: "Drives new business opportunities and partnerships" },
  { value: "Sales Executive", desc: "Handles sales outreach and deal closing" },
  { value: "Project Manager", desc: "Manages project timelines and team coordination" },
];

const settingsTabs = [
  { icon: Users, label: "User Access" },
  { icon: Shield, label: "Security" },
  { icon: Database, label: "Data & Export" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Check }> = {
  Active: { bg: "bg-primary-container/10", text: "text-primary-container", icon: Check },
  Pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
  Inactive: { bg: "bg-surface-container", text: "text-muted-foreground", icon: X },
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Affiliate Coordinator");
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "Pending",
      lastActive: "Invited",
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const handleRoleChange = (memberId: string, newRole: TeamMember["role"]) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    setEditingRole(null);
  };

  const handleRemove = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const handleResend = (memberId: string) => {
    // UI feedback
    setMembers(members.map((m) => (m.id === memberId ? { ...m, lastActive: "Resent just now" } : m)));
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your workspace, team access, and preferences.</p>

      <div className="flex gap-8">
        {/* Left tabs */}
        <div className="w-56 shrink-0 space-y-1">
          {settingsTabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full transition-all ${
                i === activeTab
                  ? "text-primary bg-primary/5 font-bold border-l-[3px] border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 0 && (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Team Access</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Invite team members and manage their permissions for buyer onboarding.
                  </p>
                </div>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Invite Member
                </button>
              </div>

              {/* Role breakdown cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {roles.map((r) => {
                  const count = members.filter((m) => m.role === r.value).length;
                  return (
                    <div key={r.value} className="surface-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-label uppercase tracking-wider text-muted-foreground">{r.value}s</span>
                        <span className="text-lg font-headline font-bold text-foreground">{count}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{r.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Members table */}
              <div className="surface-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs font-label uppercase tracking-wider text-muted-foreground">
                      <th className="text-left py-4 px-6 font-medium">Member</th>
                      <th className="text-left py-4 px-4 font-medium">Role</th>
                      <th className="text-left py-4 px-4 font-medium">Status</th>
                      <th className="text-left py-4 px-4 font-medium">Last Active</th>
                      <th className="text-right py-4 px-6 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => {
                      const status = statusConfig[m.status];
                      return (
                        <tr key={m.id} className="group hover:bg-accent/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center">
                                <span className="text-sm font-semibold text-foreground">
                                  {m.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{m.name}</p>
                                <p className="text-xs text-muted-foreground">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 relative">
                            <button
                              onClick={() => setEditingRole(editingRole === m.id ? null : m.id)}
                              className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              {m.role}
                              <ChevronRight className="w-3 h-3 rotate-90" />
                            </button>
                            {editingRole === m.id && (
                              <div className="absolute top-full left-0 mt-1 z-10 bg-card rounded-xl shadow-lg p-2 min-w-[200px]">
                                {roles.map((r) => (
                                  <button
                                    key={r.value}
                                    onClick={() => handleRoleChange(m.id, r.value as TeamMember["role"])}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                      m.role === r.value
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-foreground hover:bg-accent"
                                    }`}
                                  >
                                    {r.value}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${status.bg} ${status.text}`}>
                              <status.icon className="w-3 h-3" />
                              {m.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{m.lastActive}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {m.status === "Pending" && (
                                <button
                                  onClick={() => handleResend(m.id)}
                                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" />
                                  Resend
                                </button>
                              )}
                              <button
                                onClick={() => handleRemove(m.id)}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage authentication and access controls.</p>
              </div>

              <div className="space-y-4">
                <div className="surface-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Password Policy</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Minimum 8 characters", enabled: true },
                      { label: "Require uppercase & lowercase", enabled: true },
                      { label: "Require numbers", enabled: true },
                      { label: "Require special characters", enabled: false },
                    ].map((rule) => (
                      <label key={rule.label} className="flex items-center justify-between py-2">
                        <span className="text-sm text-foreground">{rule.label}</span>
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${rule.enabled ? "bg-primary" : "bg-surface-container-high"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow transition-transform ${rule.enabled ? "right-0.5" : "left-0.5"}`} />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="surface-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Two-Factor Authentication</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to team accounts.</p>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-foreground">Enforce 2FA for all team members</span>
                    <div className="w-10 h-5 rounded-full relative cursor-pointer bg-surface-container-high">
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-primary-foreground shadow" />
                    </div>
                  </div>
                </div>

                <div className="surface-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Session Management</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-foreground">Auto-logout after inactivity</span>
                      <select className="bg-input rounded-lg px-3 py-1.5 text-sm text-foreground outline-none">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>Never</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-foreground">Maximum concurrent sessions</span>
                      <select className="bg-input rounded-lg px-3 py-1.5 text-sm text-foreground outline-none">
                        <option>1</option>
                        <option>3</option>
                        <option>5</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data & Export Tab */}
          {activeTab === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Data & Export</h2>
                <p className="text-sm text-muted-foreground mt-1">Export your data and manage storage.</p>
              </div>

              <div className="space-y-4">
                <div className="surface-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Download className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">Export Data</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Download your workspace data in common formats.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "All Buyers", desc: "Export full buyer list with details" },
                      { label: "Pipeline Data", desc: "Funnel stages and progression" },
                      { label: "Team Performance", desc: "Metrics and conversion data" },
                      { label: "Compliance Logs", desc: "Audit trail and document history" },
                    ].map((item) => (
                      <button key={item.label} className="text-left p-4 rounded-xl bg-input hover:bg-accent transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{item.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export as CSV
                    </button>
                    <button className="px-5 py-2.5 rounded-xl border border-outline-variant/20 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
                      Export as PDF
                    </button>
                  </div>
                </div>

                <div className="surface-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="text-base font-bold text-foreground">Danger Zone</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Permanently delete workspace data. This action cannot be undone.</p>
                  <button className="px-5 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowInviteModal(false)}>
          <div className="absolute inset-0 bg-foreground/10 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-2 rounded-lg hover:bg-accent">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Send an invitation to join your Buyerly workspace. They'll receive an email with access instructions.
            </p>

            <div className="mb-5">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-2 block">Assign Role</label>
              <div className="space-y-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setInviteRole(r.value as TeamMember["role"])}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      inviteRole === r.value
                        ? "bg-primary/5 ring-2 ring-primary/30"
                        : "bg-input hover:bg-accent"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${inviteRole === r.value ? "text-primary" : "text-foreground"}`}>
                      {r.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/20 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
