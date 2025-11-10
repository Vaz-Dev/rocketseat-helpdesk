type Props = React.ComponentProps<"svg">;

export function XIcon({ ...props }: Props) {
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
        d="M7.057 7.057c.52-.52 1.365-.52 1.886 0L16 14.114l7.057-7.057a1.333 1.333 0 0 1 1.886 1.886L17.886 16l7.057 7.057a1.333 1.333 0 1 1-1.886 1.886L16 17.886l-7.057 7.057a1.333 1.333 0 0 1-1.886-1.886L14.114 16 7.057 8.943a1.333 1.333 0 0 1 0-1.886Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
