type Props = React.ComponentProps<"svg">;

export function CheckBigCircleIcon({ ...props }: Props) {
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
        d="M22 5.602a12 12 0 1 0 5.762 7.998 1.333 1.333 0 0 1 2.613-.533 14.667 14.667 0 1 1-7.042-9.775A1.333 1.333 0 0 1 22 5.602Zm8.276-1.211c.52.52.52 1.365 0 1.885L16.943 19.61c-.52.52-1.365.52-1.886 0l-4-4a1.333 1.333 0 1 1 1.886-1.886L16 16.78 28.39 4.39a1.333 1.333 0 0 1 1.886 0Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
