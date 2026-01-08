'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageDropzone from '@/components/ImageDropzone'

const BUCKET = 'private-images'
const SIGNED_URL_SECONDS = 60 * 60 * 24

type Apartment = {
  id: string
  user_id: string
  name: string
  location: string | null
  rent: string | null
  url: string | null
  status: string | null
  rating: number | null
  image_path: string | null
  created_at: string
}

type ApartmentNote = {
  id: string
  apartment_id: string
  user_id: string
  note: string
  created_at: string
}

type FormState = {
  name: string
  location: string
  rent: string
  url: string
  status: string
  rating: string
  imageFile: File | null
}

const emptyForm: FormState = {
  name: '',
  location: '',
  rent: '',
  url: '',
  status: 'considering',
  rating: '',
  imageFile: null,
}

function safeFilename(name: string) {
  return name.replace(/\s+/g, '-')
}

function parseRating(input: string): number | null {
  const t = input.trim()
  if (!t) return null
  const n = Number(t)
  if (!Number.isInteger(n) || n < 1 || n > 10) return NaN
  return n
}

export default function ApartmentsClient() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [items, setItems] = useState<Apartment[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [mode, setMode] = useState<'add' | 'edit'>('add')
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  // Notes only used in EDIT mode
  const [notes, setNotes] = useState<ApartmentNote[]>([])
  const [noteText, setNoteText] = useState('')

  async function uploadImage(userId: string, folder: string, file: File) {
    const path = `${userId}/${folder}/${crypto.randomUUID()}-${safeFilename(file.name)}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: true,
    })
    if (error) throw error
    return path
  }

  async function loadList() {
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase
      .from('apartments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
      setItems([])
      setImageUrls({})
      setLoading(false)
      return
    }

    const rows = (data as Apartment[]) ?? []
    setItems(rows)

    const urlMap: Record<string, string> = {}
    await Promise.all(
      rows.map(async (apt) => {
        if (!apt.image_path) return
        const { data: signed, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(apt.image_path, SIGNED_URL_SECONDS)
        if (!signedErr && signed?.signedUrl) urlMap[apt.id] = signed.signedUrl
      })
    )
    setImageUrls(urlMap)

    setLoading(false)
  }

  useEffect(() => {
    loadList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function openAdd() {
    setMode('add')
    setEditingApartment(null)
    setForm(emptyForm)
    setNotes([])
    setNoteText('')
    setFormOpen(true)
  }

  async function openEditById(id: string) {
    setErrorMsg(null)
    setMode('edit')
    setFormOpen(true)

    // Fetch the row (works even if it isn’t in the current list for some reason)
    const { data: apt, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !apt) {
      setErrorMsg(error?.message ?? 'Apartment not found.')
      return
    }

    const a = apt as Apartment
    setEditingApartment(a)
    setForm({
      name: a.name,
      location: a.location ?? '',
      rent: a.rent ?? '',
      url: a.url ?? '',
      status: a.status ?? 'considering',
      rating: a.rating != null ? String(a.rating) : '',
      imageFile: null,
    })

    // Load notes ONLY in edit mode
    const { data: noteRows, error: noteErr } = await supabase
      .from('apartment_notes')
      .select('*')
      .eq('apartment_id', a.id)
      .order('created_at', { ascending: false })

    if (noteErr) {
      setErrorMsg(noteErr.message)
      setNotes([])
    } else {
      setNotes((noteRows as ApartmentNote[]) ?? [])
    }
  }

  // If URL has ?edit=ID, open edit form at top
  useEffect(() => {
    if (!editId) return
    openEditById(editId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId])

  function closeForm() {
    setFormOpen(false)
    setMode('add')
    setEditingApartment(null)
    setForm(emptyForm)
    setNotes([])
    setNoteText('')
    if (editId) router.push('/admin/apartments')
  }

  async function saveForm(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const ratingValue = parseRating(form.rating)
    if (Number.isNaN(ratingValue)) {
      return setErrorMsg('Rating must be an integer from 1 to 10 (or leave blank).')
    }

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    try {
      if (mode === 'add') {
        let image_path: string | null = null
        if (form.imageFile) image_path = await uploadImage(user.id, 'apartments', form.imageFile)

        const { error } = await supabase.from('apartments').insert({
          user_id: user.id,
          name: form.name,
          location: form.location.trim() ? form.location.trim() : null,
          rent: form.rent.trim() ? form.rent.trim() : null,
          url: form.url.trim() ? form.url.trim() : null,
          status: form.status.trim() ? form.status.trim() : null,
          rating: ratingValue === null ? null : ratingValue,
          image_path,
        })

        if (error) return setErrorMsg(error.message)

        closeForm()
        await loadList()
        return
      }

      // EDIT
      if (!editingApartment) return setErrorMsg('No apartment selected for editing.')

      let image_path: string | null = editingApartment.image_path ?? null
      if (form.imageFile) {
        const newPath = await uploadImage(user.id, 'apartments', form.imageFile)
        image_path = newPath
        if (editingApartment.image_path) {
          await supabase.storage.from(BUCKET).remove([editingApartment.image_path])
        }
      }

      const { error } = await supabase
        .from('apartments')
        .update({
          name: form.name,
          location: form.location.trim() ? form.location.trim() : null,
          rent: form.rent.trim() ? form.rent.trim() : null,
          url: form.url.trim() ? form.url.trim() : null,
          status: form.status.trim() ? form.status.trim() : null,
          rating: ratingValue === null ? null : ratingValue,
          image_path,
        })
        .eq('id', editingApartment.id)

      if (error) return setErrorMsg(error.message)

      closeForm()
      await loadList()
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Save failed.')
    }
  }

  async function addNote() {
    if (mode !== 'edit' || !editingApartment) return
    const text = noteText.trim()
    if (!text) return

    setErrorMsg(null)

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    const { error } = await supabase.from('apartment_notes').insert({
      user_id: user.id,
      apartment_id: editingApartment.id,
      note: text,
    })

    if (error) return setErrorMsg(error.message)

    setNoteText('')

    const { data: noteRows } = await supabase
      .from('apartment_notes')
      .select('*')
      .eq('apartment_id', editingApartment.id)
      .order('created_at', { ascending: false })

    setNotes((noteRows as ApartmentNote[]) ?? [])
  }

  async function deleteNote(noteId: string) {
    if (mode !== 'edit' || !editingApartment) return
    setErrorMsg(null)

    const { error } = await supabase.from('apartment_notes').delete().eq('id', noteId)
    if (error) return setErrorMsg(error.message)

    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  return (
    <div className="space-y-6">
      {/* Header with hidden add button */}
      <div className="group flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Apartments</h1>
          <p className="text-neutral-700">Click a tile to view details.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!formOpen) openAdd()
            else closeForm()
          }}
          className={[
            'rounded-md border px-3 py-2 text-sm hover:bg-neutral-50',
            'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
          ].join(' ')}
          title={formOpen ? 'Close' : 'Add apartment'}
        >
          {formOpen ? 'Close' : '➕ Add'}
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Top form (hidden unless add/edit) */}
      {formOpen && (
        <form onSubmit={saveForm} className="rounded-2xl border p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold">
              {mode === 'add' ? 'Add apartment' : `Edit apartment: ${editingApartment?.name ?? ''}`}
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border px-3 py-2 sm:col-span-2"
              placeholder="Apartment name (required)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="rounded-md border px-3 py-2"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <input
              className="rounded-md border px-3 py-2"
              placeholder="Rent (e.g., $1850)"
              value={form.rent}
              onChange={(e) => setForm({ ...form, rent: e.target.value })}
            />

            <input
              className="rounded-md border px-3 py-2"
              placeholder="Rating (1–10)"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />

            <select
              className="rounded-md border px-3 py-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="considering">Considering</option>
              <option value="touring">Touring</option>
              <option value="applied">Applied</option>
              <option value="rejected">Rejected</option>
              <option value="chosen">Chosen</option>
            </select>

            <input
              className="rounded-md border px-3 py-2 sm:col-span-2"
              placeholder="Listing link"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />

            <div className="sm:col-span-2">
              <ImageDropzone
                label={mode === 'add' ? 'Photo (optional)' : 'Replace photo (optional)'}
                file={form.imageFile}
                onFile={(f) => setForm({ ...form, imageFile: f })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50" type="submit">
              {mode === 'add' ? 'Add' : 'Save'}
            </button>
          </div>

          {/* Notes ONLY in edit mode */}
          {mode === 'edit' && editingApartment && (
            <div className="rounded-xl border p-4 space-y-3">
              <div className="font-semibold">Notes</div>

              {notes.length === 0 ? (
                <p className="text-sm text-neutral-600">No notes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {notes.map((n) => (
                    <li key={n.id} className="flex items-start justify-between gap-3 text-sm">
                      <span>• {n.note}</span>
                      <button
                        type="button"
                        onClick={() => deleteNote(n.id)}
                        className="text-xs underline text-neutral-600"
                      >
                        delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                  placeholder="Add a note…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addNote}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                  title="Add note"
                >
                  ➕
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Grid of big tiles */}
      {loading ? (
        <p className="text-neutral-600">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No apartments yet. Hover the header and click “Add”.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((apt) => {
            const img = imageUrls[apt.id]
            return (
              <Link
                key={apt.id}
                href={`/admin/apartments/${apt.id}`}
                className="rounded-2xl border p-3 hover:bg-neutral-50 transition"
              >
                <div className="overflow-hidden rounded-xl border bg-neutral-50">
                  {img ? (
                    <img src={img} alt="" className="h-56 w-full object-cover" />
                  ) : (
                    <div className="h-56 w-full" />
                  )}
                </div>

                <div className="mt-3 font-semibold">{apt.name}</div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
