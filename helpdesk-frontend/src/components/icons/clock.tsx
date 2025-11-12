type Props = React.ComponentProps<"svg">;

export function ClockIcon({ ...props }: Props) {
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
        d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12c6.628 0 12-5.373 12-12S22.628 4 16 4ZM1.333 16C1.333 7.9 7.9 1.333 16 1.333S30.667 7.9 30.667 16 24.1 30.667 16 30.667 1.333 24.1 1.333 16ZM16 6.667c.736 0 1.333.597 1.333 1.333v5.842l3.404-1.701a1.333 1.333 0 1 1 1.193 2.385l-5.334 2.666A1.333 1.333 0 0 1 14.666 16V8c0-.736.598-1.333 1.334-1.333Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
