"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNav } from "@payloadcms/ui";
import { LayoutDashboard, Users, Layers, Building2, BriefcaseBusiness, BookOpen, Mail, Image, Settings, LogOut } from "lucide-react";
import AdminLogo from "./AdminLogo";

export default function CMSNavClient({ collections, globals, name, role }: { collections: string[]; globals: string[]; name: string; role: string }) {
  const pathname = usePathname();
  const { navOpen, navRef, hydrated, shouldAnimate } = useNav();
  const groups = [
    { label: "Administrasi", items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, show: true },
      { label: "Pengguna", href: "/admin/collections/users", icon: Users, show: collections.includes("users") },
    ] },
    { label: "Konten Website", items: [
      { label: "Solusi", href: "/admin/collections/solutions", icon: Layers, show: collections.includes("solutions") },
      { label: "Partner", href: "/admin/collections/partners", icon: Building2, show: collections.includes("partners") },
      { label: "Proyek", href: "/admin/collections/projects", icon: BriefcaseBusiness, show: collections.includes("projects") },
      { label: "Insight", href: "/admin/collections/insights", icon: BookOpen, show: collections.includes("insights") },
      { label: "Konsultasi Masuk", href: "/admin/consultations", icon: Mail, show: role === "admin" },
    ] },
    { label: "Pustaka", items: [
      { label: "Media", href: "/admin/collections/media", icon: Image, show: collections.includes("media") },
    ] },
    { label: "Website", items: [
      { label: "Pengaturan website", href: "/admin/globals/site-settings", icon: Settings, show: globals.includes("site-settings") },
    ] },
  ];
  return <aside className={["nav", "scs-sidebar", navOpen && "nav--nav-open", hydrated && "nav--nav-hydrated", shouldAnimate && "nav--nav-animate"].filter(Boolean).join(" ")}>
    <Link href="/admin" className="scs-sidebar__brand" aria-label="Dashboard Sigma Core"><AdminLogo /></Link>
    <nav className="scs-sidebar__menus" ref={navRef} aria-label="Navigasi CMS">
      {groups.map(group => group.items.some(item => item.show) && <section key={group.label} className="scs-sidebar__group">
        <h2>{group.label}</h2>
        {group.items.filter(item => item.show).map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} aria-label={label} title={!navOpen ? label : undefined} className={active ? "scs-sidebar__link is-active" : "scs-sidebar__link"} aria-current={active ? "page" : undefined}><Icon size={19} aria-hidden="true" /><span>{label}</span>{active && <i aria-hidden="true" />}</Link>;
        })}
      </section>)}
    </nav>
    <div className="scs-sidebar__account">
      <Link href="/admin/account" aria-label={"Akun " + name} title={!navOpen ? name : undefined} className="scs-sidebar__profile"><span className="scs-sidebar__avatar">{name.trim().slice(0, 1).toUpperCase()}</span><span><strong>{name}</strong><small>{role === "admin" ? "Administrator" : "Editor"}</small></span></Link>
      <Link href="/admin/logout" aria-label="Keluar" className="scs-sidebar__logout"><LogOut size={19} /></Link>
    </div>
  </aside>;
}
