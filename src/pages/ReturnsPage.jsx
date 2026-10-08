import Card from '../components/ui/Card'
import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Returns & Refunds Policy</h1>

        {/* Overview */}
        <Card className="mb-8 bg-primary-50 border border-primary-200">
          <div className="flex items-start">
            <RotateCcw className="text-primary-600 mr-4 flex-shrink-0" size={28} />
            <div>
              <h2 className="text-xl font-semibold mb-2">2-Day Return Policy</h2>
              <p className="text-gray-700">
                We offer a hassle-free 2-day return policy. If you're not satisfied with your purchase,
                you can return eligible items within 2 days of delivery for a full refund or exchange.
              </p>
            </div>
          </div>
        </Card>

        {/* Return Conditions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <div className="flex items-center mb-4">
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold">Eligible for Return</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Items in original, unopened packaging</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Unused products with all tags attached</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Defective or damaged items</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Wrong items delivered</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Items significantly different from description</span>
              </li>
            </ul>
          </Card>

          <Card>
            <div className="flex items-center mb-4">
              <XCircle className="text-red-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold">Not Eligible for Return</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Opened or used items (unless defective)</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Items without original packaging</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Personalized or customized products</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Perishable goods</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <span>Items returned after 2 days</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* How to Return */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">
                Email support@victorylane.com or call +233545840685 within 2 days
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Approval</h3>
              <p className="text-sm text-gray-600">
                Provide order number and reason for return. We'll approve if eligible
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Ship Item</h3>
              <p className="text-sm text-gray-600">
                Pack item securely and ship to our returns address
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Refund</h3>
              <p className="text-sm text-gray-600">
                Refund processed within 5-7 business days after inspection
              </p>
            </div>
          </div>
        </Card>

        {/* Shipping Costs */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Return Shipping Costs</h2>
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Free Return Shipping</h3>
                <p className="text-sm text-gray-700">
                  For defective items, wrong items, or items significantly different from description
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Customer Pays Shipping</h3>
                <p className="text-sm text-gray-700">
                  For change of mind or unwanted items (₵10 flat fee)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Refund Timeline */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Refund Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Clock className="text-primary-600 mr-3" size={20} />
              <div>
                <h3 className="font-semibold">Processing Time: 5-7 Business Days</h3>
                <p className="text-sm text-gray-600">
                  After we receive and inspect your returned item
                </p>
              </div>
            </div>
            <div className="pl-8 space-y-2 text-sm text-gray-700">
              <p>• Mobile Money: 1-2 business days after approval</p>
              <p>• Credit/Debit Card: 5-7 business days after approval</p>
              <p>• Original payment method will be used for refund</p>
            </div>
          </div>
        </Card>

        {/* Exchange Policy */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Exchange Policy</h2>
          <p className="text-gray-700 mb-4">
            If you'd prefer an exchange instead of a refund, we're happy to help! The same 2-day
            return window applies. Contact us to arrange an exchange.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Exchanges are subject to stock availability. If your desired
              replacement is out of stock, we'll offer a full refund.
            </p>
          </div>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
          <Package className="mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-3">Need to Return Something?</h2>
          <p className="text-primary-100 mb-6">
            Our customer service team is here to help make the process smooth and easy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@victorylane.com"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+233123456789"
              className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
            >
              Call +233545840685
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ReturnsPage
