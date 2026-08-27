"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  value: string;
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      className="divide-y divide-smoke border-t border-b border-smoke"
    >
      {items.map((item) => (
        <RadixAccordion.Item key={item.value} value={item.value}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="focus-ring group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-heading-m text-ivory">
              {item.question}
              <ChevronDown className="size-5 shrink-0 text-gold transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="pb-6 text-body-m text-ivory/70">
            {item.answer}
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
