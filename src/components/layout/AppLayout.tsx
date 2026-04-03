import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-64">
        <TopNav />
        <main className="px-8 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
