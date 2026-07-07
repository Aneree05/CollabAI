import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { serviceApi } from '../../services/collabApi'

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  pricing: z.coerce.number().positive('Pricing must be greater than 0'),
  deliveryTimeline: z.coerce.number().int().positive('Delivery timeline must be at least 1 day'),
})

const EditServicePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceApi.getById(id),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema),
  })

  useEffect(() => {
    if (data?.data?.service) {
      reset({
        title: data.data.service.title,
        category: data.data.service.category,
        description: data.data.service.description,
        pricing: data.data.service.pricing,
        deliveryTimeline: data.data.service.deliveryTimeline,
      })
    }
  }, [data, reset])

  const updateMutation = useMutation({
    mutationFn: (values) => serviceApi.update(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service updated successfully')
      navigate('/marketplace/my-services')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to update service')
    },
  })

  if (isLoading) return <LoadingSpinner label="Loading service..." />
  if (isError) return <ErrorState title="Unable to load service" description={error?.response?.data?.message || 'Please try again later.'} />
  if (!data?.data?.service) return <EmptyState title="Service not found" description="The requested service could not be found." />

  return (
    <div>
      <PageHeader title="Edit Service" description="Update the service details below." backTo="/marketplace/my-services" />
      <Card>
        <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Title</label>
            <Input {...register('title')} />
            {errors.title && <p className="mt-1 text-sm text-danger">{errors.title.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Category</label>
            <Input {...register('category')} />
            {errors.category && <p className="mt-1 text-sm text-danger">{errors.category.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-text">Description</label>
            <textarea className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary" rows="4" {...register('description')} />
            {errors.description && <p className="mt-1 text-sm text-danger">{errors.description.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Pricing</label>
            <Input type="number" {...register('pricing')} />
            {errors.pricing && <p className="mt-1 text-sm text-danger">{errors.pricing.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Delivery Timeline (days)</label>
            <Input type="number" {...register('deliveryTimeline')} />
            {errors.deliveryTimeline && <p className="mt-1 text-sm text-danger">{errors.deliveryTimeline.message}</p>}
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <LoadingSpinner label="Updating..." /> : 'Save Changes'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/marketplace/my-services')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default EditServicePage
