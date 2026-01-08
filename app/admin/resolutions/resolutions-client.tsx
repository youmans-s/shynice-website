'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Resolution = {
  id: string
  user_id: string
  title: string
  timeframe: 'short' | 'long'
  due_date: string | null
  done: boolean
  created_at: string
}

type ResolutionEdit = {
  title: string
  timeframe: 'short' | 'long'
  due_date: string
  done: boolean
}

export default function ResolutionsClient() {
  const supabase = useMemo(() => createClient(), [])
  const [items, setItems] = useState<Resolution[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // New item form
  const [title, setTitle] = useState('')
  const [timeframe, setTimeframe] = useState<'short' | 'long'>('short')
  const [dueDate, setDueDate] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<ResolutionEdit | null>(null)

  async function load() {
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase
      .from('resolutions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setErrorMsg(error.message)
    setItems((data as Resolution[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    const { error } = await supabase.from('resolutions').insert({
      user_id: user.id,
      title,
      timeframe,
      due_date: dueDate || null,
    })

    if (error) return setErrorMsg(error.message)

    setTitle('')
    setTimeframe('short')
    setDueDate('')
    await load()
  }

  async function toggleDone(item: Resolution) {
    setErrorMsg(null)
    const { error } = await supabase
      .from('resolutions')
      .update({ done: !item.done })
      .eq('id', item.id)

    if (error) return setErrorMsg(error.message)
    await load()
  }

  async function removeItem(id: string) {
    setErrorMsg(null)
    const { error } = await supabase.from('resolutions').delete().eq('id', id)
    if (error) return setErrorMsg(error.message)
    await load()
  }

  function startEdit(item: Resolution) {
    setEditingId(item.id)
    setEdit({
      title: item.title,
      timeframe: item.timeframe,
      due_date: item.due_date ?? '',
      done: item.done,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEdit(null)
  }

  async function saveEdit(item: Resolution) {
    if (!editingId || !edit) return
    setErrorMsg(null)

    const { error } = await supabase
      .from('resolutions')
      .update({
        title: edit.title,
        timeframe: edit.timeframe,
        due_date: edit.due_date || null,
        done: edit.done,
      })
      .eq('id', item.id)

    if (error) return setErrorMsg(error.message)

    cancelEdit()
    await load()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addItem} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
        <input
          className="rounded-md border px-3 py-2 sm:col-span-2"
          placeholder="Goal (e.g., Finish interview prep)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="rounded-md border px-3 py-2"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as 'short' | 'long')}
        >
          <option value="short">Short-term</option>
          <option value="long">Long-term</option>
        </select>

        <input
          className="rounded-md border px-3 py-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
        />

        <div className="sm:col-span-2 flex items-center gap-3">
          <button className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50" type="submit">
            Add
          </button>
          <button className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" type="button" onClick={load}>
            Refresh
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-600">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No goals yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isEditing = editingId === item.id
            return (
              <div key={item.id} className="rounded-xl border p-4">
                {isEditing && edit ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className="rounded-md border px-3 py-2 sm:col-span-2"
                      value={edit.title}
                      onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                    />

                    <select
                      className="rounded-md border px-3 py-2"
                      value={edit.timeframe}
                      onChange={(e) => setEdit({ ...edit, timeframe: e.target.value as 'short' | 'long' })}
                    >
                      <option value="short">Short-term</option>
                      <option value="long">Long-term</option>
                    </select>

                    <input
                      className="rounded-md border px-3 py-2"
                      type="date"
                      value={edit.due_date}
                      onChange={(e) => setEdit({ ...edit, due_date: e.target.value })}
                    />

                    <label className="flex items-center gap-2 text-sm sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={edit.done}
                        onChange={(e) => setEdit({ ...edit, done: e.target.checked })}
                      />
                      Done
                    </label>

                    <div className="flex gap-2 sm:col-span-2">
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleDone(item)} className="text-sm underline" type="button">
                          {item.done ? '✅ Done' : '⬜ Not yet'}
                        </button>
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <div className="mt-1 text-sm text-neutral-600">
                        {item.timeframe === 'short' ? 'Short-term' : 'Long-term'}
                        {item.due_date ? ` • Due: ${item.due_date}` : ''}
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
                        onClick={() => removeItem(item.id)}
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
      )}
    </div>
  )
}
