import { useQuery } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { dashboardApi } from '../../services/collabApi'

const AdminPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardApi.getAdmin,
  })

  const stats = data?.data || {}

  if (isLoading) return <LoadingSpinner label="Loading admin dashboard..." />
  if (isError) return <ErrorState title="Unable to load admin dashboard" description={error?.response?.data?.message || 'Please try again later.'} />
  if (!stats || Object.keys(stats).length === 0) return <EmptyState title="No admin data" description="There is no data available for the admin dashboard yet." />

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Monitor key platform metrics." />
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-sm text-secondary">Total Users</p>
          <p className="mt-2 text-3xl font-semibold text-text">{stats.totalUsers}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary">Total Projects</p>
          <p className="mt-2 text-3xl font-semibold text-text">{stats.totalProjects}</p>
        </Card>
        <Card>
          <p className="text-sm text-secondary">Total Services</p>
          <p className="mt-2 text-3xl font-semibold text-text">{stats.totalServices}</p>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage
