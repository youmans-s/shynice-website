'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

type Debt = {
  id: string
  title: string
  kind: string | null
  balance_cents: number
  minimum_payment_cents: number
  due_date: string | null
  include_in_totals: boolean
  created_at: string
}

type EditState = {
  title: string
  kind: string
  balance: string
  minPay: string
  dueDate: string
  include: boolean
}

function dollarsToCents(input: string) {
  const cleaned = input.replace(/[^0-9.]/g, '')
  if (!cleaned) return NaN
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n < 0) return NaN
  return Math.round(n * 100)
}

function formatCents(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function daysUntil(dateStr: string) {
  const today = new Date()
  const d = new Date(dateStr + 'T00:00:00')
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  return Math.floor((d.getTime() - startToday) / (1000 * 60 * 60 * 24))
}

export default function DebtsClient() {
  const supabase = useMemo(() => createClient(), [])

  const [rows, setRows] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Add form (toggle)
  const [addOpen, setAddOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('')
  const [balance, setBalance] = useState('')
  const [minPay, setMinPay] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [include, setInclude] = useState(true)

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<EditState | null>(null)

  async function load() {
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase.from('debts').select('*')

    if (error) {
      setErrorMsg(error.message)
      setRows([])
      setLoading(false)
      return
    }

    const r = ((data as Debt[]) ?? []).slice()

    // Sort: due soon first, null due last
    r.sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return a.due_date.localeCompare(b.due_date)
    })

    setRows(r)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function addDebt(e: FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    const bal = dollarsToCents(balance)
    const min = dollarsToCents(minPay)
    if (Number.isNaN(bal)) return setErrorMsg('Balance must be a valid number.')
    if (Number.isNaN(min)) return setErrorMsg('Minimum payment must be a valid number.')

    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr) return setErrorMsg(userErr.message)
    const user = userRes.user
    if (!user) return setErrorMsg('Not signed in.')

    const { error } = await supabase.from('debts').insert({
      user_id: user.id,
      title: title.trim(),
      kind: kind.trim() ? kind.trim() : null,
      balance_cents: bal,
      minimum_payment_cents: min,
      due_date: dueDate || null,
      include_in_totals: include,
    })

    if (error) return setErrorMsg(error.message)

    setTitle('')
    setKind('')
    setBalance('')
    setMinPay('')
    setDueDate('')
    setInclude(true)
    setAddOpen(false)

    await load()
  }

  function startEdit(d: Debt) {
    setEditingId(d.id)
    setEdit({
      title: d.title,
      kind: d.kind ?? '',
      balance: String(d.balance_cents / 100),
      minPay: String(d.minimum_payment_cents / 100),
      dueDate: d.due_date ?? '',
      include: d.include_in_totals,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEdit(null)
  }

  async function saveEdit(d: Debt) {
    if (!edit) return
    setErrorMsg(null)

    const bal = dollarsToCents(edit.balance)
    const min = dollarsToCents(edit.minPay)
    if (Number.isNaN(bal)) return setErrorMsg('Balance must be a valid number.')
    if (Number.isNaN(min)) return setErrorMsg('Minimum payment must be a valid number.')

    const { error } = await supabase
      .from('debts')
      .update({
        title: edit.title.trim(),
        kind: edit.kind.trim() ? edit.kind.trim() : null,
        balance_cents: bal,
        minimum_payment_cents: min,
        due_date: edit.dueDate || null,
        include_in_totals: edit.include,
      })
      .eq('id', d.id)

    if (error) return setErrorMsg(error.message)

    cancelEdit()
    await load()
  }

  async function deleteDebt(id: string) {
    setErrorMsg(null)
    const { error } = await supabase.from('debts').delete().eq('id', id)
    if (error) return setErrorMsg(error.message)
    await load()
  }

  async function toggleInclude(d: Debt) {
    setErrorMsg(null)
    const { error } = await supabase
      .from('debts')
      .update({ include_in_totals: !d.include_in_totals })
      .eq('id', d.id)

    if (error) return setErrorMsg(error.message)
    await load()
  }

  const totalAll = rows.reduce((sum, r) => sum + r.balance_cents, 0)
  const totalIncluded = rows.filter((r) => r.include_in_totals).reduce((sum, r) => sum + r.balance_cents, 0)
  const totalExcluded = totalAll - totalIncluded

  return (
    <div className="space-y-6">
      <div className="group flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Debt</h1>
          <p className="text-neutral-700">Track balances, minimum payments, and due dates.</p>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen((v) => !v)}
          className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
        >
          {addOpen ? 'Close' : '➕ Add'}
        </button>
      </div>

      {/* Totals */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border p-4">
          <div className="text-sm text-neutral-600">Total debt</div>
          <div className="text-2xl font-semibold">{formatCents(totalAll)}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-neutral-600">Included ✅</div>
          <div className="text-2xl font-semibold">{formatCents(totalIncluded)}</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="text-sm text-neutral-600">Excluded ⛔️</div>
          <div className="text-2xl font-semibold">{formatCents(totalExcluded)}</div>
        </div>
      </div>

      {/* Add form */}
      {addOpen && (
        <form onSubmit={addDebt} className="rounded-2xl border p-4 grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-md border px-3 py-2 sm:col-span-2"
            placeholder="Debt name (Capital One, Student Loan…)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="rounded-md border px-3 py-2"
            placeholder="Type (credit card, loan, medical…)"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={include} onChange={(e) => setInclude(e.target.checked)} />
            Include in totals
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
            <input
              className="w-full rounded-md border py-2 pl-7 pr-3"
              placeholder="Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
            <input
              className="w-full rounded-md border py-2 pl-7 pr-3"
              placeholder="Minimum payment"
              value={minPay}
              onChange={(e) => setMinPay(e.target.value)}
              required
            />
          </div>

          <input className="rounded-md border px-3 py-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <button className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50 sm:col-span-2" type="submit">
            Add debt
          </button>
        </form>
      )}

      {errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-neutral-600">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-neutral-600">No debts yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((d) => {
            const dueSoon = d.due_date ? daysUntil(d.due_date) : null
            const overdue = dueSoon != null && dueSoon < 0
            const soon = dueSoon != null && dueSoon >= 0 && dueSoon <= 7
            const isEditing = editingId === d.id

            return (
              <div
                key={d.id}
                className={[
                  'rounded-2xl border p-4',
                  overdue ? 'border-red-300 bg-red-50' : soon ? 'border-amber-300 bg-amber-50' : '',
                  !d.include_in_totals ? 'opacity-80' : '',
                ].join(' ')}
              >
                {isEditing && edit ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold">Edit debt</div>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className="rounded-md border px-3 py-2 sm:col-span-2"
                        value={edit.title}
                        onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                      />

                      <input
                        className="rounded-md border px-3 py-2"
                        value={edit.kind}
                        onChange={(e) => setEdit({ ...edit, kind: e.target.value })}
                        placeholder="Type"
                      />

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={edit.include}
                          onChange={(e) => setEdit({ ...edit, include: e.target.checked })}
                        />
                        Include in totals
                      </label>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                        <input
                          className="w-full rounded-md border py-2 pl-7 pr-3"
                          value={edit.balance}
                          onChange={(e) => setEdit({ ...edit, balance: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                        <input
                          className="w-full rounded-md border py-2 pl-7 pr-3"
                          value={edit.minPay}
                          onChange={(e) => setEdit({ ...edit, minPay: e.target.value })}
                        />
                      </div>

                      <input
                        className="rounded-md border px-3 py-2"
                        type="date"
                        value={edit.dueDate}
                        onChange={(e) => setEdit({ ...edit, dueDate: e.target.value })}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => saveEdit(d)}
                      className="rounded-md border px-4 py-2 font-medium hover:bg-white"
                    >
                      Save changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-semibold text-lg">{d.title}</div>
                        <div className="text-sm text-neutral-700">
                          {d.kind ?? '—'}
                          {d.due_date ? ` • Due: ${d.due_date}` : ' • No due date'}
                        </div>
                      </div>

                      {/* ✅ Buttons you asked for */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleInclude(d)}
                          className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                        >
                          {d.include_in_totals ? 'Included ✅' : 'Excluded ⛔️'}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEdit(d)}
                          className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteDebt(d.id)}
                          className="rounded-md border px-3 py-2 text-sm hover:bg-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl border bg-white/60 p-3">
                        <div className="text-xs text-neutral-600">Balance</div>
                        <div className="font-semibold">{formatCents(d.balance_cents)}</div>
                      </div>

                      <div className="rounded-xl border bg-white/60 p-3">
                        <div className="text-xs text-neutral-600">Minimum</div>
                        <div className="font-semibold">{formatCents(d.minimum_payment_cents)}</div>
                      </div>

                      <div className="rounded-xl border bg-white/60 p-3">
                        <div className="text-xs text-neutral-600">Due</div>
                        <div className="font-semibold">{d.due_date ?? '—'}</div>
                      </div>

                      <div className="rounded-xl border bg-white/60 p-3">
                        <div className="text-xs text-neutral-600">Included</div>
                        <div className="font-semibold">{d.include_in_totals ? 'Yes' : 'No'}</div>
                      </div>
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
