import Card from '../components/ui/Card'
import { Shield } from 'lucide-react'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="mx-auto mb-4 text-primary-600" size={48} />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 22, 2026</p>
        </div>

        <Card className="prose max-w-none">
          <p className="text-gray-700 mb-6">
            At VictoryLane, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
          <p className="text-gray-700 mb-4">
            When you register, place an order, or interact with our services, we may collect:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Name and contact information (email, phone number)</li>
            <li>Delivery address</li>
            <li>Payment information (processed securely through Paystack)</li>
            <li>Order history and preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent on site</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Process and fulfill your orders</li>
            <li>Communicate about your orders and account</li>
            <li>Provide customer support</li>
            <li>Send promotional emails (you can opt-out anytime)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 mb-4">We DO NOT sell your personal information. We may share information with:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li><strong>Payment Processors:</strong> Paystack processes payments securely</li>
            <li><strong>Delivery Partners:</strong> To fulfill your orders</li>
            <li><strong>Service Providers:</strong> Who help us operate our business</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>SSL encryption for data transmission</li>
            <li>Secure payment processing through Paystack</li>
            <li>Regular security audits</li>
            <li>Limited access to personal information</li>
          </ul>
          <p className="text-gray-700 mb-4">
            However, no method of transmission over the internet is 100% secure. We cannot guarantee
            absolute security but we strive to use commercially acceptable means to protect your data.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          <p className="text-gray-700 mb-4">
            To exercise these rights, contact us at privacy@victorylane.com
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies to enhance your experience, remember your preferences, and analyze site traffic.
            You can control cookies through your browser settings. See our Cookie Policy for more details.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Third-Party Links</h2>
          <p className="text-gray-700 mb-4">
            Our website may contain links to third-party sites. We are not responsible for their privacy
            practices. We encourage you to read their privacy policies.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our services are not intended for children under 13. We do not knowingly collect information
            from children. If you believe we have inadvertently collected such data, contact us immediately.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your information for as long as necessary to provide services and comply with legal
            obligations. You can request deletion of your account and data at any time.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy periodically. We'll notify you of significant changes via
            email or a prominent notice on our website. Continued use of our services after changes
            constitutes acceptance.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">11. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy or our data practices, contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-1"><strong>Email:</strong> privacy@victorylane.com</p>
            <p className="text-gray-700 mb-1"><strong>Phone:</strong> +233545840685</p>
            <p className="text-gray-700"><strong>Address:</strong> 123 Independence Avenue, Accra, Ghana</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPage
