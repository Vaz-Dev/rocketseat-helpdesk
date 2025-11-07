type Props = React.ComponentProps<"svg"> & { point: string };

export function ArrowIcon({ point, ...props }: Props) {
  let rotateValue = 0;
  switch (point) {
    case "down":
      rotateValue = 270;
      break;
    case "right":
      rotateValue = 180;
      break;
    case "up":
      rotateValue = 90;
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
        d="M16.943 5.724c.52.52.52 1.365 0 1.885l-7.057 7.058h15.447a1.333 1.333 0 1 1 0 2.666H9.886l7.057 7.057a1.333 1.333 0 0 1-1.886 1.886l-9.333-9.333a1.333 1.333 0 0 1 0-1.886l9.333-9.333c.52-.52 1.365-.52 1.886 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
