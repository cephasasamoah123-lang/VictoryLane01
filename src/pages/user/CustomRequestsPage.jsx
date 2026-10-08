import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { FileText, Send, Loader } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import useToastStore from '../../store/toastStore'

const CustomRequestsPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const showToast = useToastStore((state) => state.showToast)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyRequests()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/requests/my')
      setMyRequests(res.data.requests)
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await api.post('/requests', data)
      setMyRequests(prev => [res.data.request, ...prev])
      reset()
      setShowForm(false)
      showToast('Your request has been submitted.')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit request', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusVariant = (status) => {
    const variants = { pending: 'warning', approved: 'success', rejected: 'danger', 'in-review': 'info' }
    return variants[status] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Custom Requests</h1>
          {isAuthenticated && (
            <Button onClick={() => setShowForm(!showForm)}>
              <Send size={20} className="mr-2" />
              New Request
            </Button>
          )}
        </div>

        {!isAuthenticated && (
          <Card className="mb-8 bg-blue-50 border border-blue-200">
            <p className="text-blue-800">
              Please <a href="/login" className="font-semibold underline">sign in</a> to submit custom requests and view your request history.
            </p>
          </Card>
        )}

        {showForm && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Submit Custom Request</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Request Title" placeholder="e.g. Custom Laptop Configuration" {...register('title', { required: true })} />
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="Describe what you're looking for in detail..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Quantity" type="number" placeholder="1" {...register('quantity')} />
                <Input label="Budget Range" placeholder="e.g. GH₵500 - GH₵1000" {...register('budget')} />
              </div>
              <Input label="Preferred Delivery Date" type="date" {...register('deliveryDate')} />
              <div className="flex gap-4">
                <Button type="submit" loading={submitting} disabled={submitting}>Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {isAuthenticated && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Requests</h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-primary-600" size={32} />
              </div>
            ) : myRequests.length === 0 ? (
              <Card className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
                <p className="text-gray-600">Click "New Request" to submit your first custom request.</p>
              </Card>
            ) : (
              myRequests.map((request) => (
                <Card key={request._id} hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="text-primary-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(request.createdAt).toLocaleDateString()}
                          {request.budget && ` • Budget: ${request.budget}`}
                          {request.quantity && ` • Qty: ${request.quantity}`}
                        </p>
                        {request.adminNote && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                            <span className="font-medium">Admin response:</span> {request.adminNote}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status.toUpperCase()}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomRequestsPage
