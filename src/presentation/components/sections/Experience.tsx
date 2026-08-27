import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";
import { ImageReveal } from "@/presentation/components/ui/ImageReveal";
import { experienceMedia } from "@/domain/content/site";

export function Experience() {
  const [wideA, wideB, tall, wideC] = experienceMedia;

  return (
    <section id="experiencia" className="bg-obsidian py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <Badge>O Ambiente</Badge>
            <Heading variant="heading-xl" className="mt-4">
              Uma experiência
              <br />
              feita para <span className="text-champagne">você.</span>
            </Heading>
          </div>
          <p className="max-w-[38ch] text-body-l text-ivory/70">
            Cadeira, espelho, navalha, café. Cada detalhe do espaço foi pensado para que a espera
            seja parte do ritual.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-[1.3fr_0.8fr]">
          <div className="flex flex-col gap-5">
            {[wideA, wideB].map((item) => (
              <div key={item.id} className="group relative aspect-[16/10] overflow-hidden">
                <ImageReveal
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="(min-width: 860px) 40vw, 100vw"
                  wrapperClassName="h-full w-full"
                  imageClassName="transition-transform duration-[1.4s] ease-cinematic [@media(hover:hover)]:group-hover:scale-105"
                />
                <span className="absolute bottom-[18px] left-[18px] z-10 text-caption text-ivory/70 uppercase">
                  {item.caption}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <div className="group relative aspect-[4/5] overflow-hidden">
              <ImageReveal
                src={tall.image}
                alt={tall.caption}
                fill
                sizes="(min-width: 860px) 40vw, 100vw"
                wrapperClassName="h-full w-full"
                imageClassName="transition-transform duration-[1.4s] ease-cinematic [@media(hover:hover)]:group-hover:scale-105"
              />
              <span className="absolute bottom-[18px] left-[18px] z-10 text-caption text-ivory/70 uppercase">
                {tall.caption}
              </span>
            </div>
            <div className="group relative aspect-[16/10] overflow-hidden">
              <ImageReveal
                src={wideC.image}
                alt={wideC.caption}
                fill
                sizes="(min-width: 860px) 40vw, 100vw"
                wrapperClassName="h-full w-full"
                imageClassName="transition-transform duration-[1.4s] ease-cinematic [@media(hover:hover)]:group-hover:scale-105"
              />
              <span className="absolute bottom-[18px] left-[18px] z-10 text-caption text-ivory/70 uppercase">
                {wideC.caption}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
