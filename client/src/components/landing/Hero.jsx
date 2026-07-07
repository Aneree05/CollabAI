import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiCpu, FiLayers, FiShield } from 'react-icons/fi'

const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-secondary">
          <FiCpu className="mr-2" />
          AI-powered collaboration for modern teams
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
          AI-Powered Freelance Collaboration Platform
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary sm:text-xl">
          Connect clients, freelancers, and agencies in one collaborative workspace powered by AI project assistance.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Started
            <FiArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-text transition-colors hover:bg-background"
          >
            Login
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 inline-flex rounded-lg bg-blue-50 p-2 text-primary">
              <FiShield size={18} />
            </div>
            <h2 className="font-medium text-text">Secure Authentication</h2>
            <p className="mt-1 text-sm text-secondary">Protected sign-in for every collaborator.</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-3 inline-flex rounded-lg bg-blue-50 p-2 text-primary">
              <FiLayers size={18} />
            </div>
            <h2 className="font-medium text-text">Project Collaboration</h2>
            <p className="mt-1 text-sm text-secondary">Coordinate work with a shared workspace.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
