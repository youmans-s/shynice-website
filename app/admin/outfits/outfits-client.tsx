'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'private-images'
const SIGNED_URL_SECONDS = 60 * 60 * 24

type WishlistItem = {
  id: string
  title: string
  category: string | null
  url: string | null
  image_path: string | null
  price_cents: number | null
}

type Outfit = {
  id: string
  title: string
  occasion: string | null
  collage_path: string | null
  total_price_cents: number | null
  created_at: string
}

function safeFilename(name: string) {
  return name.replace(/\s+/g, '-')
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

async function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load an image for collage.'))
    img.src = url
  })
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height)
  const drawW = img.width * scale
  const drawH = img.height * scale
  const dx = x + (w - drawW) / 2
  const dy = y + (h - drawH) / 2
  ctx.drawImage(img, dx, dy, drawW, drawH)
}

async function generateCollageBlob(urls: string[]) {
  const n = urls.length
  if (n === 0) throw new Error('No images selected.')

  // Square-ish grid
  const cols = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / cols)

  const cell = 520

  const canvas = document.createElement('canvas')
  canvas.width = cols * cell
  canvas.height = rows * cell

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported.')

  // White background (no gray blocks)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const images = await Promise.all(urls.map(loadImage))

  images.forEach((img, i) => {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = c * cell
    const y = r * cell
    drawCover(ctx, img, x, y, cell, cell) // cover fill, edge-to-edge
  })

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (!b) reject(new Error('Failed to export collage.'))
      else resolve(b)
    }, 'image/png')
  })

  return blob
}

