'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'private-images'
const SIGNED_URL_SECONDS = 60 * 60 * 24

type Outfit = {
  id: string
  title: string
  occasion: string | null
  collage_path: string | null
  total_price_cents: number | null
}

type OutfitItemRow = {
  id: string
  wishlist_items: {
    id: string
    title: string
    category: string | null
    url: string | null
    image_path: string | null
    price_cents: number | null
  } | null
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function OutfitDetailsPage() {
  const supabase = useMemo(() => createClient(), [])
  const params = useParams() as { id?: string | string[] }
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [collageUrl, setCollageUrl] = useState<string | null>(null)
  const [items, setItems] = useState<OutfitItemRow[]>([])
  const [itemUrls, setItemUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function run() {
      if (!id) return
      setLoading(true)

      const { data: o } = await supabase
        .from('outfits')
        .select('id,title,occasion,collage_path,total_price_cents')
        .eq('id', id)
        .single()

      setOutfit((o as Outfit) ?? null)

      if (o?.collage_path) {
        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(o.collage_path, SIGNED_URL_SECONDS)
        setCollageUrl(signed?.signedUrl ?? null)
      } else {
        setCollageUrl(null)
      }

      const { data: rows } = await supabase
        .from('outfit_items')
        .select('id, wishlist_items (id,title,category,url,image_path,price_cents)')
        .eq('outfit_id', id)

      const r = (rows as OutfitItemRow[]) ?? []
      setItems(r)

      const map: Record<string, string> = {}
      await Promise.all(
        r.map(async (row) => {
          const w = row.wishlist_items
          if (!w?.image_path) return
          const { data: signed } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(w.image_path, SIGNED_URL_SECONDS)
          if (signed?.signedUrl) map[w.id] = signed.signedUrl
        })
      )
      setItemUrls(map)

      setLoading(false)
    }

    run()
  }, [id, supabase])

  if (loading) return <p className="text-neutral-600">Loading…</p>

  if (!outfit) {
    return (
      <div className="space-y-4">
        <Link className="text-sm hover:underline" href="/admin/outfits">
          ← Back
        </Link>
        <div className="rounded-xl border p-4">Outfit not found.</div>
      </div>
    )
  }

  const computedTotal = items.reduce((sum, row) => sum + (row.wishlist_items?.price_cents ?? 0), 0)
  const total = outfit.total_price_cents ?? computedTotal

  return (
    <div className="space-y-6">
      <Link className="text-sm hover:underline" href="/admin/outfits">
        ← Back
      </Link>

      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{outfit.title}</h1>
        <p className="text-neutral-700">
          {outfit.occasion ? `${outfit.occasion} • ` : ''}Total: <b>{formatCents(total)}</b>
        </p>
      </div>

      {/* Full collage, no gray borders */}
      <div className="overflow-hidden rounded-2xl">
        {collageUrl ? (
          <img src={collageUrl} alt="" className="w-full max-h-[80vh] object-contain bg-white" />
        ) : (
          <div className="h-[360px] bg-neutral-100" />
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Items</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((row) => {
            const w = row.wishlist_items
            if (!w) return null
            const img = itemUrls[w.id]

            return (
              <div key={row.id} className="rounded-2xl border p-3">
                <div className="overflow-hidden rounded-xl">
                  {img ? <img src={img} alt="" className="h-44 w-full object-cover" /> : <div className="h-44 bg-neutral-100" />}
                </div>

                <div className="mt-3 font-medium">{w.title}</div>
                <div className="text-sm text-neutral-600">
                  {w.category ?? 'Uncategorized'} • {w.price_cents != null ? formatCents(w.price_cents) : 'No price'}
                </div>

                {w.url ? (
                  <a className="mt-1 inline-block text-sm hover:underline" href={w.url} target="_blank" rel="noreferrer">
                    Link
                  </a>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
