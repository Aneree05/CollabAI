import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import api from '../../services/api'

const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    roles: z.enum(['client', 'freelancer', 'agency']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const RegisterPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roles: 'client',
    },
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      await api.post('/api/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
        roles: [values.roles],
        skills: [],
        experience: '',
        portfolio: '',
        profileImage: '',
      })

      toast.success('Registration successful. Please sign in.')
      navigate('/login', { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="name">
            Name
          </label>
          <Input id="name" type="text" placeholder="Your name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="email">
            Email
          </label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="password">
            Password
          </label>
          <Input id="password" type="password" placeholder="Create password" {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input id="confirmPassword" type="password" placeholder="Confirm password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-danger">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="roles">
            Role
          </label>
          <select
            id="roles"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
            {...register('roles')}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
            <option value="agency">Agency</option>
          </select>
          {errors.roles && <p className="mt-1 text-sm text-danger">{errors.roles.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner label="Creating account..." /> : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </Card>
  )
}

export default RegisterPage