export default function OutfitsClient() {
  const supabase = useMemo(() => createClient(), [])

  const [creatorOpen, setCreatorOpen] = useState(false)

  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [wishlistUrls, setWishlistUrls] = useState<Record<string, string>>({})
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [outfitUrls, setOutfitUrls] = useState<Record<string, string>>({})
  const [computedTotals, setComputedTotals] = useState<Record<string, number>>({})

  const [title, setTitle] = useState('')
  const [occasion, setOccasion] = useState('')
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function loadAll() {
    setLoading(true)
    setErrorMsg(null)

    // Wishlist (include price)
    const { data: w, error: wErr } = await supabase
      .from('wishlist_items')
      .select('id,title,category,url,image_path,price_cents')
      .order('created_at', { ascending: false })

    if (wErr) {
      setErrorMsg(wErr.message)
      setLoading(false)
      return
    }

    const wRows = (w as WishlistItem[]) ?? []
    setWishlist(wRows)

    const wMap: Record<string, string> = {}
    await Promise.all(
      wRows.map(async (item) => {
        if (!item.image_path) return
        const { data: signed, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(item.image_path, SIGNED_URL_SECONDS)
        if (!signedErr && signed?.signedUrl) wMap[item.id] = signed.signedUrl
      })
    )
    setWishlistUrls(wMap)

    // Outfits (include stored total)
    const { data: o, error: oErr } = await supabase
      .from('outfits')
      .select('id,title,occasion,collage_path,total_price_cents,created_at')
      .order('created_at', { ascending: false })

    if (oErr) {
      setErrorMsg(oErr.message)
      setLoading(false)
      return
    }

    const oRows = (o as Outfit[]) ?? []
    setOutfits(oRows)

    const oMap: Record<string, string> = {}
    await Promise.all(
      oRows.map(async (fit) => {
        if (!fit.collage_path) return
        const { data: signed, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(fit.collage_path, SIGNED_URL_SECONDS)
        if (!signedErr && signed?.signedUrl) oMap[fit.id] = signed.signedUrl
      })
    )
    setOutfitUrls(oMap)

    // Fallback compute totals for old outfits where total is null
    const missing = oRows.filter((x) => x.total_price_cents == null).map((x) => x.id)
    const totals: Record<string, number> = {}

    if (missing.length > 0) {
      const { data: itemRows } = await supabase
        .from('outfit_items')
        .select('outfit_id, wishlist_items(price_cents)')
        .in('outfit_id', missing)

      ;((itemRows as any[]) ?? []).forEach((row) => {
        const outfitId = row.outfit_id as string
        const price = row.wishlist_items?.price_cents ?? 0
        totals[outfitId] = (totals[outfitId] ?? 0) + price
      })
    }

    setComputedTotals(totals)
    setLoading(false)
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleSelect(id: string) {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const selectedItems = wishlist.filter((w) => selectedIds[w.id])
  const selectedTotalCents = selectedItems.reduce((sum, w) => sum + (w.price_cents ?? 0), 0)
  const missingPriceCount = selectedItems.filter((w) => w.price_cents == null).length

  async function saveOutfit() {
    setErrorMsg(null)

    const selected = Object.entries(selectedIds)
      .filter(([, v]) => v)
      .map(([k]) => k)

    if (!title.trim()) return setErrorMsg('Outfit name is required.')
    if (selected.length === 0) return setErrorMsg('Select at least one wishlist item.')

    const urls = selected.map((id) => wishlistUrls[id]).filter(Boolean)
    if (urls.length === 0) return setErrorMsg('Selected items must have images to generate a collage.')

    setSaving(true)

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) {
      setSaving(false)
      return setErrorMsg(userErr.message)
    }
    const user = userRes.user
    if (!user) {
      setSaving(false)
      return setErrorMsg('Not signed in.')
    }

    try {
      const blob = await generateCollageBlob(urls)
      const file = new File([blob], `${safeFilename(title)}.png`, { type: 'image/png' })

      const path = `${user.id}/outfits/${crypto.randomUUID()}-${safeFilename(file.name)}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: true,
      })
      if (upErr) throw upErr

      const { data: outfit, error: insErr } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          title: title.trim(),
          occasion: occasion.trim() ? occasion.trim() : null,
          collage_path: path,
          total_price_cents: selectedTotalCents,
        })
        .select('id')
        .single()

      if (insErr || !outfit) throw insErr ?? new Error('Failed to create outfit.')

      const rows = selected.map((wishId) => ({
        user_id: user.id,
        outfit_id: outfit.id,
        wishlist_item_id: wishId,
      }))

      const { error: itemsErr } = await supabase.from('outfit_items').insert(rows)
      if (itemsErr) throw itemsErr

      // reset
      setTitle('')
      setOccasion('')
      setSelectedIds({})
      setCreatorOpen(false)

      await loadAll()
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to save outfit.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="group flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Outfits</h1>
          <p className="text-neutral-700">Create collages from wishlist items.</p>
        </div>

        <button
          type="button"
          onClick={() => setCreatorOpen((v) => !v)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          {creatorOpen ? 'Close' : '➕ Add'}
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Creator (hidden until Add pressed) */}
      {creatorOpen && (
        <div className="rounded-2xl border p-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2"
              placeholder="Outfit name (ex: Club night out)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="rounded-md border px-3 py-2"
              placeholder="Occasion (optional)"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Picker */}
            <div className="rounded-xl border p-3">
              <div className="font-medium">Pick items</div>
              <p className="text-sm text-neutral-600">Only items with images can be collaged.</p>

              <div className="mt-3 max-h-[420px] overflow-auto space-y-2">
                {wishlist.map((w) => {
                  const img = w.image_path ? wishlistUrls[w.id] : null
                  const checked = !!selectedIds[w.id]
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => toggleSelect(w.id)}
                      className="w-full rounded-lg border p-2 text-left hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        {img ? (
                          <img src={img} alt="" className="h-14 w-14 rounded-md object-cover" />
                        ) : (
                          <div className="h-14 w-14 rounded-md bg-neutral-100" />
                        )}

                        <div className="flex-1">
                          <div className="font-medium">{w.title}</div>
                          <div className="text-xs text-neutral-600">
                            {w.category ?? 'Uncategorized'} •{' '}
                            {w.price_cents != null ? formatCents(w.price_cents) : 'No price'}
                          </div>
                        </div>

                        <input type="checkbox" checked={checked} readOnly />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview - edge-to-edge */}
            <div className="rounded-xl border p-3 space-y-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-medium">Preview</div>
                  <div className="text-sm text-neutral-600">
                    Total: <span className="font-semibold">{formatCents(selectedTotalCents)}</span>
                    {missingPriceCount > 0 ? (
                      <span className="ml-2 text-xs text-neutral-500">
                        ({missingPriceCount} item(s) missing price)
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl">
                <div className="grid grid-cols-2 gap-0">
                  {selectedItems
                    .map((w) => wishlistUrls[w.id])
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((u) => (
                      <img key={u} src={u} alt="" className="h-52 w-full object-cover" />
                    ))}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={saveOutfit}
            disabled={saving}
            className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50 disabled:opacity-50"
          >
            {saving ? 'Saving…' : `Generate & Save Outfit (${formatCents(selectedTotalCents)})`}
          </button>
        </div>
      )}

      {/* Saved outfits */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Saved outfits</h2>

        {loading ? (
          <p className="text-neutral-600">Loading…</p>
        ) : outfits.length === 0 ? (
          <p className="text-neutral-600">No outfits yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outfits.map((o) => {
              const img = outfitUrls[o.id]
              const total = o.total_price_cents ?? computedTotals[o.id] ?? 0

              return (
                <Link
                  key={o.id}
                  href={`/admin/outfits/${o.id}`}
                  className="rounded-2xl border p-3 hover:bg-neutral-50 transition"
                >
                  <div className="overflow-hidden rounded-xl">
                    {img ? (
                      <img src={img} alt="" className="h-56 w-full object-cover" />
                    ) : (
                      <div className="h-56 w-full bg-neutral-100" />
                    )}
                  </div>

                  <div className="mt-3 font-semibold">{o.title}</div>
                  <div className="text-sm text-neutral-600">
                    {o.occasion ? `${o.occasion} • ` : ''}Total: {formatCents(total)}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}