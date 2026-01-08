'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageDropzone from '@/components/ImageDropzone'

const BUCKET = 'private-images'
const SIGNED_URL_SECONDS = 60 * 60 * 24 // 24h

type WishlistItem = {
  id: string
  user_id: string
  title: string
  url: string | null
  category: string | null
  purchased: boolean
  image_path: string | null
  price_cents: number | null
  created_at: string
}

type EditState = {
  title: string
  url: string
  category: string
  price: string
  purchased: boolean
  imageFile: File | null
}

function safeFilename(name: string) {
  return name.replace(/\s+/g, '-')
}

function categoryKey(category: string | null) {
  const c = (category ?? '').trim()
  return c.length ? c : 'Uncategorized'
}

function dollarsToCents(input: string) {
  // accepts "123.45" or "$123.45"
  const cleaned = input.replace(/[^0-9.]/g, '')
  if (!cleaned) return NaN
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n < 0) return NaN
  return Math.round(n * 100)
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function slugifyId(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}


export default function WishlistClient() {
  const supabase = useMemo(() => createClient(), [])

  const [items, setItems] = useState<WishlistItem[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Add form
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [formOpen, setFormOpen] = useState(false)


  // Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<EditState | null>(null)

  async function uploadImage(userId: string, folder: string, file: File) {
    const path = `${userId}/${folder}/${crypto.randomUUID()}-${safeFilename(file.name)}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: true,
    })
    if (error) throw error
    return path
  }

  async function load() {
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
      setItems([])
      setImageUrls({})
      setLoading(false)
      return
    }

    const rows = (data as WishlistItem[]) ?? []
    setItems(rows)

    // signed image urls
    const urlMap: Record<string, string> = {}
    await Promise.all(
      rows.map(async (item) => {
        if (!item.image_path) return
        const { data: signed, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(item.image_path, SIGNED_URL_SECONDS)

        if (!signedErr && signed?.signedUrl) urlMap[item.id] = signed.signedUrl
      })
    )
    setImageUrls(urlMap)

    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const cents = dollarsToCents(price)
    if (Number.isNaN(cents)) return setErrorMsg('Price must be a valid number (ex: 120 or 120.50).')

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    try {
      let image_path: string | null = null
      if (newImageFile) {
        image_path = await uploadImage(user.id, 'wishlist', newImageFile)
      }

      const { error } = await supabase.from('wishlist_items').insert({
        user_id: user.id,
        title,
        url: url.trim() ? url.trim() : null,
        category: category.trim() ? category.trim() : null,
        price_cents: cents,
        image_path,
      })

      if (error) return setErrorMsg(error.message)

      setTitle('')
      setUrl('')
      setCategory('')
      setPrice('')
      setNewImageFile(null)
      setFormOpen(false)

      await load()
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Upload failed.')
    }
  }

  async function togglePurchased(item: WishlistItem) {
    setErrorMsg(null)
    const { error } = await supabase
      .from('wishlist_items')
      .update({ purchased: !item.purchased })
      .eq('id', item.id)

    if (error) return setErrorMsg(error.message)
    await load()
  }

  async function removeItem(item: WishlistItem) {
    setErrorMsg(null)

    const { error } = await supabase.from('wishlist_items').delete().eq('id', item.id)
    if (error) return setErrorMsg(error.message)

    if (item.image_path) {
      await supabase.storage.from(BUCKET).remove([item.image_path])
    }

    await load()
  }

  function startEdit(item: WishlistItem) {
    setEditingId(item.id)
    setEdit({
      title: item.title,
      url: item.url ?? '',
      category: item.category ?? '',
      price: item.price_cents != null ? String(item.price_cents / 100) : '',
      purchased: item.purchased,
      imageFile: null,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEdit(null)
  }

  async function saveEdit(item: WishlistItem) {
    if (!editingId || !edit) return
    setErrorMsg(null)

    const cents = dollarsToCents(edit.price)
    if (Number.isNaN(cents)) return setErrorMsg('Price must be a valid number (ex: 120 or 120.50).')

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    try {
      let image_path: string | null = item.image_path ?? null

      if (edit.imageFile) {
        const newPath = await uploadImage(user.id, 'wishlist', edit.imageFile)
        image_path = newPath
        if (item.image_path) await supabase.storage.from(BUCKET).remove([item.image_path])
      }

      const { error } = await supabase
        .from('wishlist_items')
        .update({
          title: edit.title,
          url: edit.url.trim() ? edit.url.trim() : null,
          category: edit.category.trim() ? edit.category.trim() : null,
          price_cents: cents,
          purchased: edit.purchased,
          image_path,
        })
        .eq('id', item.id)

      if (error) return setErrorMsg(error.message)

      cancelEdit()
      await load()
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Save failed.')
    }
  }

  // Grouping + totals
  const grouped = items.reduce<Record<string, WishlistItem[]>>((acc, item) => {
    const key = categoryKey(item.category)
    acc[key] = acc[key] ?? []
    acc[key].push(item)
    return acc
  }, {})

  const categoryNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  const totalCents = items.reduce((sum, i) => sum + (i.price_cents ?? 0), 0)

  return (
  
    <div className="space-y-6">
      {/* Dashboard */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-neutral-600">Total items</div>
          <div className="text-2xl font-semibold">{items.length}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-neutral-600">Total value</div>
          <div className="text-2xl font-semibold">{formatCents(totalCents)}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-neutral-600">Categories</div>
          <div className="text-2xl font-semibold">{categoryNames.length}</div>
        </div>
      </div>

            {/* Add item */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-600">Add new items to your wishlist.</div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            {formOpen ? 'Close' : '➕ Add'}
          </button>

          <button
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            type="button"
            onClick={load}
          >
            Refresh
          </button>
        </div>
      </div>

            {/* Category list */}
      {categoryNames.length > 0 && (
        <div className="rounded-xl border p-4">
          <div className="text-sm text-neutral-600 mb-2">Categories</div>

          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => {
              const catItems = grouped[cat]
              const catTotal = catItems.reduce((sum, i) => sum + (i.price_cents ?? 0), 0)

              return (
                <a
                  key={cat}
                  href={`#cat-${slugifyId(cat)}`}
                  className="rounded-full border px-3 py-1 text-sm hover:bg-neutral-50"
                >
                  {cat} ({catItems.length}) • {formatCents(catTotal)}
                </a>
              )
            })}
          </div>
        </div>
      )}


      {formOpen && (
        <form onSubmit={addItem} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
          <input
            className="rounded-md border px-3 py-2"
            placeholder="Item name (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="rounded-md border px-3 py-2"
            placeholder="Category (fashion, living room, tech...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              $
            </span>
            <input
              className="w-full rounded-md border py-2 pl-7 pr-3"
              placeholder="Price (required)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="decimal"
              required
            />
          </div>

          <input
            className="rounded-md border px-3 py-2"
            placeholder="Link (optional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="sm:col-span-2">
            <ImageDropzone label="Photo (optional)" file={newImageFile} onFile={setNewImageFile} />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <button className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50" type="submit">
              Add
            </button>

            <button
              className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50"
              type="button"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}


      {/* Grouped list */}
      {loading ? (
        <p className="text-neutral-600">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No wishlist items yet.</p>
      ) : (
        <div className="space-y-8">
          {categoryNames.map((cat) => {
            const catItems = grouped[cat]
            const catTotal = catItems.reduce((sum, i) => sum + (i.price_cents ?? 0), 0)

            return (
              <section id={`cat-${slugifyId(cat)}`} key={cat} className="space-y-3 scroll-mt-24">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-xl font-semibold">{cat}</h2>
                  <div className="text-sm text-neutral-600">
                    {catItems.length} items • Total: {formatCents(catTotal)}
                  </div>
                </div>

                <div className="space-y-3">
                  {catItems.map((item) => {
                    const isEditing = editingId === item.id

                    return (
                      <div key={item.id} className="rounded-xl border p-4">
                        {isEditing && edit ? (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              className="rounded-md border px-3 py-2"
                              value={edit.title}
                              onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                              placeholder="Title"
                            />
                            <input
                              className="rounded-md border px-3 py-2"
                              value={edit.category}
                              onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                              placeholder="Category"
                            />

                            <div className="relative">
                              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                $
                              </span>
                              <input
                                className="w-full rounded-md border py-2 pl-7 pr-3"
                                value={edit.price}
                                onChange={(e) => setEdit({ ...edit, price: e.target.value })}
                                placeholder="Price"
                                required
                              />
                            </div>

                            <input
                              className="rounded-md border px-3 py-2"
                              value={edit.url}
                              onChange={(e) => setEdit({ ...edit, url: e.target.value })}
                              placeholder="URL"
                            />

                            <label className="flex items-center gap-2 text-sm sm:col-span-2">
                              <input
                                type="checkbox"
                                checked={edit.purchased}
                                onChange={(e) => setEdit({ ...edit, purchased: e.target.checked })}
                              />
                              Purchased
                            </label>

                            <div className="sm:col-span-2">
                              <ImageDropzone
                                label="Replace photo (optional)"
                                file={edit.imageFile}
                                onFile={(f) => setEdit({ ...edit, imageFile: f })}
                              />
                            </div>

                            <div className="sm:col-span-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => saveEdit(item)}
                                className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-md border px-4 py-2 hover:bg-neutral-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex gap-3">
                              {imageUrls[item.id] ? (
                                <img
                                  src={imageUrls[item.id]}
                                  alt=""
                                  className="h-20 w-20 rounded-lg border object-cover"
                                />
                              ) : (
                                <div className="h-20 w-20 rounded-lg border bg-neutral-50" />
                              )}

                              <div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => togglePurchased(item)}
                                    className="text-sm underline"
                                    type="button"
                                  >
                                    {item.purchased ? '✅ Purchased' : '⬜ Not yet'}
                                  </button>
                                  <span className="font-semibold">{item.title}</span>
                                </div>

                                <div className="mt-1 text-sm text-neutral-600">
                                  {item.price_cents != null ? formatCents(item.price_cents) : 'Set price'}
                                </div>

                                {item.url && (
                                  <a className="mt-1 block text-sm hover:underline" href={item.url} target="_blank" rel="noreferrer">
                                    Link
                                  </a>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(item)}
                                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeItem(item)}
                                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}