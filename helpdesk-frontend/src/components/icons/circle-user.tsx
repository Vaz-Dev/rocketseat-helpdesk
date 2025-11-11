import type { Icon } from "./interface/icon.interface";

type Props = React.ComponentProps<"svg">;

export function UserCircleIcon({ ...props }: Props): Icon {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M16 4C9.373 4 4 9.373 4 16a11.97 11.97 0 0 0 4.017 8.96A4 4 0 0 1 12 21.333h8a4 4 0 0 1 3.983 3.627A11.97 11.97 0 0 0 28 16c0-6.627-5.373-12-12-12Zm5.333 22.753v-1.42A1.334 1.334 0 0 0 20 24h-8a1.333 1.333 0 0 0-1.333 1.333v1.42A11.951 11.951 0 0 0 16 28a11.95 11.95 0 0 0 5.333-1.247ZM1.333 16C1.333 7.9 7.9 1.333 16 1.333S30.667 7.9 30.667 16 24.1 30.667 16 30.667 1.333 24.1 1.333 16ZM16 10.667A2.667 2.667 0 1 0 16 16a2.667 2.667 0 0 0 0-5.333Zm-5.333 2.666a5.333 5.333 0 1 1 10.666 0 5.333 5.333 0 0 1-10.666 0Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
