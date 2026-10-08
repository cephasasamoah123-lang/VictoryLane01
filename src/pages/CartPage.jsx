import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import useCartStore from '../store/cartStore'
import { getImageUrl } from '../lib/api'

const CartPage = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, discount } = useCartStore()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      if (confirm('Remove this item from cart?')) {
        removeItem(productId)
      }
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const subtotal = getSubtotal()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1
  const total = getTotal() + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className="text-center max-w-md">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link to="/products">
            <Button>Shop Now</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 sm:gap-4 py-3 sm:py-4 border-b last:border-0">
                  <img
                    src={getImageUrl(item.images?.[0] || item.image) || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-lg mb-0.5 sm:mb-1 truncate">{item.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">{item.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base sm:text-xl font-bold text-primary-600">
                          ₵{(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">₵{item.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 mt-1">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="px-2 sm:px-3 py-1 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 sm:px-4 py-1 border-x text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="px-2 sm:px-3 py-1 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₵{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₵{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">₵{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary-600">₵{total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  Add ₵{(100 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              <Link to="/checkout">
                <Button fullWidth size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link to="/products">
                <Button fullWidth variant="outline" className="mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
