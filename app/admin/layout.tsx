import AdminNav from '@/components/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-8">
      <AdminNav />
      {children}
    </section>
  )
}
