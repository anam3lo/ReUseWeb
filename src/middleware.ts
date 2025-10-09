import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Cache simples para evitar muitas chamadas à API
let maintenanceCache = {
  status: false,
  lastCheck: 0,
  ttl: 5000 // 5 segundos
}

export async function middleware(req: NextRequest) {
  console.log(`🔍 Middleware executando para: ${req.nextUrl.pathname}`)
  
  // Verificar se não é uma rota permitida
  const allowedPaths = [
    '/api/',
    '/maintenance',
    '/_next/',
    '/auth/signin',
    '/auth/signup',
    '/favicon.ico'
  ]
  
  const isAllowedPath = allowedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  
  console.log(`🛣️ Rota: ${req.nextUrl.pathname}`)
  console.log(`✅ É rota permitida: ${isAllowedPath}`)
  
  // Se é rota permitida, continuar normalmente
  if (isAllowedPath) {
    console.log(`✅ Rota permitida - continuando normalmente`)
    return NextResponse.next()
  }
  
  // Verificar cache
  const now = Date.now()
  const isCacheValid = (now - maintenanceCache.lastCheck) < maintenanceCache.ttl
  
  if (!isCacheValid) {
    try {
      // Verificar modo de manutenção via API
      const response = await fetch(`${req.nextUrl.origin}/api/maintenance`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000) // 2 segundos timeout
      })
      
      if (response.ok) {
        const config = await response.json()
        maintenanceCache = {
          status: config.maintenanceMode || false,
          lastCheck: now,
          ttl: 5000
        }
        console.log(`📊 Status atualizado: ${maintenanceCache.status}`)
      }
    } catch (error) {
      console.log(`⚠️ Erro ao verificar status, usando cache: ${error}`)
    }
  }
  
  // Se modo de manutenção está ativo, redirecionar
  if (maintenanceCache.status) {
    console.log(`🔧 Modo de manutenção ATIVO - REDIRECIONANDO para manutenção`)
    return NextResponse.redirect(new URL('/maintenance', req.url))
  }
  
  console.log(`🟢 Modo de manutenção INATIVO - Continuando normalmente`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - maintenance (maintenance page)
     * - auth/signin (sign in page)
     * - auth/signup (sign up page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance|auth/signin|auth/signup).*)',
  ]
}
