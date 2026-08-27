import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";
import { Gallery } from "@/presentation/components/ui/Gallery";
import { buttonVariants } from "@/presentation/components/ui/Button";
import { instagramPosts, contact } from "@/domain/content/site";

export function Instagram() {
  return (
    <section id="galeria" className="bg-carbon py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <Heading variant="heading-xl">Do Império para o seu feed.</Heading>
          <a
            href={`https://instagram.com/${contact.instagramHandle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Ver"
            className={buttonVariants({ variant: "secondary", size: "sm" })}
          >
            Seguir no Instagram
          </a>
        </div>
        <Badge className="mb-8">{contact.instagramHandle}</Badge>
        <Gallery items={instagramPosts.map(({ id, image, alt, href }) => ({ id, src: image, alt, href }))} />
      </Container>
    </section>
  );
}
