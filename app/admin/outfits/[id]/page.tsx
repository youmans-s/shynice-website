'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'private-images'
const SIGNED_URL_SECONDS = 60 * 60 * 24 // 24h

type WishlistItemRow = {
  id: string
  title: string
  category: string | null
  url: string | null
  image_path: string | null
  price_cents: number | null
}

type OutfitItemRowDb = {
  id: string
  // IMPORTANT: some relationships come back as an array
  wishlist_items: WishlistItemRow | WishlistItemRow[] | null
}

type UiOutfitItem = {
  id: string
  item: WishlistItemRow
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function OutfitDetailsPage() {
  const supabase = useMemo(() => createClient(), [])
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const rawId = params?.id
  const outfitId = Array.isArray(rawId) ? rawId[0] : rawId

  const [outfitTitle, setOutfitTitle] = useState<string>('Outfit')
  const [items, setItems] = useState<UiOutfitItem[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!outfitId) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setErrorMsg(null)

      // 1) Load outfit row (safe: select('*') so schema differences won't break)
      const { data: outfitData, error: outfitErr } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', outfitId)
        .single()

      if (outfitErr) {
        if (!cancelled) {
          setErrorMsg(outfitErr.message)
          setLoading(false)
        }
        return
      }

      const title = (outfitData as any)?.title ?? (outfitData as any)?.name ?? 'Outfit'
      if (!cancelled) setOutfitTitle(String(title))

      // 2) Load outfit items joined to wishlist_items
      const { data: rows, error } = await supabase
        .from('outfit_items')
        .select(
          `
          id,
          wishlist_items (
            id,
            title,
            category,
            url,
            image_path,
            price_cents
          )
        `
        )
        .eq('outfit_id', outfitId)

      if (error) {
        if (!cancelled) {
          setErrorMsg(error.message)
          setItems([])
          setImageUrls({})
          setLoading(false)
        }
        return
      }

      // ✅ Normalize wishlist_items: object OR array -> single object
      const normalized: UiOutfitItem[] = ((rows ?? []) as OutfitItemRowDb[])
        .map((r) => {
          const wi = r.wishlist_items
          const item = Array.isArray(wi) ? wi[0] ?? null : wi
          if (!item) return null
          return { id: r.id, item }
        })
        .filter((x): x is UiOutfitItem => Boolean(x))

      if (cancelled) return

      setItems(normalized)

      // 3) Signed URLs for images
      const map: Record<string, string> = {}
      await Promise.all(
        normalized.map(async (it) => {
          const path = it.item.image_path
          if (!path) return

          const { data: signed, error: signedErr } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(path, SIGNED_URL_SECONDS)

          if (!signedErr && signed?.signedUrl) {
            // Key by wishlist item id (stable)
            map[it.item.id] = signed.signedUrl
          }
        })
      )

      if (!cancelled) {
        setImageUrls(map)
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [outfitId, supabase])

  const totalCents = items.reduce((sum, it) => sum + (it.item.price_cents ?? 0), 0)

  if (!outfitId) {
    return (
      <div className="rounded-2xl border bg-white/70 p-4 text-sm text-neutral-700">
        Missing outfit id.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <button type="button" onClick={() => router.back()} className="text-sm text-neutral-700 hover:underline">
            ← Back
          </button>

          <h1 className="text-2xl font-semibold">{outfitTitle}</h1>

          <div className="text-sm text-neutral-700">
            {items.length} items • Total {formatCents(totalCents)}
          </div>
        </div>

        <Link
          href="/admin/outfits"
          className="rounded-md border bg-white/70 px-3 py-2 text-sm hover:bg-white"
        >
          All outfits
        </Link>
      </div>

      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>
      )}

      {loading ? (
        <p className="text-neutral-600">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border bg-white/70 p-4 text-neutral-700">No items found for this outfit.</div>
      ) : (
        <>
          {/* Collage: images touch each other (no gray borders) */}
          <div className="overflow-hidden rounded-3xl ring-1 ring-black/5">
            <div className="grid grid-cols-2 gap-0">
              {items.map((it) => {
                const src = imageUrls[it.item.id]
                return (
                  <div key={it.id} className="relative aspect-square bg-neutral-100">
                    {src ? (
                      <img src={src} alt={it.item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">No image</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Items list */}
          <div className="rounded-3xl border bg-white/70 p-4">
            <div className="mb-3 text-sm font-semibold text-neutral-900">Items</div>

            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex items-start justify-between gap-3 rounded-2xl border bg-white/60 p-3">
                  <div>
                    <div className="font-medium">{it.item.title}</div>
                    <div className="text-sm text-neutral-700">
                      {it.item.category ?? 'Uncategorized'}
                      {it.item.price_cents != null ? ` • ${formatCents(it.item.price_cents)}` : ''}
                    </div>

                    {it.item.url && (
                      <a href={it.item.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 hover:underline">
                        Open link
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
