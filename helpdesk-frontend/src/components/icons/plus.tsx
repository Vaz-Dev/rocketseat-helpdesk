type Props = React.ComponentProps<"svg">;

export function PlusIcon({ ...props }: Props) {
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
        d="M16 5.333c.736 0 1.333.597 1.333 1.334v8h8a1.333 1.333 0 1 1 0 2.666h-8v8a1.333 1.333 0 0 1-2.666 0v-8h-8a1.333 1.333 0 0 1 0-2.666h8v-8c0-.737.597-1.334 1.333-1.334Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
