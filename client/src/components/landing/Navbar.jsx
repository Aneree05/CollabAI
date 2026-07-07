import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiMenu } from 'react-icons/fi'

const navItems = ['Home', 'Features', 'About']

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => navigate('/')} className="text-lg font-semibold text-text">
          CollabAI
        </button>

        <nav className="hidden items-center gap-6 text-sm text-secondary md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition-colors hover:text-text">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-background hover:text-text sm:block"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
            <FiArrowRight size={16} />
          </button>
          <button type="button" className="rounded-lg border border-border p-2 text-secondary md:hidden" aria-label="Open menu">
            <FiMenu size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
