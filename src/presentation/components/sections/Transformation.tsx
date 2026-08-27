"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/presentation/components/ui/Container";
import { Badge } from "@/presentation/components/ui/Badge";
import { Heading } from "@/presentation/components/ui/Heading";

const BEFORE = "/images/placeholder/portrait.svg";
const AFTER = "/images/placeholder/scene.svg";

export function Transformation() {
  const [value, setValue] = useState(50);

  return (
    <section className="bg-carbon py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="justify-center">A transformação</Badge>
          <Heading variant="heading-xl" className="mt-4">
            Não é apenas um corte.
          </Heading>
          <p className="mt-4 text-body-l text-ivory/70">
            É a diferença entre sair igual e sair se sentindo diferente.
          </p>
        </div>

        <div className="relative mx-auto mt-14 aspect-[4/5] max-w-xl overflow-hidden border border-smoke sm:aspect-[16/10] sm:max-w-4xl">
          <Image
            src={AFTER}
            alt="Resultado depois do corte"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          >
            <Image
              src={BEFORE}
              alt="Antes do corte"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-gold"
            style={{ left: `${value}%` }}
          />
          <div className="pointer-events-none absolute top-4 left-4 text-label text-ivory/80 uppercase">
            Antes
          </div>
          <div className="pointer-events-none absolute top-4 right-4 text-label text-ivory/80 uppercase">
            Depois
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            aria-label="Arraste para comparar antes e depois"
            className="focus-ring absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-obsidian/80 text-gold"
            style={{ left: `${value}%` }}
          >
            ↔
          </div>
        </div>
      </Container>
    </section>
  );
}
