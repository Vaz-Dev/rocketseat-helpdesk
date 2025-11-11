import type { Icon } from "./interface/icon.interface";

type Props = React.ComponentProps<"svg">;

export function BlockIcon({ ...props }: Props): Icon {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      {...props}
    >
      <path d="M28 16c0-6.627-5.372-12-12-12a11.95 11.95 0 0 0-7.49 2.624L25.375 23.49A11.948 11.948 0 0 0 28 16ZM4 16c0 6.627 5.373 12 12 12 2.833 0 5.437-.983 7.49-2.625L6.624 8.51A11.95 11.95 0 0 0 4 16Zm26.667 0c0 3.907-1.529 7.457-4.02 10.086a1.33 1.33 0 0 1-.562.561A14.615 14.615 0 0 1 16 30.667C7.9 30.667 1.333 24.1 1.333 16c0-3.908 1.529-7.458 4.02-10.087a1.332 1.332 0 0 1 .56-.56A14.617 14.617 0 0 1 16 1.332C24.1 1.333 30.667 7.9 30.667 16Z" />
    </svg>
  );
}
