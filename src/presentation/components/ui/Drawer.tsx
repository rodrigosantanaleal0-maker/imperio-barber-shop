"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/infrastructure/styling/cn";

interface DrawerProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ trigger, title, children, className }: DrawerProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--z-index-overlay) bg-obsidian/80 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 right-0 z-(--z-index-modal) flex w-[min(92vw,26rem)] flex-col border-l border-smoke bg-graphite p-8 focus:outline-none",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="font-display text-heading-m text-ivory">{title}</Dialog.Title>
            <Dialog.Close aria-label="Fechar" className="focus-ring text-ivory/60 hover:text-ivory">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <div className="mt-6 flex-1 overflow-y-auto text-body-m text-ivory/80">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
