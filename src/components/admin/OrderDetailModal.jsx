import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { getImageUrl } from '../../lib/api'

const OrderDetailModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  if (!order) return null

  const getStatusVariant = (status) => {
    const variants = { pending: 'warning', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' }
    return variants[status] || 'default'
  }

  const handleStatusChange = (e) => {
    onStatusUpdate(order._id, e.target.value)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order ${order.orderNumber}`} size="lg">
      <div className="max-h-[70vh] overflow-y-auto space-y-6">
        {/* Status & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              value={order.status}
              onChange={handleStatusChange}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Customer Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customerName}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{order.customerEmail}</span></div>
            {order.shippingAddress?.phone && (
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.shippingAddress.phone}</span></div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Shipping Address</h4>
            <p className="text-sm">
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h4 className="font-semibold mb-3">Items ({order.items?.length || 0})</h4>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {item.image && (
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-12 h-12 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} x GH₵{item.price}</p>
                </div>
                <p className="font-semibold">GH₵{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Total */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium capitalize">{order.paymentMethod === 'momo' ? 'Mobile Money' : order.paymentMethod}</span>
          </div>
          {order.paymentReference && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Payment Reference</span>
              <span className="font-medium font-mono text-xs">{order.paymentReference}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Payment Status</span>
            <Badge variant="success" className="text-xs">{(order.paymentStatus || 'paid').toUpperCase()}</Badge>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg text-primary-600">GH₵{order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default OrderDetailModal
