import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import useAuth from '../../contexts/useAuth'
import { serviceApi } from '../../services/collabApi'

const MyServicesPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['my-services'],
    queryFn: () => serviceApi.getAll({}),
  })

  const deleteMutation = useMutation({
    mutationFn: serviceApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-services'] })
      toast.success('Service deleted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to delete service')
    },
  })

  const services = (data?.data?.services || []).filter((service) => service.freelancer?._id === user?._id)

  return (
    <div>
      <PageHeader title="My Services" description="Manage the services you published." backTo="/marketplace" />
      {isLoading && <LoadingSpinner label="Loading your services..." />}
      {isError && <ErrorState title="Unable to load services" description={error?.response?.data?.message || 'Please try again later.'} />}
      {!isLoading && !isError && services.length === 0 && <EmptyState title="No services yet" description="Create a service from the marketplace to get started." />}
      <div className="grid gap-6 lg:grid-cols-2">
        {services.map((service) => (
          <Card key={service._id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text">{service.title}</h2>
                <p className="text-sm text-secondary">{service.category}</p>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-sm font-medium text-primary">${service.pricing}</span>
            </div>
            <p className="text-sm leading-7 text-secondary">{service.description}</p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate(`/marketplace/edit/${service._id}`)}>
                Edit
              </Button>
              <Button type="button" variant="danger" onClick={() => deleteMutation.mutate(service._id)} disabled={deleteMutation.isPending}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MyServicesPage
