import Link from "next/link";
import { signOutAction } from "@/application/auth/actions";
import { Button } from "@/presentation/components/ui/Button";

interface StaffSidebarProps {
  name: string;
  links: { label: string; href: string }[];
}

export function StaffSidebar({ name, links }: StaffSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-8 border-b border-smoke bg-carbon p-6 md:h-screen md:w-64 md:border-r md:border-b-0">
      <div>
        <p className="font-display text-heading-m text-ivory">IMPERIO</p>
        <p className="text-label tracking-[0.3em] text-gold">Barber Shop</p>
      </div>
      <p className="text-body-s text-ivory/70">{name}</p>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
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
    </aside>
  );
}
