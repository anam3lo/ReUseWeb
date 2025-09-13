import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Adicione lógica adicional aqui se necessário
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Proteger rotas que começam com /dashboard
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/products/:path*',
    '/messages/:path*'
  ]
}
