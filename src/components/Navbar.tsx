import { Link } from "@tanstack/react-router";
import { cn } from "@/utils/cn";

interface NavLink {
  to: "/" | "/setup" | "/history";
  label: string;
  exact?: boolean;
}

const LINKS: readonly NavLink[] = [
  { to: "/", label: "Início", exact: true },
  { to: "/setup", label: "Avaliar" },
  { to: "/history", label: "Histórico" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-navbar-border)] bg-[var(--color-navbar)]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link to="/" className="flex items-center gap-2 text-[var(--color-text-inverse)]">
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-sm bg-[var(--color-text-inverse)] font-mono text-[10px] font-bold text-[var(--color-accent)]"
          >
            DC
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight">DevCheck</span>
        </Link>
        <ul className="flex items-center gap-1">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.exact ?? false }}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-text-inverse)]/70 transition-colors hover:text-[var(--color-text-inverse)]",
                )}
                activeProps={{
                  className:
                    "rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--color-text-inverse)] bg-neutral-100",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
