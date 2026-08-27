"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Container } from "@/presentation/components/ui/Container";
import { BookingCTA } from "@/presentation/components/ui/BookingCTA";
import { MobileMenu } from "@/presentation/components/ui/MobileMenu";
import { useScrolled } from "@/application/hooks/useScrolled";
import { navLinks } from "@/domain/content/site";
import { cn } from "@/infrastructure/styling/cn";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(40);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-(--z-index-nav) transition-colors duration-500 ease-cinematic",
        scrolled ? "border-b border-smoke bg-obsidian/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="#top" className="font-display text-heading-m leading-none text-ivory">
          IMPERIO
          <span className="block text-label tracking-[0.3em] text-gold">Barber Shop</span>
        </Link>

        <nav className="hidden items-center gap-9 text-label text-ivory/70 uppercase lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="Explorar"
              className="transition-colors duration-300 hover:text-ivory"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <BookingCTA size="sm" className="hidden sm:inline-flex">
            Agendar
          </BookingCTA>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            className="focus-ring p-2 text-ivory lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </Container>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={navLinks} />
    </header>
  );
}
