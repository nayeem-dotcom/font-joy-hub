import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Filter,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Rocket,
  Scale,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Filter, label: "Buyer Funnel", path: "/pipeline" },
  { icon: Users, label: "All Buyers", path: "/buyers" },
  { icon: BarChart3, label: "Team Performance", path: "/team" },
  { icon: Scale, label: "Legal & Compliance", path: "/legal" },
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full z-40 w-64 bg-surface-container-low font-headline font-semibold tracking-tight flex flex-col">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Rocket className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">Ray Funnel</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Growth Engine</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? "text-primary bg-primary/5 font-bold border-l-[3px] border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Add Buyer Button */}
        <Link
          to="/buyers/new"
          className="gradient-primary text-primary-foreground rounded-xl px-5 py-3.5 flex items-center justify-center gap-2 font-semibold text-sm mb-6 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New Buyer
        </Link>

        {/* Bottom */}
        <div className="space-y-1">
          <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground w-full rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
            Help Center
          </button>
          <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground w-full rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}
