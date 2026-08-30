"use client";

import { ReactNode, useState } from "react";
import Sidebar from "../../component/dashboard/Sidebar";
import Topbar from "../../component/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <main className="app-shell">
      <Sidebar mobileNav={mobileNav} setMobileNav={setMobileNav} />

      <section className="content-area">
        <Topbar onOpenMobileNav={() => setMobileNav(true)} />

        <div className="page-content">{children}</div>
      </section>
    </main>
  );
}
