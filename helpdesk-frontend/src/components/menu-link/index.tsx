import type { Icon } from "../icons";

export function MenuLink(icon: Icon, label: string) {
  return (
    <nav>
      {icon} <label>{label ?? "Label"}</label>
      // TODO: continue here, missing css
    </nav>
  );
}
