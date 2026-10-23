import { Link } from "react-router-dom";

type BrandProps = { light?: boolean; editorial?: boolean; onClick?: () => void };

export function Brand({ light = false, editorial = false, onClick }: BrandProps) {
  return (
    <Link className={`brand${light ? " brand--light" : ""}${editorial ? " brand--editorial" : ""}`} to="/" onClick={onClick} aria-label={editorial ? "AeroGo home" : "AeroGo Travel & Tours home"}>
      <span className="brand__name">{editorial ? "AeroGo" : "AEROGO"}</span>
      <span className="brand__sub">{editorial ? "More to discover." : "TRAVEL & TOURS"}</span>
    </Link>
  );
}
