import { Link } from "react-router-dom";
import "./EditorialBreadcrumb.css";

export type EditorialBreadcrumbItem = {
  label: string;
  to?: string;
};

export function EditorialBreadcrumb({ items }: { items: EditorialBreadcrumbItem[] }) {
  return <nav className="editorial-breadcrumb" aria-label="Breadcrumb">
    <ol>{items.map((item, index) => <li key={`${item.label}-${index}`} aria-current={index === items.length - 1 ? "page" : undefined}>
      {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
    </li>)}</ol>
  </nav>;
}
