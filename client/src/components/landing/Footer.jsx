import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <h2 className="text-lg font-semibold text-text">CollabAI</h2>
          <p className="mt-2 max-w-sm text-sm text-secondary">
            A modern collaboration platform for clients, freelancers, and agencies.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              <li><button type="button" onClick={() => navigate('/')} className="hover:text-text">Home</button></li>
              <li><button type="button" onClick={() => navigate('/login')} className="hover:text-text">Login</button></li>
              <li><button type="button" onClick={() => navigate('/register')} className="hover:text-text">Register</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Social</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              <li>GitHub</li>
              <li>LinkedIn</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-text">Contact</h3>
            <p className="mt-3 text-sm text-secondary">hello@collabai.com</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-sm text-secondary sm:px-6 lg:px-8">
        © 2026 CollabAI. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
