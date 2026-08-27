import { requireRole } from "@/infrastructure/auth/guards";
import { StaffSidebar } from "@/presentation/components/staff/StaffSidebar";

const LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Agenda", href: "/admin/agenda" },
  { label: "Relatórios", href: "/admin/relatorios" },
  { label: "Barbeiros", href: "/admin/barbeiros" },
  { label: "Serviços", href: "/admin/servicos" },
  { label: "Clientes", href: "/admin/clientes" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const profile = await requireRole("admin");

  return (
    <div className="flex min-h-screen flex-col bg-obsidian md:flex-row">
      <StaffSidebar name={profile.fullName} links={LINKS} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
