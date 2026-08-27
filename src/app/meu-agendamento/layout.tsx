import { Navigation } from "@/presentation/components/ui/Navigation";
import { Footer } from "@/presentation/components/sections/Footer";

export default function MeuAgendamentoLayout({ children }: LayoutProps<"/meu-agendamento">) {
  return (
    <>
      <Navigation />
      <main className="flex-1 bg-obsidian pt-28 pb-24">
        <div className="mx-auto w-full max-w-2xl px-6 sm:px-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}
