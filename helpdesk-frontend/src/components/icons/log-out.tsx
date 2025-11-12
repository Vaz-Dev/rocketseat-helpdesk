type Props = React.ComponentProps<"svg">;

export function LogoutIcon({ ...props }: Props) {
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
        fillRule="evenodd"
        d="M6.667 5.333a1.333 1.333 0 0 0-1.334 1.334v18.666a1.333 1.333 0 0 0 1.334 1.334H12a1.333 1.333 0 0 1 0 2.666H6.667a4 4 0 0 1-4-4V6.667a4 4 0 0 1 4-4H12a1.333 1.333 0 1 1 0 2.666H6.667ZM20.39 8.391a1.332 1.332 0 0 1 1.885 0l6.667 6.666c.52.521.52 1.365 0 1.886l-6.667 6.667a1.333 1.333 0 0 1-1.886-1.886l4.391-4.39H12a1.333 1.333 0 1 1 0-2.667h12.781l-4.39-4.39a1.333 1.333 0 0 1 0-1.886Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
