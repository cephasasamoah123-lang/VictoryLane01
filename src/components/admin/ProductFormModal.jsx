import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api, { getImageUrl } from '../../lib/api'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Sparkles, Loader } from 'lucide-react'

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  category: z.string().min(1, 'Please select a category'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  brand: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

const ProductFormModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [imageMode, setImageMode] = useState('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [descriptionKeywords, setDescriptionKeywords] = useState('')
  const fileInputRef = useRef(null)

  // Fetch categories
  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data?.categories || [])
    }).catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
      brand: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'tops',
        stock: product.stock || 0,
        brand: product.brand || '',
        status: product.status || 'active',
      })
      const existing = []
      if (product.image) existing.push(product.image)
      if (product.images?.length) {
        product.images.forEach(img => {
          if (!existing.includes(img)) existing.push(img)
        })
      }
      setUploadedImages(existing)
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: 0,
        brand: '',
        status: 'active',
      })
      setUploadedImages([])
    }
    setImageUrl('')
    setImageMode('upload')
    setFormError('')
  }, [product, reset, isOpen])

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    setFormError('')

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)

        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': undefined },
        })

        setUploadedImages(prev => [...prev, res.data.url])
      }
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
      setUploadedImages(prev => [...prev, imageUrl.trim()])
      setImageUrl('')
    } catch {
      setFormError('Please enter a valid URL')
    }
  }

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleGenerateDescription = async () => {
    const { name, category, brand } = getValues()
    if (!name || !name.trim()) {
      setFormError('Enter a product name first so AI has something to work with')
      return
    }
    setGeneratingDescription(true)
    setFormError('')
    try {
      const res = await api.post('/ai/generate-description', {
        name,
        category,
        brand,
        keywords: descriptionKeywords,
      })
      setValue('description', res.data?.description || '', { shouldValidate: true })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not generate a description right now')
    } finally {
      setGeneratingDescription(false)
    }
  }

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setFormError('Please add at least one product image')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      const payload = {
        ...data,
        image: uploadedImages[0],
        images: uploadedImages,
      }

      if (product) {
        const response = await api.put(`/products/${product._id}`, payload)
        onSuccess(response.data.product, 'updated')
      } else {
        const response = await api.post('/products', payload)
        onSuccess(response.data.product, 'created')
      }
      onClose()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <Input
          label="Product Name"
          placeholder="e.g. Wireless Headphones"
          error={errors.name?.message}
          {...register('name')}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generatingDescription}
              className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800 disabled:opacity-50"
            >
              {generatingDescription ? (
                <Loader size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              Generate with AI
            </button>
          </div>
          <input
            type="text"
            value={descriptionKeywords}
            onChange={(e) => setDescriptionKeywords(e.target.value)}
            placeholder="Optional: notes for AI, e.g. 'lightweight, for hot weather'"
            className="w-full px-4 py-2 mb-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <textarea
            rows={3}
            placeholder="Describe the product in detail..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price (GH₵)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('category')}
            >
              <option value="">Select a category</option>
              {Object.entries(
                categories.reduce((groups, cat) => {
                  const g = cat.group || 'Other'
                  groups[g] = groups[g] || []
                  groups[g].push(cat)
                  return groups
                }, {})
              ).map(([groupName, cats]) => (
                <optgroup key={groupName} label={groupName}>
                  {cats.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>

          {/* Mode Tabs */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-3">
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                imageMode === 'upload'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload size={16} />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                imageMode === 'url'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LinkIcon size={16} />
              Image URL
            </button>
          </div>

          {/* Upload Area */}
          {imageMode === 'upload' && (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                uploading
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              {uploading ? (
                <div>
                  <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-primary-600 font-medium">Uploading...</p>
                </div>
              ) : (
                <div>
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP - Max 5MB each</p>
                </div>
              )}
            </div>
          )}

          {/* URL Input */}
          {imageMode === 'url' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddUrl()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium whitespace-nowrap"
              >
                Add
              </button>
            </div>
          )}

          {/* Image Preview Grid */}
          {uploadedImages.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={getImageUrl(img)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadedImages.length === 0 && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <ImageIcon size={12} />
              Add at least one image. The first image will be the main product image.
            </p>
          )}
        </div>

        <Input
          label="Brand (optional)"
          placeholder="e.g. AudioTech"
          error={errors.brand?.message}
          {...register('brand')}
        />

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || uploading}
            className="flex-1"
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ProductFormModal
