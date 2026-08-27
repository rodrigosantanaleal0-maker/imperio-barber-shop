import { ImageReveal } from "@/presentation/components/ui/ImageReveal";
import { cn } from "@/infrastructure/styling/cn";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  aspect?: "square" | "wide" | "tall";
  href?: string;
}

const ASPECT_CLASS: Record<NonNullable<GalleryItem["aspect"]>, string> = {
  square: "aspect-square",
  wide: "aspect-[16/10]",
  tall: "aspect-[4/5]",
};

export function Gallery({ items, className }: { items: GalleryItem[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {items.map((item) => {
        const media = (
          <ImageReveal
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            wrapperClassName={cn("group", ASPECT_CLASS[item.aspect ?? "square"])}
            imageClassName="transition-transform duration-700 ease-cinematic [@media(hover:hover)]:group-hover:scale-105"
          />
        );

        if (!item.href) return <div key={item.id}>{media}</div>;

        return (
          <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" data-cursor="Ver">
            {media}
          </a>
        );
      })}
    </div>
  );
}
