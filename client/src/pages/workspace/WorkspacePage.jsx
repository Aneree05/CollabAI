import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { activityApi, fileApi, messageApi, projectApi } from '../../services/collabApi'

const WorkspacePage = () => {
  const { projectId } = useParams()
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const { data: projectData, isLoading: projectLoading, isError: projectError, error: projectErrorData } = useQuery({
    queryKey: ['workspace-project', projectId],
    queryFn: () => projectApi.getById(projectId),
  })

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', projectId],
    queryFn: () => messageApi.getConversation(projectId),
    enabled: Boolean(projectId),
  })

  const { data: filesData, isLoading: filesLoading } = useQuery({
    queryKey: ['files', projectId],
    queryFn: () => fileApi.getProjectFiles(projectId),
    enabled: Boolean(projectId),
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', projectId],
    queryFn: () => activityApi.getProjectActivity(projectId),
    enabled: Boolean(projectId),
  })

  const project = projectData?.data
  const messages = messagesData?.data || []
  const files = filesData?.data || []
  const activities = activityData?.data || []

  if (projectLoading) return <LoadingSpinner label="Loading workspace..." />
  if (projectError) return <ErrorState title="Unable to load workspace" description={projectErrorData?.response?.data?.message || 'Please try again later.'} />
  if (!project) return <EmptyState title="Project not found" description="The requested workspace could not be found." />

  return (
    <div>
      <PageHeader title={`Workspace · ${project.title}`} description="Collaborate on the project in one place." backTo="/projects" />

      <div className="mb-6 flex flex-wrap gap-2">
        {['overview', 'chat', 'files', 'activity'].map((tab) => (
          <Button key={tab} type="button" variant={activeTab === tab ? 'primary' : 'secondary'} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold text-text">Project Summary</h2>
            <p className="mt-2 text-sm leading-7 text-secondary">{project.description}</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-text">Status</h2>
            <p className="mt-2 text-sm text-secondary">Current status: {project.status}</p>
          </Card>
        </div>
      )}

      {activeTab === 'chat' && (
        <Card className="space-y-4">
          <div className="space-y-3">
            {messagesLoading && <LoadingSpinner label="Loading messages..." />}
            {!messagesLoading && messages.length === 0 && <EmptyState title="No messages yet" description="Start the conversation on this project." />}
            {messages.map((item) => (
              <div key={item._id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium text-text">{item.sender?.name || 'User'}</p>
                <p className="mt-1 text-sm text-secondary">{item.message}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type a message" />
            <Button type="button" onClick={() => { setMessage(''); }}>Send</Button>
          </div>
        </Card>
      )}

      {activeTab === 'files' && (
        <Card>
          {filesLoading && <LoadingSpinner label="Loading files..." />}
          {!filesLoading && files.length === 0 && <EmptyState title="No files uploaded" description="Files added to this workspace will appear here." />}
          <div className="grid gap-4 md:grid-cols-2">
            {files.map((file) => (
              <div key={file._id} className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-text">{file.fileName}</p>
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary">Open file</a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          {activityLoading && <LoadingSpinner label="Loading activity..." />}
          {!activityLoading && activities.length === 0 && <EmptyState title="No activity yet" description="Project activity will appear here." />}
          <div className="space-y-3">
            {activities.map((item) => (
              <div key={item._id} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-medium text-text">{item.action}</p>
                <p className="mt-1 text-sm text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default WorkspacePage
