import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Loader, Bell, Ruler, MessageCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import api, { getImageUrl } from '../lib/api'
import ProductAiInsights from '../components/ai/ProductAiInsights'
import useToastStore from '../store/toastStore'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [stockAlertSet, setStockAlertSet] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore()
  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/products/${id}`)
        setProduct(response.data?.product || null)
      } catch (err) {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return
    const viewed = JSON.parse(localStorage.getItem('victory-lane-recently-viewed') || '[]')
    const next = [{ _id: product._id, name: product.name, image: product.image, price: product.price }, ...viewed.filter((item) => item._id !== product._id)].slice(0, 6)
    localStorage.setItem('victory-lane-recently-viewed', JSON.stringify(next))
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    )
  }

  const productImages = product.images && product.images.length > 0
    ? product.images.map(getImageUrl)
    : product.image
      ? [getImageUrl(product.image)]
      : ['https://via.placeholder.com/800x600?text=No+Image']

  const handleAddToCart = () => {
    addItem(product, quantity)
    showToast('Product added to cart!')
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate('/checkout')
  }

  const handleAddToWishlist = () => {
    addToWishlist(product)
    showToast('Added to wishlist!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {/* Image Gallery */}
          <div>
            <Card padding={false} className="overflow-hidden mb-3 sm:mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </Card>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 sm:gap-4">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-16 sm:h-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge variant={product.stock > 0 ? 'success' : 'danger'} className="mb-2">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-4 sm:mb-6">
              ₵{product.price}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <Card className="mb-6 bg-primary-50/60 border-primary-100">
              <div className="flex gap-3">
                <Ruler className="mt-0.5 shrink-0 text-primary-700" size={20} />
                <div><h3 className="font-semibold text-primary-900">Fit & sizing help</h3><p className="mt-1 text-sm text-primary-800">Check the product specifications for measurements. Need a second opinion? Our shopping assistant can help you choose.</p></div>
              </div>
            </Card>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
                <span className="text-sm text-gray-600">({product.stock} available)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-4 mb-6">
              <Button onClick={handleAddToCart} className="flex-1" disabled={product.stock === 0}>
                <ShoppingCart size={18} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Cart</span>
              </Button>
              <Button onClick={handleBuyNow} variant="success" className="flex-1" disabled={product.stock === 0}>
                Buy Now
              </Button>
              <button
                onClick={handleAddToWishlist}
                className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 flex items-center justify-center flex-shrink-0"
              >
                <Heart size={20} className={isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
            {product.stock === 0 && (
              <Button variant="outline" className="mb-5 w-full" onClick={() => { setStockAlertSet(true); showToast('We’ll let you know when this item is back in stock.') }} disabled={stockAlertSet}>
                <Bell size={17} className="mr-2" /> {stockAlertSet ? 'Back-in-stock alert set' : 'Notify me when it is back'}
              </Button>
            )}
            <a href={`https://wa.me/233545840685?text=${encodeURIComponent(`Hi VictoryLane, I have a question about ${product.name}.`)}`} target="_blank" rel="noreferrer" className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900">
              <MessageCircle size={17} /> Ask or order on WhatsApp
            </a>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card>
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b last:border-0">
                      <dt className="font-medium text-gray-600">{key}</dt>
                      <dd className="text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            )}
          </div>
        </div>

        <ProductAiInsights productId={product._id} />
      </div>
    </div>
  )
}

export default ProductDetailPage
