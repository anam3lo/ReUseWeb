'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'
import Header from '@/components/Header'
import Chatbot from '@/components/Chatbot'
import ProductImage from '@/components/ProductImage'
import { PRODUCT_CATEGORIES, getCategoryStyle } from '@/lib/categories'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronLeft,
  Image as ImageIcon,
  Link2,
  Trash2,
  Upload,
} from 'lucide-react'

const categories = PRODUCT_CATEGORIES

type ImageSource = 'file' | 'url'

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [imageSource, setImageSource] = useState<ImageSource>('file')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    imageFile: null as File | null
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-5xl py-10" aria-busy="true" aria-label="Carregando">
          <Skeleton className="mb-3 h-12 w-80 max-w-full" />
          <Skeleton className="mb-8 h-5 w-96 max-w-full" />
          <Skeleton className="h-[520px] w-full rounded-4xl" />
        </main>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: ''
      }))

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      imageFile: null
    }))
    setImagePreview(url || null)
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null, imageUrl: '' }))
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validações
    if (!formData.title.trim()) {
      setError('Título é obrigatório')
      setIsLoading(false)
      return
    }

    if (!formData.category) {
      setError('Categoria é obrigatória')
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)

      if (formData.imageFile) {
        formDataToSend.append('imageFile', formData.imageFile)
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl)
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSuccess('Produto criado com sucesso!')
        setTimeout(() => {
          router.push('/products')
        }, 1500)
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao criar produto')
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const { icon: CategoryIcon } = getCategoryStyle(formData.category)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/products"
              className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Voltar aos Produtos
            </Link>
            <h1 className="animate-fade-up text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Anunciar Produto</h1>
            <p className="animate-fade-up text-base text-muted-foreground sm:text-lg" style={{ animationDelay: '60ms' }}>
              Compartilhe seus itens para reutilização e ajude o meio ambiente
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsChatbotOpen(true)}>
            <Bot className="h-4 w-4" aria-hidden="true" />
            Assistente
          </Button>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <form onSubmit={handleSubmit} className="flex animate-fade-up flex-col gap-5" style={{ animationDelay: '120ms' }}>
            {success && (
              <div role="status" className="flex animate-slide-down items-center gap-3 rounded-2xl border border-primary/20 bg-mint px-4 py-3 text-sm font-medium text-primary">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                {success}
              </div>
            )}

            {error && (
              <div role="alert" className="flex animate-slide-down items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Passo 1 — Sobre o item */}
            <section className="space-y-6 rounded-4xl border bg-card p-5 sm:p-7">
              <StepTitle number={1}>Informações do Produto</StepTitle>

              {/* Título */}
              <div className="space-y-2.5">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: iPhone 12 em ótimo estado"
                  maxLength={120}
                  required
                />
              </div>

              {/* Categoria */}
              <fieldset className="space-y-3">
                <legend className="mb-3 text-sm font-semibold">Categoria *</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {categories.map((category) => {
                    const { icon: Icon } = getCategoryStyle(category)
                    const selected = formData.category === category
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        aria-pressed={selected}
                        className={cn(
                          'flex h-12 items-center gap-2 rounded-xl border px-3 text-left text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-smooth active:scale-[0.97]',
                          selected
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border bg-card text-foreground hover:border-primary hover:bg-mint'
                        )}
                      >
                        <Icon className={cn('h-4 w-4 shrink-0', selected ? 'text-accent' : 'text-primary')} aria-hidden="true" />
                        <span className="truncate">{category}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Descrição */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Descrição</Label>
                  <span className="text-xs text-muted-foreground">Opcional</span>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva o produto, seu estado, acessórios incluídos, etc."
                  rows={5}
                />
              </div>
            </section>

            {/* Passo 2 — Imagem */}
            <section className="space-y-5 rounded-4xl border bg-card p-5 sm:p-7">
              <StepTitle number={2}>Imagem do Produto</StepTitle>

              <div role="tablist" aria-label="Origem da imagem" className="inline-flex rounded-full bg-secondary p-1">
                <SourceTab active={imageSource === 'file'} onClick={() => setImageSource('file')} icon={Upload}>
                  Upload de Arquivo
                </SourceTab>
                <SourceTab active={imageSource === 'url'} onClick={() => setImageSource('url')} icon={Link2}>
                  Usar URL
                </SourceTab>
              </div>

              {imagePreview ? (
                <div className="flex animate-scale-in flex-wrap items-center gap-4 rounded-2xl border bg-background p-3">
                  <div className="h-28 w-28 overflow-hidden rounded-xl border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-semibold">Imagem selecionada</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formData.imageFile?.name ?? formData.imageUrl}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage} className="text-destructive">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Remover
                  </Button>
                </div>
              ) : null}

              {imageSource === 'file' ? (
                <label
                  htmlFor="imageFile"
                  className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-input bg-background px-5 py-10 text-center transition-colors duration-200 hover:border-primary hover:bg-mint/60 focus-within:border-primary"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint transition-transform duration-300 ease-smooth group-hover:-translate-y-1">
                    <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-semibold">Clique para escolher uma foto</span>
                  <span className="text-[13px] text-muted-foreground">JPG, PNG ou WEBP</span>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="animate-fade-in space-y-2.5">
                  <Label htmlFor="imageUrl" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    URL da Imagem
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              )}
            </section>

            {/* Botões */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/products')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || Boolean(success)}
                className="sm:min-w-[220px]"
              >
                {isLoading ? (
                  <>
                    <Spinner label="Criando produto" />
                    Criando Produto...
                  </>
                ) : (
                  <>
                    Anunciar Produto
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Prévia do anúncio */}
          <aside className="animate-fade-up space-y-3 lg:sticky lg:top-24" style={{ animationDelay: '200ms' }} aria-label="Prévia do anúncio">
            <p className="eyebrow text-muted-foreground">Prévia do anúncio</p>
            <div className="rounded-3xl border bg-card p-2.5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProductImage src={null} alt="Prévia" category={formData.category || null} />
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                  <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {formData.category || 'Categoria'}
                </span>
              </div>
              <div className="space-y-1.5 px-2 pb-2 pt-4">
                <p className={cn('line-clamp-2 font-display text-lg font-semibold', !formData.title && 'text-muted-foreground')}>
                  {formData.title || 'Título do seu produto'}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {formData.description || 'A descrição aparece aqui.'}
                </p>
                <p className="pt-1 text-xs text-muted-foreground">Por {session?.user?.name} · agora</p>
              </div>
            </div>
            <p className="px-1 text-[13px] leading-relaxed text-muted-foreground">
              Fotos claras e uma descrição honesta do estado do item ajudam a encontrar alguém mais rápido.
            </p>
          </aside>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  )
}

function StepTitle({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-accent">
        {number}
      </span>
      <h2 className="text-xl font-semibold">{children}</h2>
    </div>
  )
}

function SourceTab({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Upload
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-[background-color,box-shadow,color] duration-200',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  )
}
