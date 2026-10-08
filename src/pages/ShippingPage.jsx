import Card from '../components/ui/Card'
import { Truck, MapPin, Clock, Package, DollarSign } from 'lucide-react'

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Shipping Information</h1>

        {/* Overview */}
        <Card className="mb-8 bg-primary-50 border border-primary-200">
          <div className="flex items-start">
            <Truck className="text-primary-600 mr-4 flex-shrink-0" size={28} />
            <div>
              <h2 className="text-xl font-semibold mb-2">Nationwide Delivery</h2>
              <p className="text-gray-700">
                We deliver to all regions in Ghana! Fast, reliable shipping with real-time tracking
                for every order.
              </p>
            </div>
          </div>
        </Card>

        {/* Shipping Costs */}
        <Card className="mb-8">
          <div className="flex items-center mb-6">
            <DollarSign className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">Shipping Costs</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-3">
                <Package className="text-green-600 mr-2" size={20} />
                <h3 className="font-semibold text-lg">FREE Shipping</h3>
              </div>
              <p className="text-gray-700 mb-2">Orders over ₵100</p>
              <p className="text-sm text-gray-600">
                Enjoy free delivery on all orders above ₵100 to any location in Ghana
              </p>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-3">
                <Truck className="text-blue-600 mr-2" size={20} />
                <h3 className="font-semibold text-lg">Standard Shipping</h3>
              </div>
              <p className="text-gray-700 mb-2">₵10 flat rate</p>
              <p className="text-sm text-gray-600">
                For orders under ₵100 - affordable flat rate shipping nationwide
              </p>
            </div>
          </div>
        </Card>

        {/* Delivery Times */}
        <Card className="mb-8">
          <div className="flex items-center mb-6">
            <Clock className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">Delivery Times</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Greater Accra Region</h3>
              <p className="text-gray-700 mb-1">1-2 Business Days</p>
              <p className="text-sm text-gray-600">
                Fast delivery within Accra and surrounding areas
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Major Cities</h3>
              <p className="text-gray-700 mb-1">2-3 Business Days</p>
              <p className="text-sm text-gray-600">
                Kumasi, Takoradi, Tamale, Cape Coast, and other major cities
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Other Regions</h3>
              <p className="text-gray-700 mb-1">3-5 Business Days</p>
              <p className="text-sm text-gray-600">
                All other locations across Ghana
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Delivery times are estimates and may vary during peak seasons,
              public holidays, or due to unforeseen circumstances.
            </p>
          </div>
        </Card>

        {/* Delivery Areas */}
        <Card className="mb-8">
          <div className="flex items-center mb-6">
            <MapPin className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold">We Deliver To</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Greater Accra</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Accra Central</li>
                <li>• Tema</li>
                <li>• Madina</li>
                <li>• Kasoa</li>
                <li>• All surrounding areas</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Ashanti Region</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Kumasi</li>
                <li>• Obuasi</li>
                <li>• Ejisu</li>
                <li>• Mampong</li>
                <li>• All surrounding areas</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Other Regions</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Western Region</li>
                <li>• Central Region</li>
                <li>• Northern Region</li>
                <li>• Eastern Region</li>
                <li>• All 16 regions</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Order Processing */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Processing</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Order Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email/SMS confirmation immediately after placing your order
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Processing</h3>
                <p className="text-sm text-gray-600">
                  Orders are processed within 24 hours (Monday-Friday)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shipping Notification</h3>
                <p className="text-sm text-gray-600">
                  Receive tracking number when your order ships
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-primary-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Delivery</h3>
                <p className="text-sm text-gray-600">
                  Our courier will contact you before delivery
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tracking */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
          <p className="text-gray-700 mb-4">
            Track your order in real-time from our warehouse to your doorstep. Once your order
            is shipped, you'll receive a tracking number via email and SMS.
          </p>
          <a
            href="/track-order"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Track Your Order
          </a>
        </Card>

        {/* FAQs */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Shipping FAQs</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Do you ship on weekends?</h3>
              <p className="text-sm text-gray-600">
                Orders are processed Monday-Friday. Weekend orders will be processed on Monday.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Can I change my delivery address?</h3>
              <p className="text-sm text-gray-600">
                Contact customer service within 1 hour of placing your order to change the address.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">What if I'm not home during delivery?</h3>
              <p className="text-sm text-gray-600">
                Our courier will call you before delivery. If you're unavailable, you can reschedule
                or have someone receive it on your behalf.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How can I contact the courier?</h3>
              <p className="text-sm text-gray-600">
                The courier's contact number will be included in your shipping notification SMS.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ShippingPage
