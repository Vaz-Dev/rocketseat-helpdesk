import type { Icon } from "./interface/icon.interface";

type Props = React.ComponentProps<"svg">;

export function CheckCircleIcon({ ...props }: Props): Icon {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      {...props}
    >
      <path d="M28 16c0-6.627-5.372-12-12-12C9.373 4 4 9.373 4 16s5.373 12 12 12c6.628 0 12-5.373 12-12Zm-8.943-3.61a1.333 1.333 0 1 1 1.886 1.886l-5.334 5.333a1.332 1.332 0 0 1-1.885 0l-2.667-2.666-.091-.101a1.334 1.334 0 0 1 1.876-1.877l.1.092 1.725 1.724 4.39-4.39ZM30.667 16c0 8.1-6.567 14.667-14.667 14.667S1.333 24.1 1.333 16 7.9 1.333 16 1.333 30.667 7.9 30.667 16Z" />
    </svg>
  );
}
