import type { RoutePath } from '../App'

const navItems: Array<{ label: string; route: RoutePath }> = [
  { label: 'Home', route: '/' },
  { label: 'Manifesto', route: '/manifesto' },
  { label: 'Methods & Lessons', route: '/methods-and-lessons' },
  { label: 'Knowledge', route: '/knowledge' },
  { label: 'Guided Learning Works', route: '/works' },
  { label: 'Archive of Sparks', route: '/works/archive-of-sparks' }
]

type NavigationProps = {
  currentRoute: RoutePath
  onNavigate: (route: RoutePath) => void
}

export function Navigation({ currentRoute, onNavigate }: NavigationProps) {
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => onNavigate('/')}>
        Be Knowledgeable
      </button>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item.route}
            type="button"
            className={currentRoute === item.route ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate(item.route)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
