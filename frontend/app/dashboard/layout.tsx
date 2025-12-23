import { cn, ContainerConfig } from "@/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-teal-50/30">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-100/40 to-cyan-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-stone-200/50 to-stone-100/30 rounded-full blur-3xl" />
      </div>
      
      {/* Main content */}
      <main className="relative z-10">
        <div className={cn(ContainerConfig.getContainerClasses(), "py-8 md:py-12")}>
          {children}
        </div>
      </main>
    </div>
  );
}

