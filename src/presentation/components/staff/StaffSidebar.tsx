"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/application/auth/actions";
import { Button } from "@/presentation/components/ui/Button";

interface StaffSidebarProps {
  name: string;
  links: { label: string; href: string }[];
}

export function StaffSidebar({ name, links }: StaffSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-full border-b border-smoke bg-carbon md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-6 py-6">
        <div>
          <p className="font-display text-heading-m text-ivory">IMPERIO</p>
          <p className="text-label tracking-[0.3em] text-gold">Barber Shop</p>
        </div>
        <button
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="focus-ring p-2 text-ivory md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div
        className={`${open ? "flex" : "hidden"} flex-col gap-8 px-6 pb-6 md:flex md:flex-1 md:px-6 md:pb-6`}
      >
        <p className="text-body-s text-ivory/70">{name}</p>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-l-2 border-transparent px-3 py-2 text-body-s text-ivory/70 transition-colors hover:border-gold hover:text-ivory"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
