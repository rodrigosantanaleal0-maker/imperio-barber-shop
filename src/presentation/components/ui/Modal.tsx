"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/infrastructure/styling/cn";

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ trigger, title, children, className }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-index-overlay) bg-obsidian/80 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-(--z-index-modal) w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 border border-smoke bg-graphite p-8 focus:outline-none",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="font-display text-heading-m text-ivory">{title}</Dialog.Title>
            <Dialog.Close aria-label="Fechar" className="focus-ring text-ivory/60 hover:text-ivory">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <div className="mt-6 text-body-m text-ivory/80">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
