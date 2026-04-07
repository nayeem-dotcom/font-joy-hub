import { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings, User, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuyers } from "@/contexts/BuyerContext";

export default function TopNav() {
  const navigate = useNavigate();
  const { buyers } = useBuyers();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const searchResults = searchQuery.trim().length > 0
    ? buyers.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.vertical.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const notifications = [
    { id: 1, title: "New buyer onboarded", desc: "SolarTech Inc. is now live", time: "2h ago", read: false },
    { id: 2, title: "Document uploaded", desc: "NDA for BlueWave Logistics", time: "5h ago", read: false },
    { id: 3, title: "Buyer stuck alert", desc: "Nexus Retail in Paperwork for 5 days", time: "1d ago", read: true },
    { id: 4, title: "New team member joined", desc: "Joe Austin accepted invitation", time: "2d ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 flex items-center justify-between px-8">
      {/* Search */}
      <div className="relative w-96">
        <div className="flex items-center gap-2 bg-input rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search buyers, companies or offers..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }}>
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        {searchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden">
            {searchResults.length > 0 ? (
              searchResults.map((b) => (
                <button
                  key={b.id}
                  className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center justify-between"
                  onMouseDown={() => { navigate("/buyers"); setSearchQuery(""); }}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.company} • {b.vertical}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/dashboard")} className="text-sm text-primary font-semibold cursor-pointer hover:underline">Reports</button>
        <button onClick={() => navigate("/team")} className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">Insights</button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                <span className="text-xs text-primary font-semibold">{unreadCount} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-accent transition-colors cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                      <div className={!n.read ? "" : "pl-3.5"}>
                        <p className="text-sm font-semibold text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.desc}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-outline-variant/10">
                <button className="w-full text-xs text-primary font-semibold hover:underline">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center cursor-pointer"
          >
            <User className="w-4 h-4 text-primary-foreground" />
          </button>
          {showProfile && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-outline-variant/20 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/10">
                <p className="text-sm font-bold text-foreground">Nayeem Ahmad</p>
                <p className="text-xs text-muted-foreground">nayeem@rayfunnel.io</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate("/settings"); setShowProfile(false); }} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
                  Settings
                </button>
                <button onClick={() => { navigate("/team"); setShowProfile(false); }} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
                  Team Performance
                </button>
              </div>
              <div className="border-t border-outline-variant/10 py-1">
                <button
                  onClick={() => { navigate("/login"); setShowProfile(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
