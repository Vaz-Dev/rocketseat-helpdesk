import type React from "react";
import * as Icons from "../icons";

type Props = React.ComponentProps<"li"> & { icon?: string; label?: string };
export type { Props as MenuOptionsProps };

export function MenuOption({ icon, label, ...props }: Props) {
  const iconItem = icon ? Icons[icon] : Icons.MenuIcon;
  return (
    <li
      className="flex cursor-pointer gap-3 p-3 transition text-sm rounded-md bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 data-selected:bg-blue-dark data-selected:text-gray-600 data-selected:font-bold data-selected:cursor-default"
      {...props}
    >
      {iconItem({ className: "size-5 text-inherit" })}
      <label className="cursor-[inherit]">{label ?? "Label"}</label>
    </li>
  );
}
