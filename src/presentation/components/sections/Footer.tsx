import Link from "next/link";
import { navLinks, contact } from "@/domain/content/site";
import { Container } from "@/presentation/components/ui/Container";
import { Divider } from "@/presentation/components/ui/Divider";

export function Footer() {
  return (
    <footer className="bg-obsidian pt-16 pb-10">
      <Container>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-heading-m text-ivory">
              IMPERIO
              <span className="block text-label tracking-[0.3em] text-gold">Barber Shop</span>
            </p>
            <p className="mt-4 max-w-[32ch] text-body-s text-muted">
              Seu estilo. Sua presença. Seu Império.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-label text-ivory/70 uppercase">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ivory">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-body-s text-muted">
            <p>{contact.address}</p>
            <p className="mt-2">{contact.phoneDisplay}</p>
          </div>
        </div>
        <Divider className="my-10" />
        <p className="text-caption text-muted">
          © {new Date().getFullYear()} Império Barber Shop. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
