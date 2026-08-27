import { MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";
import { buttonVariants } from "@/presentation/components/ui/Button";
import { contact } from "@/domain/content/site";

export function Location() {
  const mapQuery = encodeURIComponent(contact.address);

  return (
    <section id="localizacao" className="bg-obsidian py-24 sm:py-28 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge>Onde estamos</Badge>
          <Heading variant="heading-xl" className="mt-4">
            Encontre o Império.
          </Heading>
          <ul className="mt-8 space-y-5 text-body-m text-ivory/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-gold" />
              {contact.address}
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-1 size-5 shrink-0 text-gold" />
              {contact.phoneDisplay}
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-1 size-5 shrink-0 text-gold" />
              {contact.hours}
            </li>
          </ul>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg", className: "mt-10" })}
          >
            Como chegar
          </a>
        </div>
        <div className="aspect-[4/3] w-full overflow-hidden border border-smoke grayscale contrast-125 lg:aspect-square">
          <iframe
            title="Localização Império Barber Shop"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
