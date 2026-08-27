import { requireRole } from "@/infrastructure/auth/guards";
import { StaffSidebar } from "@/presentation/components/staff/StaffSidebar";

const LINKS = [
  { label: "Dashboard", href: "/barbeiro" },
  { label: "Agenda", href: "/barbeiro/agenda" },
  { label: "Disponibilidade", href: "/barbeiro/disponibilidade" },
];

export default async function BarberLayout({ children }: LayoutProps<"/barbeiro">) {
  const profile = await requireRole("barber");

  return (
    <div className="flex min-h-screen flex-col bg-obsidian md:flex-row">
      <StaffSidebar name={profile.fullName} links={LINKS} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
