"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { BookingCTA } from "@/presentation/components/ui/BookingCTA";
import { useMounted } from "@/application/hooks/useMounted";
import type { NavLink } from "@/domain/types/site";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-(--z-index-overlay) flex flex-col bg-obsidian transition-transform duration-500 ease-cinematic lg:hidden ${
        open ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-end px-6 py-6">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fechar menu"
          className="focus-ring p-2 text-ivory"
        >
          <X className="size-6" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col items-center justify-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-display text-heading-l text-ivory transition-colors hover:text-gold"
          >
            {link.label}
          </Link>
        ))}
        <BookingCTA size="lg" className="mt-6">
          Agendar
        </BookingCTA>
      </nav>
    </div>,
    document.body,
  );
}
