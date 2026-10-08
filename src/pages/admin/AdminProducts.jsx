import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ProductFormModal from '../../components/admin/ProductFormModal'
import api, { getImageUrl } from '../../lib/api'
import { Plus, Edit, Trash2, Loader } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    fetchProducts()
    api.get('/categories').then(res => {
      setCategories(res.data?.categories || [])
    }).catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data?.products || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSuccess = (product, action) => {
    if (action === 'created') {
      setProducts(prev => [product, ...prev])
    } else if (action === 'updated') {
      setProducts(prev => prev.map(p => p._id === product._id ? product : p))
    }
  }

  const handleDelete = async (productId) => {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await api.delete(`/products/${productId}`)
      setProducts(prev => prev.filter(p => p._id !== productId))
      setDeleteConfirm(null)
    } catch (err) {
      if (err.response?.status === 404) {
        // Already deleted (e.g. duplicate click) - just sync the UI, not a real failure
        setProducts(prev => prev.filter(p => p._id !== productId))
        setDeleteConfirm(null)
      } else {
        showToast(err.response?.data?.message || 'Failed to delete product', 'error')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const getCategoryLabel = (cat) => {
    const found = categories.find(c => c.slug === cat)
    return found?.name || cat
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
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Manage Products</h1>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true) }}>
          <Plus size={20} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <Card key={product._id}>
            <div className="flex gap-3">
              {product.image && (
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{getCategoryLabel(product.category)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <button
                      className="text-blue-600 hover:text-blue-700 p-1"
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true) }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700 p-1"
                      onClick={() => setDeleteConfirm(product._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-semibold text-sm">₵{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                    {product.stock > 0 ? 'Active' : 'Out'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found. Tap "Add" to create one.
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <Card className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getCategoryLabel(product.category)}</td>
                  <td className="py-3 px-4">₵{product.price}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                      {product.stock > 0 ? 'Active' : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-700 mr-3"
                      onClick={() => { setEditingProduct(product); setIsModalOpen(true) }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeleteConfirm(product._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found. Click "Add Product" to create one.
            </div>
          )}
        </div>
      </Card>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null) }}
        product={editingProduct}
        onSuccess={handleProductSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteConfirm(null)}
            className="flex-1"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(deleteConfirm)}
            className="flex-1"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default AdminProducts
