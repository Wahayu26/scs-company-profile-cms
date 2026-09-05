"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { useAuth } from "@payloadcms/ui";

type CMSUser = { role?: string };

export default function ConsultationNavLink() {
  const { user } = useAuth<CMSUser>();
  if (user?.role !== "admin") return null;
  return <Link className="scs-consultation-nav" href="/admin/consultations"><Inbox size={18} aria-hidden="true" /><span>Konsultasi Masuk</span></Link>;
}
