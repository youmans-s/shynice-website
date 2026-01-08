export default function Footer() {
  return (
    <footer className="border-t py-6 text-sm text-neutral-600">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Shynice</p>
        <p className="text-neutral-500">Built with Next.js + Supabase</p>
      </div>
    </footer>
  )
}
