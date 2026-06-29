"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/alerts", label: "Alerts", icon: "⚡", badge: 2 },
  { href: "/campaigns", label: "Campaigns", icon: "◈" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-[#2a2a2a] flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-[#2a2a2a]">
        <span className="text-white font-semibold tracking-tight text-base">AdPulse</span>
        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-mono">BETA</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon, badge }) => (
          <Link
            key={href} href={href}
            className={clsx(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
              path === href
                ? "bg-white/[0.07] text-white"
                : "text-[#666] hover:text-[#ccc] hover:bg-white/[0.03]"
            )}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-[15px]">{icon}</span>
              {label}
            </span>
            {badge && (
              <span className="text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-medium">JC</div>
          <div>
            <p className="text-xs text-white font-medium">Jordi C.</p>
            <p className="text-[11px] text-[#555]">2 accounts connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
