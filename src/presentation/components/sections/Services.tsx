import { Section } from "@/presentation/components/ui/Section";
import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";
import { ServiceCard } from "@/presentation/components/ui/ServiceCard";
import { services } from "@/domain/content/site";

export function Services() {
  return (
    <Section id="servicos" bg="obsidian">
      <Container>
        <div className="mb-16 max-w-2xl">
          <Badge>O que oferecemos</Badge>
          <Heading variant="heading-xl" className="mt-4">
            Precisão em cada detalhe.
          </Heading>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
