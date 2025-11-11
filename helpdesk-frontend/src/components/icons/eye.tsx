import type { Icon } from "./interface/icon.interface";

type Props = React.ComponentProps<"svg">;

export function EyeIcon({ ...props }: Props): Icon {
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
        d="M16 8a13 13 0 0 0-12 8 13 13 0 0 0 24 0 13 13 0 0 0-12-8Zm-8.714-.019a15.667 15.667 0 0 1 23.215 7.091 2.666 2.666 0 0 1-.018 1.9A15.667 15.667 0 0 1 1.5 16.928a2.667 2.667 0 0 1 .018-1.9 15.667 15.667 0 0 1 5.77-7.047ZM16 13.333a2.667 2.667 0 1 0 0 5.334 2.667 2.667 0 0 0 0-5.334ZM10.667 16a5.333 5.333 0 1 1 10.667 0 5.333 5.333 0 0 1-10.667 0Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
