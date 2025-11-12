import { useEffect, useState } from "react";
import { Menu } from "../../components/menu";

export function Dashboard() {
  const [frame, setFrame] = useState("none");
  useEffect(() => console.log(`Frame:`, frame), [frame]);
  return (
    <main>
      <nav>
        <Menu
          useState={{ state: frame, setState: setFrame }}
          options={[
            { label: "Menu 1" },
            { label: "Menu 2", icon: "XIcon" },
            { label: "Menu 3" },
          ]}
        />
      </nav>
    </main>
  );
}
