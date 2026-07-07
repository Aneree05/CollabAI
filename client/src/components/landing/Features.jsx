import { FiMessageSquare, FiShare2, FiShield, FiZap, FiUsers, FiLayers } from 'react-icons/fi'

const features = [
  {
    icon: FiShield,
    title: 'Secure Authentication',
    description: 'Keep every workspace access point protected with reliable sign-in and account controls.',
  },
  {
    icon: FiUsers,
    title: 'Freelancer Marketplace',
    description: 'Discover and connect with the right professionals for every project need.',
  },
  {
    icon: FiLayers,
    title: 'Project Collaboration',
    description: 'Coordinate work, tasks, and progress in a clean shared environment.',
  },
  {
    icon: FiMessageSquare,
    title: 'Real-Time Chat',
    description: 'Keep communication simple and immediate for distributed teams.',
  },
  {
    icon: FiShare2,
    title: 'File Sharing',
    description: 'Share project files and assets directly without friction.',
  },
  {
    icon: FiZap,
    title: 'AI Project Assistant',
    description: 'Use AI support to keep projects moving with helpful recommendations.',
  },
]

const Features = () => (
  <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Features</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        Built for modern collaboration
      </h2>
      <p className="mt-4 text-lg text-secondary">
        A calm, focused workspace that helps clients, freelancers, and agencies stay aligned.
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <article key={feature.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-lg bg-background p-2 text-primary">
              <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-text">{feature.title}</h3>
            <p className="mt-2 text-sm leading-7 text-secondary">{feature.description}</p>
          </article>
        )
      })}
    </div>
  </section>
)

export default Features
