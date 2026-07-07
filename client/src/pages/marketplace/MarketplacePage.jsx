import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
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
import { serviceApi } from '../../services/collabApi'

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  pricing: z.coerce.number().positive('Pricing must be greater than 0'),
  deliveryTimeline: z.coerce.number().int().positive('Delivery timeline must be at least 1 day'),
})

const MarketplacePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['services', search, category, minPrice, maxPrice],
    queryFn: () => serviceApi.getAll({ search, category, minPrice, maxPrice }),
  })

  const createServiceMutation = useMutation({
    mutationFn: serviceApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service created successfully')
      setShowCreateForm(false)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to create service')
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
  })

  const onSubmit = (values) => createServiceMutation.mutate(values)

  const services = data?.data?.services || []
  const canCreate = user?.roles?.includes('freelancer') || user?.roles?.includes('agency')

  return (
    <div>
      <PageHeader
        title="Marketplace"
        description="Browse services and publish your own offerings."
        actions={
          canCreate ? (
            <Button type="button" onClick={() => setShowCreateForm((prev) => !prev)}>
              {showCreateForm ? 'Cancel' : 'Create Service'}
            </Button>
          ) : null
        }
      />

      {showCreateForm && (
        <Card className="mb-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
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
              <Button type="submit" disabled={createServiceMutation.isPending}>
                {createServiceMutation.isPending ? <LoadingSpinner label="Creating..." /> : 'Create Service'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => { reset(); setShowCreateForm(false) }}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Input placeholder="Search services" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Input placeholder="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
        <Input type="number" placeholder="Min Price" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
        <Input type="number" placeholder="Max Price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
      </div>

      {isLoading && <LoadingSpinner label="Loading marketplace..." />}
      {isError && <ErrorState title="Unable to load services" description={error?.response?.data?.message || 'Please try again later.'} />}

      {!isLoading && !isError && services.length === 0 && <EmptyState title="No services found" description="Try adjusting your search filters." />}

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
            <div className="flex items-center justify-between text-sm text-secondary">
              <span>{service.deliveryTimeline} day delivery</span>
              <span>{service.freelancer?.name || 'Freelancer'}</span>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate(`/marketplace/${service._id}`)}>
                View Details
              </Button>
              {user?._id === service.freelancer?._id && (
                <Button type="button" variant="secondary" onClick={() => navigate(`/marketplace/edit/${service._id}`)}>
                  Edit
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MarketplacePage
