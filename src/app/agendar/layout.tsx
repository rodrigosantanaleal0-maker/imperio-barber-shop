import { Navigation } from "@/presentation/components/ui/Navigation";
import { Footer } from "@/presentation/components/sections/Footer";

export default function AgendarLayout({ children }: LayoutProps<"/agendar">) {
  return (
    <>
      <Navigation />
      <main className="flex-1 bg-obsidian pt-28 pb-24">
        <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}
