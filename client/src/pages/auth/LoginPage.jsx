import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import useAuth from '../../contexts/useAuth'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import api from '../../services/api'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      const response = await api.post('/api/auth/login', values)
      const { token, user } = response.data

      login(token, user)

      toast.success('Login successful')
      navigate(location.state?.from?.pathname || '/marketplace', { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Input id="password" type="password" placeholder="Enter password" {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-secondary">
            <input type="checkbox" className="rounded border-border" />
            <span>Remember Me</span>
          </label>
          <span className="cursor-not-allowed text-secondary">Forgot Password</span>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner label="Signing in..." /> : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-primary">
          Create one
        </Link>
      </p>
    </Card>
  )
}

export default LoginPage
