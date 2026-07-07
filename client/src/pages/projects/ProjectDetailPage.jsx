import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { projectApi } from '../../services/collabApi'

const ProjectDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getById(id),
  })

  const acceptMutation = useMutation({
    mutationFn: () => projectApi.accept(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast.success('Project accepted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to accept project')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: () => projectApi.reject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast.success('Project rejected successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to reject project')
    },
  })

  const statusMutation = useMutation({
    mutationFn: (status) => projectApi.updateStatus(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast.success('Project status updated')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to update status')
    },
  })

  const project = data?.data

  if (isLoading) return <LoadingSpinner label="Loading project..." />
  if (isError) return <ErrorState title="Unable to load project" description={error?.response?.data?.message || 'Please try again later.'} />
  if (!project) return <EmptyState title="Project not found" description="The requested project could not be found." />

  return (
    <div>
      <PageHeader title={project.title} description={project.category} backTo="/projects" />
      <Card className="space-y-4">
        <p className="text-sm leading-8 text-secondary">{project.description}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-secondary">Budget</p>
            <p className="mt-1 text-lg font-semibold text-text">${project.budget}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-secondary">Deadline</p>
            <p className="mt-1 text-lg font-semibold text-text">{project.deadline}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-secondary">Status</p>
            <p className="mt-1 text-lg font-semibold text-text">{project.status}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => navigate('/projects')}>Back to Projects</Button>
          <Button type="button" variant="secondary" onClick={() => acceptMutation.mutate()} disabled={acceptMutation.isPending}>Accept</Button>
          <Button type="button" variant="danger" onClick={() => rejectMutation.mutate()} disabled={rejectMutation.isPending}>Reject</Button>
          <Button type="button" variant="secondary" onClick={() => statusMutation.mutate('In Progress')} disabled={statusMutation.isPending}>Mark In Progress</Button>
          <Button type="button" variant="secondary" onClick={() => statusMutation.mutate('Completed')} disabled={statusMutation.isPending}>Mark Completed</Button>
        </div>
      </Card>
    </div>
  )
}

export default ProjectDetailPage
