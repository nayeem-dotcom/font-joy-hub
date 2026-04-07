import { useState, useRef, useEffect } from "react";
import { Search, Settings, User, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuyers } from "@/contexts/BuyerContext";

export default function TopNav() {
  const navigate = useNavigate();
  const { buyers } = useBuyers();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
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
