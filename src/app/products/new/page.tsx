'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SignOutButton from '@/components/SignOutButton'
import Chatbot from '@/components/Chatbot'
import { ArrowLeft, Upload, Image as ImageIcon, MessageCircle } from 'lucide-react'

const categories = [
  'Eletrônicos',
  'Roupas',
  'Livros',
  'Móveis',
  'Casa e Jardim',
  'Esportes',
  'Brinquedos',
  'Outros'
]

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    imageFile: null as File | null
  })

  if (status === 'loading') {
    return <div>Carregando...</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/products" className="text-2xl font-bold text-green-600 hover:text-green-700">
                ReUse
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-gray-700">Olá, {session?.user?.name}</span>
              <Button 
                variant="outline" 
                onClick={() => setIsChatbotOpen(true)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Assistente
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar aos Produtos
                </Link>
              </Button>
              <SignOutButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Anunciar Produto</h1>
          <p className="text-gray-600 mt-2">
            Compartilhe seus itens para reutilização e ajude o meio ambiente
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
            <CardDescription>
              Preencha os dados do produto que você deseja anunciar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: iPhone 12 em ótimo estado"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva o produto, seu estado, acessórios incluídos, etc."
                  rows={4}
                />
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-4">
                <Label>Imagem do Produto</Label>
                
                {/* Preview da Imagem */}
                {imagePreview && (
                  <div className="aspect-square w-48 relative overflow-hidden rounded-lg border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Upload por Arquivo */}
                <div className="space-y-2">
                  <Label htmlFor="imageFile" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Upload de Arquivo
                  </Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="cursor-pointer"
                  />
                </div>

                {/* Ou URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Ou URL da Imagem
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
              </div>

              {/* Botões */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Criando Produto...' : 'Anunciar Produto'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/products')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  )
}
