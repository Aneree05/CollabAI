import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { serviceApi } from '../../services/collabApi'

const ServiceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceApi.getById(id),
  })

  const service = data?.data?.service

  if (isLoading) return <LoadingSpinner label="Loading service..." />
  if (isError) return <ErrorState title="Unable to load service" description={error?.response?.data?.message || 'Please try again later.'} />
  if (!service) return <EmptyState title="Service not found" description="The requested service could not be found." />

  return (
    <div>
      <PageHeader title={service.title} description={service.category} backTo="/marketplace" />
      <Card className="space-y-4">
        <p className="text-sm leading-8 text-secondary">{service.description}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-secondary">Pricing</p>
            <p className="mt-1 text-lg font-semibold text-text">${service.pricing}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-secondary">Delivery</p>
            <p className="mt-1 text-lg font-semibold text-text">{service.deliveryTimeline} days</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-secondary">Freelancer</p>
            <p className="mt-1 text-lg font-semibold text-text">{service.freelancer?.name || 'Unknown'}</p>
          </div>
        </div>
        <Button type="button" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </Card>
    </div>
  )
}

export default ServiceDetailPage
