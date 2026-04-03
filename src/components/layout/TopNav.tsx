import { Search, Bell, Settings, User } from "lucide-react";

export default function TopNav() {
  return (
    <header className="h-16 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex items-center gap-2 bg-input rounded-xl px-4 py-2.5 w-96">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search buyers, companies or offers..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-primary font-semibold cursor-pointer hover:underline">Reports</span>
        <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">Insights</span>
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
