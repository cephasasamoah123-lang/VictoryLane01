import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import api from '../../lib/api'
import { Loader, Eye, Trash2, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const AdminRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [adminNote, setAdminNote] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (searchQuery) params.search = searchQuery
      const res = await api.get('/requests', { params })
      setRequests(res.data?.requests || [])
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRequests()
  }

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const res = await api.put(`/requests/${requestId}/status`, {
        status: newStatus,
        adminNote: adminNote || undefined,
      })
      setRequests(prev => prev.map(r => r._id === requestId ? res.data.request : r))
      if (selectedRequest?._id === requestId) {
        setSelectedRequest(res.data.request)
      }
    } catch (err) {
      showToast('Failed to update status', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/requests/${id}`)
      setRequests(prev => prev.filter(r => r._id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      showToast('Failed to delete request', 'error')
    }
  }

  const openReview = (request) => {
    setSelectedRequest(request)
    setAdminNote(request.adminNote || '')
  }

  const getStatusVariant = (status) => {
    const variants = { pending: 'warning', approved: 'success', rejected: 'danger', 'in-review': 'info' }
    return variants[status] || 'default'
  }

  const statCounts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Custom Requests</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: FileText, label: 'Total', value: statCounts.total, color: 'text-blue-600', bg: 'bg-blue-100' },
          { icon: Clock, label: 'Pending', value: statCounts.pending, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { icon: CheckCircle, label: 'Approved', value: statCounts.approved, color: 'text-green-600', bg: 'bg-green-100' },
          { icon: XCircle, label: 'Rejected', value: statCounts.rejected, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.color} size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by title, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Search
          </button>
        </form>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {requests.map((request) => (
          <Card key={request._id}>
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{request.title}</p>
                <p className="text-sm text-gray-600">{request.customerName}</p>
              </div>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => openReview(request)}
                  className="text-primary-600 hover:text-primary-700 p-1"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(request._id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {request.budget && <span className="text-gray-600">{request.budget}</span>}
                <span className="text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status.toUpperCase()}
              </Badge>
            </div>
          </Card>
        ))}
        {requests.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">No requests found.</div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4 lg:table-cell hidden">Budget</th>
                <th className="text-left py-3 px-4 lg:table-cell hidden">Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{request.customerName}</p>
                      <p className="text-xs text-gray-500">{request.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium truncate max-w-xs">{request.title}</p>
                  </td>
                  <td className="py-3 px-4 text-sm lg:table-cell hidden">{request.budget || '-'}</td>
                  <td className="py-3 px-4 text-sm lg:table-cell hidden">{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openReview(request)}
                      className="text-primary-600 hover:text-primary-700 mr-3"
                      title="Review"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(request._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No requests found.
            </div>
          )}
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Review Request"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Customer</h4>
              <p className="font-medium">{selectedRequest.customerName}</p>
              <p className="text-sm text-gray-600">{selectedRequest.customerEmail}</p>
              {selectedRequest.customerPhone && (
                <p className="text-sm text-gray-600">{selectedRequest.customerPhone}</p>
              )}
            </div>

            {/* Request Details */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Request Details</h4>
              <h3 className="text-lg font-semibold">{selectedRequest.title}</h3>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{selectedRequest.description}</p>
              <div className="flex flex-wrap gap-3 sm:gap-6 mt-3 text-sm text-gray-600">
                {selectedRequest.budget && <span>Budget: <strong>{selectedRequest.budget}</strong></span>}
                {selectedRequest.quantity && <span>Quantity: <strong>{selectedRequest.quantity}</strong></span>}
                {selectedRequest.deliveryDate && <span>Delivery: <strong>{selectedRequest.deliveryDate}</strong></span>}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Submitted: {new Date(selectedRequest.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Status Update */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Update Status</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {['pending', 'in-review', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedRequest._id, status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedRequest.status === status
                        ? status === 'approved' ? 'bg-green-100 border-green-300 text-green-800'
                        : status === 'rejected' ? 'bg-red-100 border-red-300 text-red-800'
                        : status === 'in-review' ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-yellow-100 border-yellow-300 text-yellow-800'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'in-review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Admin Note */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Note (visible to customer)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Add a note or response for the customer..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button
                className="mt-3"
                onClick={() => handleStatusUpdate(selectedRequest._id, selectedRequest.status)}
              >
                Save Note
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Request"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this request? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)} className="flex-1">
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default AdminRequests
