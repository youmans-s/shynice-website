'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type CareerGoal = {
  id: string
  user_id: string
  title: string
  timeframe: 'short' | 'long'
  due_date: string | null
  done: boolean
  created_at: string
}

export default function CareerClient() {
  const supabase = useMemo(() => createClient(), [])
  const [items, setItems] = useState<CareerGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [timeframe, setTimeframe] = useState<'short' | 'long'>('short')
  const [dueDate, setDueDate] = useState('')

  async function load() {
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setErrorMsg(error.message)
    setItems((data as CareerGoal[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addGoal(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    const { error } = await supabase.from('career_goals').insert({
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

  async function toggleDone(item: CareerGoal) {
    setErrorMsg(null)
    const { error } = await supabase.from('career_goals').update({ done: !item.done }).eq('id', item.id)
    if (error) return setErrorMsg(error.message)
    await load()
  }

  async function removeItem(id: string) {
    setErrorMsg(null)
    const { error } = await supabase.from('career_goals').delete().eq('id', id)
    if (error) return setErrorMsg(error.message)
    await load()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addGoal} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
        <input
          className="rounded-md border px-3 py-2 sm:col-span-2"
          placeholder="Career goal (e.g., Land SWE role, AWS cert…) "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select className="rounded-md border px-3 py-2" value={timeframe} onChange={(e) => setTimeframe(e.target.value as any)}>
          <option value="short">Short-term</option>
          <option value="long">Long-term</option>
        </select>

        <input className="rounded-md border px-3 py-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <button className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50 sm:col-span-2" type="submit">
          Add career goal
        </button>
      </form>

      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</div>
      )}

      {loading ? (
        <p className="text-neutral-600">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No career goals yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <button type="button" className="text-sm underline" onClick={() => toggleDone(item)}>
                    {item.done ? '✅ Done' : '⬜ Not yet'}
                  </button>
                  <span className="font-semibold">{item.title}</span>
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {item.timeframe === 'short' ? 'Short-term' : 'Long-term'}
                  {item.due_date ? ` • Due: ${item.due_date}` : ''}
                </div>
              </div>

              <button type="button" onClick={() => removeItem(item.id)} className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
