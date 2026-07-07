import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { projectApi } from '../../services/collabApi'

const projectSchema = z.object({
  freelancer: z.string().min(1, 'Freelancer is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  budget: z.coerce.number().positive('Budget must be greater than 0'),
  deadline: z.string().min(1, 'Deadline is required'),
})

const ProjectsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  })

  const createProjectMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully')
      setShowCreateForm(false)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to create project')
    },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
  })

  const projects = data?.data || []
  const canCreate = user?.roles?.includes('client')

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Track and manage your projects."
        actions={canCreate ? <Button type="button" onClick={() => setShowCreateForm((prev) => !prev)}>{showCreateForm ? 'Cancel' : 'Create Project'}</Button> : null}
      />

      {showCreateForm && (
        <Card className="mb-6 grid gap-4 md:grid-cols-2">
          <form onSubmit={handleSubmit((values) => createProjectMutation.mutate(values))} className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Freelancer ID</label>
              <Input {...register('freelancer')} />
              {errors.freelancer && <p className="mt-1 text-sm text-danger">{errors.freelancer.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Title</label>
              <Input {...register('title')} />
              {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-text">Description</label>
              <textarea className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary" rows="4" {...register('description')} />
              {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Category</label>
              <Input {...register('category')} />
              {errors.category && <p className="mt-1 text-sm text-danger">{errors.category.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Budget</label>
              <Input type="number" {...register('budget')} />
              {errors.budget && <p className="mt-1 text-sm text-danger">{errors.budget.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Deadline</label>
              <Input type="date" {...register('deadline')} />
              {errors.deadline && <p className="mt-1 text-sm text-danger">{errors.deadline.message}</p>}
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" disabled={createProjectMutation.isPending}>{createProjectMutation.isPending ? <LoadingSpinner label="Creating..." /> : 'Create Project'}</Button>
              <Button type="button" variant="secondary" onClick={() => { reset(); setShowCreateForm(false) }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading && <LoadingSpinner label="Loading projects..." />}
      {isError && <ErrorState title="Unable to load projects" description={error?.response?.data?.message || 'Please try again later.'} />}
      {!isLoading && !isError && projects.length === 0 && <EmptyState title="No projects yet" description="Create a project to begin working with a freelancer." />}

      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <Card key={project._id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text">{project.title}</h2>
                <p className="text-sm text-secondary">{project.category}</p>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-sm font-medium text-primary">{project.status}</span>
            </div>
            <p className="text-sm leading-7 text-secondary">{project.description}</p>
            <div className="flex items-center justify-between text-sm text-secondary">
              <span>Budget: ${project.budget}</span>
              <span>Deadline: {project.deadline}</span>
            </div>
            <Button type="button" variant="secondary" onClick={() => navigate(`/projects/${project._id}`)}>
              View Details
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage
