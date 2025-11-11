import { Outlet } from "react-router";

export function DashboardLayout() {
  return (
    <div>
      <header>...</header>

      <Outlet />
    </div>
  );
}
