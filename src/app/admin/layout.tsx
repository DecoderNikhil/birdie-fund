import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen gradient-mesh">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}