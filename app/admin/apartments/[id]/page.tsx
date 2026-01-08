'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'private-images'
const SIGNED_URL_SECONDS = 60 * 60 * 24

type Apartment = {
  id: string
  name: string
  location: string | null
  rent: string | null
  url: string | null
  status: string | null
  rating: number | null
  image_path: string | null
}

type ApartmentNote = {
  id: string
  apartment_id: string
  note: string
  created_at: string
}

export default function ApartmentDetailsPage() {
  const supabase = useMemo(() => createClient(), [])
  const params = useParams() as { id?: string | string[] }
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [apt, setApt] = useState<Apartment | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState<ApartmentNote[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      if (!id) return
      setLoading(true)
      setErrorMsg(null)

      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setApt(null)
        setImageUrl(null)
        setNotes([])
        setErrorMsg(error?.message ?? 'Apartment not found (or not authorized).')
        setLoading(false)
        return
      }

      const row = data as Apartment
      setApt(row)

      if (row.image_path) {
        const { data: signed, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(row.image_path, SIGNED_URL_SECONDS)

        if (!signedErr && signed?.signedUrl) setImageUrl(signed.signedUrl)
        else setImageUrl(null)
      } else {
        setImageUrl(null)
      }

      const { data: noteRows } = await supabase
        .from('apartment_notes')
        .select('id, apartment_id, note, created_at')
        .eq('apartment_id', row.id)
        .order('created_at', { ascending: false })

      setNotes((noteRows as ApartmentNote[]) ?? [])

      setLoading(false)
    }

    run()
  }, [id, supabase])

  if (loading) return <p className="text-neutral-600">Loading…</p>

  if (!apt) {
    return (
      <div className="space-y-4">
        <Link className="text-sm hover:underline" href="/admin/apartments">
          ← Back
        </Link>

        <div className="rounded-xl border p-4">
          <div className="font-semibold">Couldn’t load apartment</div>
          <p className="mt-1 text-sm text-neutral-700">{errorMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link className="text-sm hover:underline" href="/admin/apartments">
          ← Back
        </Link>

        <div className="flex gap-2">
          {imageUrl && (
            <a
              className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              title="Open full image"
            >
              Open image
            </a>
          )}

          <Link
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
            href={`/admin/apartments?edit=${apt.id}`}
          >
            Edit (notes inside)
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* BIG image, NOT cropped */}
        <div className="lg:col-span-3 rounded-2xl border overflow-hidden bg-neutral-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-full max-h-[75vh] object-contain"
            />
          ) : (
            <div className="h-[420px] w-full" />
          )}
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">{apt.name}</h1>

            <p className="text-sm text-neutral-600">
              {[apt.location, apt.rent, apt.status].filter(Boolean).join(' • ')}
              {apt.rating ? ` • Rating: ${apt.rating}/10` : ''}
            </p>

            {apt.url ? (
              <a
                className="inline-flex rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                href={apt.url}
                target="_blank"
                rel="noreferrer"
              >
                Open listing link
              </a>
            ) : null}
          </div>

          <div className="rounded-2xl border p-4">
            <div className="font-semibold">Notes</div>
            {notes.length === 0 ? (
              <p className="mt-1 text-sm text-neutral-600">
                No notes yet. Click <b>Edit</b> to add notes.
              </p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-neutral-800">
                {notes.map((n) => (
                  <li key={n.id}>• {n.note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}