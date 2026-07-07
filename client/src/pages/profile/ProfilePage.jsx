import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
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
import { profileApi } from '../../services/collabApi'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  skills: z.string(),
  experience: z.string(),
  portfolio: z.string().url('Portfolio must be a valid URL').optional().or(z.literal('')),
  profileImage: z.string().optional(),
})

const ProfilePage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.get,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (data?.data?.user) {
      reset({
        name: data.data.user.name || '',
        skills: (data.data.user.skills || []).join(', '),
        experience: data.data.user.experience || '',
        portfolio: data.data.user.portfolio || '',
        profileImage: data.data.user.profileImage || '',
      })
    }
  }, [data, reset])

  const updateMutation = useMutation({
    mutationFn: (values) => profileApi.update({
      name: values.name,
      skills: values.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      experience: values.experience,
      portfolio: values.portfolio,
      profileImage: values.profileImage,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Unable to update profile')
    },
  })

  const user = data?.data?.user

  if (isLoading) return <LoadingSpinner label="Loading profile..." />
  if (isError) return <ErrorState title="Unable to load profile" description={error?.response?.data?.message || 'Please try again later.'} />
  if (!user) return <EmptyState title="Profile not found" description="Your profile could not be loaded." />

  return (
    <div>
      <PageHeader title="Profile" description="Manage your public profile information." />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-3">
          <div className="h-16 w-16 rounded-full bg-primary/10 text-center text-2xl font-semibold leading-[64px] text-primary">{user.name?.[0] || 'U'}</div>
          <h2 className="text-xl font-semibold text-text">{user.name}</h2>
          <p className="text-sm text-secondary">{user.email}</p>
          <p className="text-sm text-secondary">Roles: {user.roles?.join(', ')}</p>
          <p className="text-sm text-secondary">Skills: {user.skills?.join(', ') || 'None listed'}</p>
        </Card>
        <Card>
          <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Name</label>
              <Input {...register('name')} />
              {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Portfolio URL</label>
              <Input {...register('portfolio')} />
              {errors.portfolio && <p className="mt-1 text-sm text-danger">{errors.portfolio.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Skills</label>
              <Input {...register('skills')} placeholder="React, Node, Design" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Profile Image URL</label>
              <Input {...register('profileImage')} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-text">Experience</label>
              <textarea className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary" rows="4" {...register('experience')} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <LoadingSpinner label="Saving..." /> : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
