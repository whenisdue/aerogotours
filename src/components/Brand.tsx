import { Link } from "react-router-dom";

type BrandProps = { light?: boolean; onClick?: () => void };

export function Brand({ light = false, onClick }: BrandProps) {
  return (
    <Link className={`brand${light ? " brand--light" : ""}`} to="/" onClick={onClick} aria-label="AeroGo Travel & Tours home">
      <span className="brand__name">AEROGO</span>
      <span className="brand__sub">TRAVEL &amp; TOURS</span>
    </Link>
  );
}
