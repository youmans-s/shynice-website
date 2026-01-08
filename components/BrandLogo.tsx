import Link from 'next/link'
import Image from 'next/image'

export default function BrandLogo() {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src="/logo.png"
        alt="Shynice logo"
        width={160}
        height={50}
        priority
        className="h-15 w-auto select-none"
      />
    </Link>
  )
}
