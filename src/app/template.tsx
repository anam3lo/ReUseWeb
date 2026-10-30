/**
 * Transição suave entre páginas.
 * O App Router recria o template a cada navegação, então a animação
 * de entrada roda sempre que a rota muda (desligada com prefers-reduced-motion).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>
}
