import { BookingCTA } from "@/presentation/components/ui/BookingCTA";
import { Heading } from "@/presentation/components/ui/Heading";

export function FinalCta() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-obsidian px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(201,162,39,0.12),transparent_60%)]"
      />
      <div className="relative">
        <Heading variant="display-l">
          Seu próximo visual
          <br />
          <span className="text-champagne">começa aqui.</span>
        </Heading>
        <div className="mt-12 flex justify-center">
          <BookingCTA size="lg" className="px-14 py-6 text-body-m">
            Agendar horário
          </BookingCTA>
        </div>
      </div>
    </section>
  );
}
