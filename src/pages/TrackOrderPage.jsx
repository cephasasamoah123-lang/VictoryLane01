import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react'
import api from '../lib/api'

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams()
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('order') || '')
  const [orderData, setOrderData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered']

  const buildTimeline = (order) => {
    const stepLabels = {
      pending: 'Order Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
    }
    const currentIndex = statusSteps.indexOf(order.status)
    if (order.status === 'cancelled') {
      return [
        { status: 'Order Placed', date: new Date(order.createdAt).toLocaleString(), completed: true },
        { status: 'Cancelled', date: new Date(order.updatedAt).toLocaleString(), completed: true },
      ]
    }
    return statusSteps.map((step, i) => ({
      status: stepLabels[step],
      date: i <= currentIndex ? (i === 0 ? new Date(order.createdAt).toLocaleString() : new Date(order.updatedAt).toLocaleString()) : 'Pending',
      completed: i <= currentIndex,
    }))
  }

  // Auto-track if order number came from URL (redirected after checkout)
  useEffect(() => {
    const orderFromUrl = searchParams.get('order')
    if (orderFromUrl) {
      setTrackingNumber(orderFromUrl)
      fetchOrder(orderFromUrl)
    }
  }, [])

  const fetchOrder = async (number) => {
    setError('')
    setOrderData(null)
    setLoading(true)
    try {
      const res = await api.get(`/orders/track/${number}`)
      const order = res.data?.order
      if (!order) throw new Error('Order not found')
      setOrderData({
        orderNumber: order.orderNumber,
        status: order.status,
        timeline: buildTimeline(order),
        items: order.items || [],
        deliveryAddress: order.city || 'Ghana',
        createdAt: order.createdAt,
        total: order.total,
      })
    } catch {
      setError('Order not found. Please check your order number and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = (e) => {
    e.preventDefault()
    fetchOrder(trackingNumber)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

        {/* Tracking Form */}
        <Card className="mb-8">
          <form onSubmit={handleTrack}>
            <div className="flex gap-4">
              <Input
                placeholder="Enter your order/tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>{loading ? 'Tracking...' : 'Track Order'}</Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your tracking number was sent to your email after order confirmation
            </p>
          </form>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-8 bg-red-50 border border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {/* Order Status */}
        {orderData && (
          <>
            {/* Order Header */}
            <Card className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Order #{orderData.orderNumber}
                  </h2>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    {orderData.deliveryAddress}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
                    orderData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    orderData.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <Truck size={16} className="mr-2" />
                    {orderData.status?.charAt(0).toUpperCase() + orderData.status?.slice(1)}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4">
                {orderData.timeline.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {step.completed ? (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-white" size={24} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 pb-8 border-l-2 border-gray-300 pl-4 -ml-px">
                      <h3 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.status}
                      </h3>
                      <p className="text-sm text-gray-600">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Order Items */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-semibold">₵{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Help Section */}
        {!orderData && (
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex items-start">
              <Package className="text-blue-600 mr-4 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Can't find your tracking number? Check your email or contact customer service.
                </p>
                <a href="/help" className="text-blue-600 font-semibold hover:underline">
                  Contact Support →
                </a>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TrackOrderPage
