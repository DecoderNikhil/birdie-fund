import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background xl:flex">
      <DashboardSidebar />
      <main className="flex-1 px-4 py-24 sm:px-6 xl:px-10">{children}</main>
    </div>
  )
}
