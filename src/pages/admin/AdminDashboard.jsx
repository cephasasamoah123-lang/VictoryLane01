import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, FileText, DollarSign, FolderOpen } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import api from '../../lib/api'

const AdminDashboard = () => {
  const [dashStats, setDashStats] = useState({
    totalValue: '0',
    totalProducts: '0',
    totalUsers: '0',
    totalOrders: '0',
    totalRevenue: '0',
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productRes, userRes, orderRes] = await Promise.all([
          api.get('/products/stats'),
          api.get('/users/stats'),
          api.get('/orders/stats'),
        ])
        setDashStats({
          totalValue: productRes.data.totalValue || '0',
          totalProducts: String(productRes.data.total || 0),
          totalUsers: String(userRes.data.total || 0),
          totalOrders: String(orderRes.data.totalOrders || 0),
          totalRevenue: orderRes.data.totalRevenue || '0',
        })
        setRecentOrders(orderRes.data.recentOrders || [])
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: `₵${Number(dashStats.totalRevenue).toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-100' },
    { icon: ShoppingBag, label: 'Total Orders', value: dashStats.totalOrders, color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Users, label: 'Total Users', value: dashStats.totalUsers, color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Package, label: 'Products', value: dashStats.totalProducts, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  const menuItems = [
    { icon: Package, label: 'Manage Products', path: '/admin/products', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: FolderOpen, label: 'Manage Categories', path: '/admin/categories', color: 'text-teal-600', bg: 'bg-teal-100' },
    { icon: ShoppingBag, label: 'Manage Orders', path: '/admin/orders', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: FileText, label: 'Custom Requests', path: '/admin/requests', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Users, label: 'Manage Users', path: '/admin/users', color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  const getStatusVariant = (status) => {
    const variants = { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' }
    return variants[status] || 'default'
  }

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.color} size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card hover className="text-center cursor-pointer transition-transform hover:scale-105">
              <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <item.icon size={28} className={item.color} />
              </div>
              <h3 className="font-semibold">{item.label}</h3>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-mono text-sm">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">₵{order.total?.toFixed(2)}</p>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-sm">Order #</th>
                  <th className="text-left py-2 px-3 text-sm">Customer</th>
                  <th className="text-left py-2 px-3 text-sm">Total</th>
                  <th className="text-left py-2 px-3 text-sm">Status</th>
                  <th className="text-left py-2 px-3 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-2 px-3 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-2 px-3 text-sm">{order.customerName}</td>
                    <td className="py-2 px-3 text-sm font-semibold">₵{order.total?.toFixed(2)}</td>
                    <td className="py-2 px-3">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}

export default AdminDashboard
