import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart, Heart } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import useWishlistStore from '../../store/wishlistStore'
import useCartStore from '../../store/cartStore'
import { getImageUrl } from '../../lib/api'
import useToastStore from '../../store/toastStore'

const WishlistPage = () => {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)
  const showToast = useToastStore((state) => state.showToast)

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    showToast('Added to cart!')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className="text-center max-w-md">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Add products you love to your wishlist</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({items.length} items)</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item._id} padding={false} className="overflow-hidden">
              <Link to={`/products/${item._id}`}>
                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-xl font-bold text-primary-600 mb-4">₵{item.price}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddToCart(item)} className="flex-1">
                    <ShoppingCart size={16} className="mr-1" />
                    Add to Cart
                  </Button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage
