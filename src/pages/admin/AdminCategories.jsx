import { useState, useEffect, useRef } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import api, { getImageUrl } from '../../lib/api'
import { Plus, Edit, Trash2, Loader, Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import useToastStore from '../../store/toastStore'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const showToast = useToastStore((state) => state.showToast)

  // Form state
  const [form, setForm] = useState({ name: '', slug: '', description: '', order: 0, group: '' })
  const [categoryImage, setCategoryImage] = useState('')
  const [imageMode, setImageMode] = useState('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/categories')
      setCategories(res.data?.categories || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        order: category.order || 0,
        group: category.group || '',
      })
      setCategoryImage(category.image || '')
    } else {
      setEditingCategory(null)
      setForm({ name: '', slug: '', description: '', order: 0, group: '' })
      setCategoryImage('')
    }
    setImageUrl('')
    setImageMode('upload')
    setFormError('')
    setIsModalOpen(true)
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm(prev => ({
      ...prev,
      name,
      // Auto-generate slug from name if not editing
      slug: editingCategory ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setFormError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': undefined },
      })
      setCategoryImage(res.data.url)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleAddUrl = () => {
    if (!imageUrl.trim()) return
    try {
      new URL(imageUrl)
      setCategoryImage(imageUrl.trim())
      setImageUrl('')
    } catch {
      setFormError('Please enter a valid URL')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError('Name and slug are required')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      const payload = {
        ...form,
        image: categoryImage,
      }

      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, payload)
        setCategories(prev => prev.map(c => c._id === editingCategory._id ? res.data.category : c))
      } else {
        const res = await api.post('/categories', payload)
        setCategories(prev => [...prev, res.data.category])
      }
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await api.delete(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c._id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      if (err.response?.status === 404) {
        setCategories(prev => prev.filter(c => c._id !== id))
        setDeleteConfirm(null)
      } else {
        showToast(err.response?.data?.message || 'Failed to delete category', 'error')
      }
    } finally {
      setIsDeleting(false)
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
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Manage Categories</h1>
        <Button onClick={() => openModal()}>
          <Plus size={20} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Categories Grid, grouped by section */}
      {categories.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No categories yet. Click "Add Category" to create one.
        </div>
      )}
      {Object.entries(
        categories.reduce((groups, cat) => {
          const g = cat.group || 'Other'
          groups[g] = groups[g] || []
          groups[g].push(cat)
          return groups
        }, {})
      ).map(([groupName, cats]) => (
        <div key={groupName} className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">{groupName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cats.map((category) => (
              <Card key={category._id} padding={false} className="overflow-hidden">
                {category.image ? (
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={40} className="text-gray-300" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-500">/{category.slug}</p>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      <button
                        className="text-blue-600 hover:text-blue-700 p-1"
                        onClick={() => openModal(category)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700 p-1"
                        onClick={() => setDeleteConfirm(category._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Order: {category.order || 0}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Electronics"
            value={form.name}
            onChange={handleNameChange}
          />

          <Input
            label="Slug"
            placeholder="e.g. tops"
            value={form.slug}
            onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={form.group}
              onChange={(e) => setForm(prev => ({ ...prev, group: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">No department</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
              <option value="Accessories">Accessories</option>
              <option value="Jewelry">Jewelry</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Category groups are now department-level entry points for store navigation.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              rows={2}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Input
            label="Display Order"
            type="number"
            value={form.order}
            onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
          />

          {/* Image Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-3">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  imageMode === 'upload' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload size={16} />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  imageMode === 'url' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LinkIcon size={16} />
                URL
              </button>
            </div>

            {imageMode === 'upload' && (
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  uploading ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <p className="text-sm text-gray-500">Click to upload image</p>
                )}
              </div>
            )}

            {imageMode === 'url' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl() } }}
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                >
                  Set
                </button>
              </div>
            )}

            {categoryImage && (
              <div className="mt-3 relative inline-block">
                <img
                  src={getImageUrl(categoryImage)}
                  alt="Category"
                  className="w-32 h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setCategoryImage('')}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting || uploading} className="flex-1">
              {editingCategory ? 'Update' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this category? Products in this category will not be deleted.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1" disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm)} className="flex-1" disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default AdminCategories
