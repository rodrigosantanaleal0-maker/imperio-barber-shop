import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/infrastructure/styling/cn";

interface ContainerProps<T extends ElementType = "div"> {
  as?: T;
  className?: string;
  children: React.ReactNode;
}

export function Container<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn("mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16", className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
