"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/alerts", label: "Alerts", icon: "⚡", badge: 2 },
  { href: "/campaigns", label: "Campaigns", icon: "◈" },
];

function ItmLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="10" fill="#253545" />
      <text
        x="46" y="66"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontSize="58"
        fontWeight="900"
        fill="#ffffff"
      >
        T
      </text>
      <circle cx="68" cy="76" r="6" fill="#ffffff" />
    </svg>
  );
}

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-[#2a2a2a] flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2.5 mb-3">
          <ItmLogo size={30} />
          <div>
            <p className="text-white font-bold text-[11px] tracking-widest uppercase leading-tight">It's Today</p>
            <p className="text-[#4dd0c4] font-semibold text-[9px] tracking-widest uppercase">Media</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-0.5">
          <span className="text-white font-semibold text-sm tracking-tight">AdPulse</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#4dd0c4]/10 text-[#4dd0c4] border border-[#4dd0c4]/20 font-bold tracking-wider">BETA</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon, badge }) => (
          <Link
            key={href} href={href}
            className={clsx(
              "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors font-medium",
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
              <span className="text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ background: "#2d3a4a" }}>
            JC
          </div>
          <div>
            <p className="text-xs text-white font-semibold">Jordi C.</p>
            <p className="text-[11px] text-[#555]">2 accounts connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
