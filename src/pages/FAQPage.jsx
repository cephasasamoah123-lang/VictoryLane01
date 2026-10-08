import { useState } from 'react'
import Card from '../components/ui/Card'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqCategories = [
    {
      category: 'General Questions',
      questions: [
        {
          q: 'What is VictoryLane?',
          a: 'VictoryLane is Ghana\'s trusted e-commerce platform offering a wide range of quality products at affordable prices with exceptional customer service.'
        },
        {
          q: 'How do I create an account?',
          a: 'Click "Register" in the top menu, fill in your details (name, email, password), and verify your email address. You can then start shopping immediately.'
        },
        {
          q: 'Do I need an account to shop?',
          a: 'You can browse products without an account, but you need to register to make purchases and track your orders.'
        },
        {
          q: 'Is my information secure?',
          a: 'Yes! We use industry-standard encryption and secure payment processing through Paystack. Your personal and payment information is always protected.'
        }
      ]
    },
    {
      category: 'Orders & Payments',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept Credit/Debit Cards (Visa, Mastercard) and Mobile Money (MTN, Vodafone, AirtelTigo) through our secure Paystack payment gateway.'
        },
        {
          q: 'Is it safe to pay online?',
          a: 'Absolutely! All payments are processed through Paystack, a PCI-DSS compliant payment gateway with bank-level security. Your payment details are never stored on our servers.'
        },
        {
          q: 'Can I cancel or modify my order?',
          a: 'Orders can be cancelled or modified within 1 hour of placement. Contact customer service immediately at +233545840685 or support@victorylane.com.'
        },
        {
          q: 'Do you offer cash on delivery?',
          a: 'Currently, we only accept online payments through Paystack to ensure secure transactions for both you and us.'
        },
        {
          q: 'What currency do you use?',
          a: 'All prices are in Ghana Cedis (GHS/₵).'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'How much does shipping cost?',
          a: 'FREE shipping on orders over ₵100. Orders under ₵100 have a flat ₵10 shipping fee to any location in Ghana.'
        },
        {
          q: 'How long does delivery take?',
          a: 'Greater Accra: 1-2 business days. Major cities: 2-3 business days. Other regions: 3-5 business days.'
        },
        {
          q: 'Do you deliver nationwide?',
          a: 'Yes! We deliver to all 16 regions of Ghana.'
        },
        {
          q: 'How can I track my order?',
          a: 'You\'ll receive a tracking number via email/SMS once your order ships. Use our Track Order page or click the link in your notification.'
        },
        {
          q: 'What if I\'m not home during delivery?',
          a: 'Our courier will call before delivery. If you\'re unavailable, you can reschedule or have someone receive it on your behalf.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 2-day return policy. Items must be unopened, unused, and in original packaging. Contact us within 2 days of delivery.'
        },
        {
          q: 'How do I return an item?',
          a: 'Contact customer service at support@victorylane.com or +233545840685 with your order number and reason for return. We\'ll guide you through the process.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive and inspect your returned item. The refund goes to your original payment method.'
        },
        {
          q: 'Who pays for return shipping?',
          a: 'We cover return shipping for defective or wrong items. For change of mind, there\'s a ₵10 return shipping fee.'
        },
        {
          q: 'Can I exchange an item instead of returning it?',
          a: 'Yes! Contact us within 2 days to arrange an exchange, subject to stock availability.'
        }
      ]
    },
    {
      category: 'Products & Stock',
      questions: [
        {
          q: 'Are all products in stock?',
          a: 'We update stock levels in real-time. If an item shows "In Stock," it\'s available for immediate purchase.'
        },
        {
          q: 'What if an item is out of stock?',
          a: 'You can submit a custom request, and we\'ll notify you when it\'s back in stock or find a similar alternative.'
        },
        {
          q: 'Are your products genuine?',
          a: 'Yes! We only sell authentic, quality products from trusted suppliers. Every item is verified before listing.'
        },
        {
          q: 'Can I request a specific product?',
          a: 'Absolutely! Use our Custom Request feature to tell us what you need, and we\'ll source it for you.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email to reset it.'
        },
        {
          q: 'Can I change my email address?',
          a: 'Yes! Log in, go to "My Account" > "Profile" and update your email address. You\'ll need to verify the new email.'
        },
        {
          q: 'How do I delete my account?',
          a: 'Contact customer service at support@victorylane.com to request account deletion. Note that this action is permanent.'
        },
        {
          q: 'Why do I need to verify my email?',
          a: 'Email verification ensures account security and allows us to send you important order updates.'
        }
      ]
    }
  ]

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto mb-4 text-primary-600" size={48} />
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find quick answers to common questions about shopping with us
          </p>
        </div>

        {/* Quick Links */}
        <Card className="mb-8">
          <h3 className="font-semibold mb-4">Jump to:</h3>
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((cat, index) => (
              <a
                key={index}
                href={`#category-${index}`}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
              >
                {cat.category}
              </a>
            ))}
          </div>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => (
            <Card key={catIndex} id={`category-${catIndex}`}>
              <h2 className="text-2xl font-bold mb-6 text-primary-600">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const index = `${catIndex}-${qIndex}`
                  const isOpen = openIndex === index

                  return (
                    <div
                      key={qIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(catIndex, qIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="text-primary-600 flex-shrink-0 ml-4" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400 flex-shrink-0 ml-4" size={20} />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-white">
                          <p className="text-gray-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
          <p className="text-primary-100 mb-6">
            Our customer service team is here to help you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/help"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Visit Help Center
            </a>
            <a
              href="/contact"
              className="inline-block bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FAQPage
