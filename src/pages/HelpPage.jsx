import { useState } from 'react'
import Card from '../components/ui/Card'
import { Search, MessageCircle, Phone, Mail, Clock, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showChat, setShowChat] = useState(false)

  const helpTopics = [
    {
      title: 'Orders & Payments',
      topics: [
        { question: 'How do I place an order?', answer: 'Browse products, add items to cart, proceed to checkout, fill in your details, and complete payment via Paystack.' },
        { question: 'What payment methods do you accept?', answer: 'We accept Credit/Debit Cards (Visa, Mastercard) and Mobile Money (MTN, Vodafone, AirtelTigo) through Paystack.' },
        { question: 'Is my payment secure?', answer: 'Yes! All payments are processed through Paystack, a PCI-DSS compliant payment gateway with bank-level security.' },
        { question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 1 hour of placement. Contact customer service immediately.' },
      ]
    },
    {
      title: 'Shipping & Delivery',
      topics: [
        { question: 'How long does delivery take?', answer: 'Delivery within Accra takes 1-2 business days. Outside Accra takes 3-5 business days.' },
        { question: 'What are the shipping costs?', answer: 'Free shipping on orders over ₵100. Orders under ₵100 have a flat ₵10 shipping fee.' },
        { question: 'How can I track my order?', answer: 'Once shipped, you\'ll receive a tracking number via email/SMS. Use our Track Order page to monitor your delivery.' },
        { question: 'Do you deliver nationwide?', answer: 'Yes, we deliver to all regions in Ghana.' },
      ]
    },
    {
      title: 'Returns & Refunds',
      topics: [
        { question: 'What is your return policy?', answer: 'We offer a 2-day return policy for unopened, unused items in original packaging.' },
        { question: 'How do I initiate a return?', answer: 'Contact customer service with your order number and reason for return within 2 days of delivery.' },
        { question: 'When will I receive my refund?', answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.' },
        { question: 'Are return shipping costs covered?', answer: 'Return shipping is free for defective/wrong items. Customer pays return shipping for change of mind.' },
      ]
    },
    {
      title: 'Account & Security',
      topics: [
        { question: 'How do I create an account?', answer: 'Click "Register" in the top menu, fill in your details, and verify your email address.' },
        { question: 'I forgot my password', answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.' },
        { question: 'How do I update my profile?', answer: 'Log in, go to "My Account" > "Profile" and update your information.' },
        { question: 'Is my personal information safe?', answer: 'Yes, we use industry-standard encryption and never share your data with third parties.' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">
            Find answers to your questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </Card>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Phone className="text-primary-600" size={28} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Mon-Sat, 8am-6pm</p>
            <a href="tel:+233123456789" className="text-primary-600 font-semibold">
              +233545840685
            </a>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail className="text-primary-600" size={28} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">Response within 24 hours</p>
            <a href="mailto:support@victorylane.com" className="text-primary-600 font-semibold">
              support@victorylane.com
            </a>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="text-primary-600" size={28} />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-3">Available 8am-6pm</p>
            <button
              onClick={() => setShowChat(true)}
              className="text-primary-600 font-semibold hover:underline"
            >
              Start Chat
            </button>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {helpTopics.map((section, index) => (
            <Card key={index}>
              <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
              <div className="space-y-6">
                {section.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="border-b border-gray-200 pb-4 last:border-0">
                    <h3 className="font-semibold text-lg mb-2">{topic.question}</h3>
                    <p className="text-gray-600">{topic.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Link to="/track-order">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">Track Order</h3>
              <p className="text-sm text-gray-600">Check your order status</p>
            </Card>
          </Link>
          <Link to="/returns">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">Returns & Refunds</h3>
              <p className="text-sm text-gray-600">Learn about our return policy</p>
            </Card>
          </Link>
          <Link to="/shipping">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-lg mb-2">Shipping Info</h3>
              <p className="text-sm text-gray-600">Delivery times and costs</p>
            </Card>
          </Link>
        </div>

        {/* Live Chat Modal */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-auto max-h-[90vh] overflow-y-auto">
              {/* Chat Header */}
              <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="mr-3" size={24} />
                  <div>
                    <h3 className="font-semibold">Live Chat Support</h3>
                    <p className="text-xs text-primary-100">We're online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="hover:bg-primary-700 p-1 rounded"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Chat Options */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700 mb-4">
                  Choose how you'd like to chat with us:
                </p>

                {/* WhatsApp Option */}
                <a
                  href="https://wa.me/233123456789?text=Hi,%20I%20need%20help%20with%20my%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp Chat</h4>
                    <p className="text-sm text-gray-600">Chat with us on WhatsApp</p>
                  </div>
                </a>

                {/* Email Option */}
                <a
                  href="mailto:support@victorylane.com"
                  className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-600">Send us an email</p>
                  </div>
                </a>

                {/* Phone Option */}
                <a
                  href="tel:+233123456789"
                  className="flex items-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-sm text-gray-600">+233545840685</p>
                  </div>
                </a>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Available Mon-Sat, 8:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HelpPage
