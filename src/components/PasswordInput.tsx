'use client'

import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'

/** Campo de senha com botão para mostrar/ocultar o texto. */
export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  visible,
  onToggle,
}: {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: string
  visible: boolean
  onToggle: () => void
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-12"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  )
}
