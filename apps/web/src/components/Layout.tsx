import type { ReactNode } from 'react'
import type { RoutePath } from '../App'
import { AITutorWidget } from './AITutorWidget'
import { Navigation } from './Navigation'

type LayoutProps = {
  children: ReactNode
  currentRoute: RoutePath
  onNavigate: (route: RoutePath) => void
}

export function Layout({ children, currentRoute, onNavigate }: LayoutProps) {
  return (
    <div className="app-shell">
      <Navigation currentRoute={currentRoute} onNavigate={onNavigate} />
      <main>{children}</main>
      <AITutorWidget />
    </div>
  )
}
