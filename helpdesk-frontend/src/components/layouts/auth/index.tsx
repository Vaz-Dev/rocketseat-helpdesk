import "./styles.module.css";
import { ArrowIcon } from "../../icons";

import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div>
      <ArrowIcon point="up" className="text-red-500" />
      <Outlet />
    </div>
  );
}
