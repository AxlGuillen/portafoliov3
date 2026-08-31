type LogoProps = {
  size?: number;
  className?: string;
  /** Color del trazo del 4. Por defecto hereda currentColor. */
  trazo?: string;
  fondo?: string;
};

/** El 4 de 4XL: el número y la inicial de Axl en la misma forma. */
export function Logo({
  size = 40,
  className,
  trazo = "currentColor",
  fondo = "transparent",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="4XL"
    >
      <rect
        width="120"
        height="120"
        rx="27"
        fill={fondo}
        stroke={trazo}
        strokeWidth="6"
      />
      <g fill={trazo} transform="translate(8,14)">
        <path d="M0 52 H104 V66 H0 Z" />
        <path d="M66 0 H80 V78 H104 V92 H66 V20 L26 60 H6 Z" />
      </g>
    </svg>
  );
}
