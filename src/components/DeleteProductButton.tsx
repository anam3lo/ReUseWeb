'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface DeleteProductButtonProps {
  productId: string
  productTitle: string
  /** "button" = botão com texto; "icon" = só o ícone (listas) */
  variant?: 'button' | 'icon'
  /** Para onde ir depois de excluir. Sem valor, só atualiza a página atual. */
  redirectTo?: string
  className?: string
}

/** Botão de excluir anúncio, com janela de confirmação. */
export default function DeleteProductButton({
  productId,
  productTitle,
  variant = 'button',
  redirectTo,
  className,
}: DeleteProductButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Foco no "Cancelar" ao abrir e fechar com Esc
  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, isDeleting])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Não foi possível excluir o produto.')
        setIsDeleting(false)
        return
      }

      setOpen(false)
      if (redirectTo) {
        router.push(redirectTo)
      }
      router.refresh()
    } catch (err) {
      console.error('Erro ao excluir produto:', err)
      setError('Ocorreu um erro. Tente novamente.')
      setIsDeleting(false)
    }
  }

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Excluir ${productTitle}`}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
            className
          )}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setOpen(true)}
          className={cn('border-destructive/30 text-destructive hover:border-destructive hover:bg-destructive/10', className)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Excluir anúncio
        </Button>
      )}

      {open && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setOpen(false)
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${productId}`}
            aria-describedby={`delete-desc-${productId}`}
            className="w-full max-w-md animate-slide-up rounded-t-4xl border bg-card p-6 shadow-float sm:animate-scale-in sm:rounded-4xl sm:p-7"
          >
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
            </span>
            <h2 id={`delete-title-${productId}`} className="text-2xl font-bold tracking-tight">
              Excluir este anúncio?
            </h2>
            <p id={`delete-desc-${productId}`} className="mt-2 leading-relaxed text-muted-foreground">
              <strong className="text-foreground">{productTitle}</strong> será removido da plataforma, junto com as
              conversas sobre ele. Essa ação não pode ser desfeita.
            </p>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                ref={cancelRef}
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button type="button" variant="destructive" size="lg" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? <Spinner label="Excluindo" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
