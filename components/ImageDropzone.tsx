'use client'

import { useRef, useState } from 'react'

type Props = {
  label?: string
  file: File | null
  onFile: (file: File | null) => void
  accept?: string
  hint?: string
}

export default function ImageDropzone({
  label = 'Photo',
  file,
  onFile,
  accept = 'image/*',
  hint = 'Drag & drop or click to upload',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  function openPicker() {
    inputRef.current?.click()
  }

  function clearFile(e: React.MouseEvent) {
    e.stopPropagation()
    if (inputRef.current) inputRef.current.value = ''
    onFile(null)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <div
        className={[
          'cursor-pointer rounded-md border border-dashed p-4 text-sm transition',
          dragOver ? 'bg-neutral-50' : 'bg-white',
        ].join(' ')}
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openPicker()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const dropped = e.dataTransfer.files?.[0]
          if (dropped) {
            if (inputRef.current) inputRef.current.value = ''
            onFile(dropped)
          }
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium">{hint}</div>
            <div className="text-neutral-600">
              {file ? file.name : 'PNG, JPG, etc.'}
            </div>
          </div>

          {file ? (
            <button
              type="button"
              className="rounded-md border px-3 py-2 hover:bg-neutral-50"
              onClick={clearFile}
            >
              Remove
            </button>
          ) : null}
        </div>

        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept={accept}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  )
}
