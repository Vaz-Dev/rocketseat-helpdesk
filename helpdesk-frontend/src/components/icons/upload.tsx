import type { Icon } from "./interface/icon.interface";

type Props = React.ComponentProps<"svg">;

export function UploadIcon({ ...props }: Props): Icon {
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
        d="M15.057 3.057c.52-.52 1.365-.52 1.886 0l6.666 6.667a1.333 1.333 0 0 1-1.885 1.886l-4.39-4.391V20a1.333 1.333 0 0 1-2.667 0V7.22l-4.39 4.39A1.333 1.333 0 0 1 8.39 9.725l6.666-6.667ZM4 18.667c.736 0 1.333.597 1.333 1.333v5.333a1.333 1.333 0 0 0 1.334 1.334h18.666a1.333 1.333 0 0 0 1.334-1.334V20a1.333 1.333 0 1 1 2.666 0v5.333a4 4 0 0 1-4 4H6.667a4 4 0 0 1-4-4V20c0-.736.597-1.333 1.333-1.333Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
