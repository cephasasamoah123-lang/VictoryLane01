import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import api from '../../lib/api'
import { Loader, Trash2 } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/users')
      setUsers(res.data?.users || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
      setDeleteConfirm(null)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manage Users</h1>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <Card key={user._id}>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold truncate">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</p>
                  <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                    {user.role?.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
              {user.role !== 'admin' && (
                <button
                  className="text-red-600 hover:text-red-700 ml-2 p-1"
                  onClick={() => setDeleteConfirm(user._id)}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </Card>
        ))}
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">No users found.</div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4 lg:table-cell hidden">Phone</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4 lg:table-cell hidden">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 lg:table-cell hidden">{user.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                      {user.role?.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm lg:table-cell hidden">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {user.role !== 'admin' && (
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDeleteConfirm(user._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete User"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
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

export default AdminUsers
