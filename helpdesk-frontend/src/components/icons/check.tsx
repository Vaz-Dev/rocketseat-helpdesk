type Props = React.ComponentProps<"svg">;

export function CheckIcon({ ...props }: Props) {
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
        d="M27.61 7.057c.52.521.52 1.365 0 1.886L12.943 23.61c-.52.52-1.365.52-1.886 0l-6.666-6.667a1.333 1.333 0 0 1 1.885-1.886L12 20.781 25.724 7.057c.52-.52 1.365-.52 1.886 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
