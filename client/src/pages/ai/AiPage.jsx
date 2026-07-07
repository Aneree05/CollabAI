import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/common/PageHeader'
import { aiApi } from '../../services/collabApi'

const AiPage = () => {
  const [scope, setScope] = useState('')
  const [cost, setCost] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [scopeResult, setScopeResult] = useState('')
  const [costResult, setCostResult] = useState('')
  const [recommendationResult, setRecommendationResult] = useState('')

  const scopeMutation = useMutation({
    mutationFn: aiApi.generateScope,
    onSuccess: (response) => setScopeResult(response.data.result),
    onError: (error) => toast.error(error?.response?.data?.message || 'Unable to generate scope'),
  })

  const costMutation = useMutation({
    mutationFn: aiApi.estimateCost,
    onSuccess: (response) => setCostResult(response.data.result),
    onError: (error) => toast.error(error?.response?.data?.message || 'Unable to estimate cost'),
  })

  const recommendationMutation = useMutation({
    mutationFn: aiApi.recommendFreelancers,
    onSuccess: (response) => setRecommendationResult(response.data.result),
    onError: (error) => toast.error(error?.response?.data?.message || 'Unable to recommend freelancers'),
  })

  return (
    <div>
      <PageHeader title="AI Assistant" description="Generate project scopes, cost estimates, and freelancer recommendations." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Scope Generator</h2>
          <Input placeholder="Describe your project" value={scope} onChange={(event) => setScope(event.target.value)} />
          <Button type="button" onClick={() => scopeMutation.mutate({ description: scope })} disabled={scopeMutation.isPending}>
            {scopeMutation.isPending ? <LoadingSpinner label="Generating..." /> : 'Generate Scope'}
          </Button>
          {scopeResult && <p className="whitespace-pre-line text-sm leading-7 text-secondary">{scopeResult}</p>}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Cost Estimator</h2>
          <Input placeholder="Describe the project scope" value={cost} onChange={(event) => setCost(event.target.value)} />
          <Button type="button" onClick={() => costMutation.mutate({ description: cost })} disabled={costMutation.isPending}>
            {costMutation.isPending ? <LoadingSpinner label="Estimating..." /> : 'Estimate Cost'}
          </Button>
          {costResult && <p className="whitespace-pre-line text-sm leading-7 text-secondary">{costResult}</p>}
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Freelancer Recommendation</h2>
          <Input placeholder="Describe the ideal freelancer" value={recommendation} onChange={(event) => setRecommendation(event.target.value)} />
          <Button type="button" onClick={() => recommendationMutation.mutate({ projectDescription: recommendation })} disabled={recommendationMutation.isPending}>
            {recommendationMutation.isPending ? <LoadingSpinner label="Recommending..." /> : 'Recommend'}
          </Button>
          {recommendationResult && <p className="whitespace-pre-line text-sm leading-7 text-secondary">{recommendationResult}</p>}
        </Card>
      </div>
    </div>
  )
}

export default AiPage
