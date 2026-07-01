"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/tools", label: "Overview", icon: "space_dashboard", exact: true },
  { href: "/tools/spray", label: "Spray Records", icon: "receipt_long" },
  { href: "/tools/agronomy", label: "Agronomy", icon: "forum" },
  { href: "/tools/fields", label: "Field Dashboard", icon: "satellite_alt" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function Brand() {
  return (
    <Link href="/tools" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cmd-accent text-cmd-on-accent">
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          eco
        </span>
      </span>
      <span className="font-display text-headline-md font-extrabold text-cmd-text">
        Ag<span className="text-cmd-accent">Tools</span>
      </span>
    </Link>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="command-theme min-h-screen bg-cmd-bg text-cmd-text font-body-md">
      <div className="mx-auto flex min-h-screen max-w-container-max">
        {/* Sidebar — md and up */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-cmd-line bg-cmd-surface/40 px-4 py-6 md:flex">
          <div className="px-2">
            <Brand />
          </div>
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-label-md transition-colors ${
                    active
                      ? "bg-cmd-surface2 text-cmd-accent"
                      : "text-cmd-muted hover:bg-cmd-surface hover:text-cmd-text"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${active ? "text-cmd-accent" : "text-cmd-muted group-hover:text-cmd-text"}`}
                    style={{ fontSize: 20 }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-cmd-line pt-4">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-cmd-line bg-cmd-surface2 px-2.5 py-1 font-mono text-label-sm text-cmd-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-cmd-amber" />
              Demo mode
            </span>
            <Link
              href="/"
              className="flex items-center gap-2 px-1 text-label-md text-cmd-muted transition-colors hover:text-cmd-accent"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_back
              </span>
              Back to site
            </Link>
          </div>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-40 border-b border-cmd-line bg-cmd-bg/90 backdrop-blur md:hidden">
            <div className="flex items-center justify-between px-margin-mobile py-3">
              <Brand />
              <Link
                href="/"
                className="text-label-md text-cmd-muted hover:text-cmd-accent"
              >
                ← Site
              </Link>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-margin-mobile pb-3">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-sm ${
                      active
                        ? "border-cmd-accent/40 bg-cmd-accent/10 text-cmd-accent"
                        : "border-cmd-line text-cmd-muted"
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <main className="flex-1 px-margin-mobile py-10 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
