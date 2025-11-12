import type React from "react";
import { MenuOption, type MenuOptionsProps } from "./menu-option";

type Props = React.ComponentProps<"menu"> & {
  options: MenuOptionsProps[];
  useState: {
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
  };
};

export function Menu({ options: options, useState, ...props }: Props) {
  // TODO: levar o useState para page, data-selected o botão com o id == useState
  const optionItems = [];
  let index = 0;
  for (const option of options) {
    index++;
    const optionData = option.label ?? `optionIndex${index}`;
    const isSelected =
      optionData == useState.state ? { "data-selected": true } : null;

    optionItems.push(
      <MenuOption
        onClick={() => useState.setState(optionData)}
        key={optionData}
        id={optionData}
        {...isSelected}
        {...option}
      />,
    );
  }
  return (
    <menu className="flex flex-col gap-1 p-5" {...props}>
      {optionItems}
    </menu>
  );
}
