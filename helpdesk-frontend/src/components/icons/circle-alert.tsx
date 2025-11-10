type Props = React.ComponentProps<"svg">;

export function AlertIcon({ ...props }: Props) {
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
        d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4ZM1.333 16C1.333 7.9 7.9 1.333 16 1.333S30.667 7.9 30.667 16 24.1 30.667 16 30.667 1.333 24.1 1.333 16ZM16 9.333c.736 0 1.333.597 1.333 1.334V16a1.333 1.333 0 1 1-2.666 0v-5.333c0-.737.597-1.334 1.333-1.334Zm-1.333 12c0-.736.597-1.333 1.333-1.333h.013a1.333 1.333 0 0 1 0 2.667H16a1.333 1.333 0 0 1-1.333-1.334Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
