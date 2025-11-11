import type { Icon } from "./interface/icon.interface";

type Props = React.ComponentProps<"svg">;

export function WrenchIcon({ ...props }: Props): Icon {
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
        d="M22.077 4.037a6.666 6.666 0 0 0-6.822 9.373c.229.506.12 1.1-.272 1.493l-9.214 9.213a1.495 1.495 0 0 0 2.115 2.114l9.213-9.213c.393-.392.987-.5 1.493-.272a6.666 6.666 0 0 0 9.373-6.822l-3.42 3.42-.01.01a2.666 2.666 0 0 1-3.733 0l-.01-.01-2.133-2.134-.01-.01a2.667 2.667 0 0 1 0-3.732l.01-.01 3.42-3.42ZM19.655 1.48a9.333 9.333 0 0 1 5.521.678 1.333 1.333 0 0 1 .394 2.158l-5.018 5.017 2.115 2.115 5.017-5.018a1.333 1.333 0 0 1 2.157.394 9.334 9.334 0 0 1-11.475 12.695L9.77 28.116a4.162 4.162 0 1 1-5.885-5.886l8.597-8.597A9.333 9.333 0 0 1 19.656 1.48Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
