import { Link } from 'react-router-dom'
import { ShoppingBag, Package, Heart, FileText, User } from 'lucide-react'
import Card from '../../components/ui/Card'
import useAuthStore from '../../store/authStore'

const UserDashboard = () => {
  const user = useAuthStore((state) => state.user)

  const menuItems = [
    { icon: ShoppingBag, label: 'My Orders', path: '/orders', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: 'text-red-600', bg: 'bg-red-100' },
    { icon: FileText, label: 'Custom Requests', path: '/custom-requests', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: User, label: 'Profile Settings', path: '/profile', color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Card hover className="text-center cursor-pointer transition-transform hover:scale-105">
                <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={32} className={item.color} />
                </div>
                <h3 className="font-semibold text-lg">{item.label}</h3>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <p className="text-gray-600">No recent orders</p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Account Info</h2>
            <dl className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-600">Name</dt>
                <dd className="font-medium">{user?.name}</dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="text-gray-600">Email</dt>
                <dd className="font-medium">{user?.email}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-gray-600">Role</dt>
                <dd className="font-medium capitalize">{user?.role}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
