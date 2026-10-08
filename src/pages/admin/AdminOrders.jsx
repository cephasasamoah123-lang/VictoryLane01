import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import OrderDetailModal from '../../components/admin/OrderDetailModal'
import api from '../../lib/api'
import { Loader, Eye, DollarSign, ShoppingBag, Clock, CheckCircle } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [statusFilter])

  const fetchStats = async () => {
    try {
      const res = await api.get('/orders/stats')
      setStats(res.data)
    } catch (err) {
      console.error('Failed to fetch order stats:', err)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (searchQuery) params.search = searchQuery
      const res = await api.get('/orders', { params })
      setOrders(res.data?.orders || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrders()
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o))
      if (selectedOrder?._id === orderId) setSelectedOrder(res.data.order)
      fetchStats()
    } catch (err) {
      showToast('Failed to update order status', 'error')
    }
  }

  const statCards = stats ? [
    { icon: ShoppingBag, label: 'Total Orders', value: stats.totalOrders, color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: DollarSign, label: 'Revenue', value: `₵${Number(stats.totalRevenue).toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-100' },
    { icon: Clock, label: 'Pending', value: stats.ordersByStatus?.pending || 0, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { icon: CheckCircle, label: 'Delivered', value: stats.ordersByStatus?.delivered || 0, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ] : []

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manage Orders</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
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
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by order #, customer name or email..."
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
        {orders.map((order) => (
          <Card key={order._id}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-600">{order.customerName}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-primary-600 hover:text-primary-700 p-1"
              >
                <Eye size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold">₵{order.total?.toFixed(2)}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-gray-500">{order.items?.length || 0} items</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-2">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </Card>
        ))}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">No orders found.</div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order #</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4 lg:table-cell hidden">Date</th>
                <th className="text-left py-3 px-4 lg:table-cell hidden">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium font-mono text-sm">{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm lg:table-cell hidden">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 lg:table-cell hidden">{order.items?.length || 0}</td>
                  <td className="py-3 px-4 font-semibold">₵{order.total?.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-semibold border-0 cursor-pointer ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No orders found.
            </div>
          )}
        </div>
      </Card>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  )
}

export default AdminOrders
