type Props = React.ComponentProps<"svg"> & { point: string };

export function ChevronIcon({ point, ...props }: Props) {
  let rotateValue = 0;
  switch (point) {
    case "left":
      rotateValue = 90;
      break;
    case "up":
      rotateValue = 180;
      break;
    case "right":
      rotateValue = 270;
      break;
  }
  const rotateRule = { transform: `rotateZ(${rotateValue}deg)` };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 32 32"
      style={rotateRule}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M7.057 11.057c.52-.52 1.365-.52 1.886 0L16 18.114l7.057-7.057a1.333 1.333 0 1 1 1.886 1.886l-8 8c-.52.52-1.365.52-1.886 0l-8-8a1.333 1.333 0 0 1 0-1.886Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
