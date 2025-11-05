import "./styles.module.css";

import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
