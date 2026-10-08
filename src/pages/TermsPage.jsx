import Card from '../components/ui/Card'
import { FileText } from 'lucide-react'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <FileText className="mx-auto mb-4 text-primary-600" size={48} />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 22, 2026</p>
        </div>

        <Card className="prose max-w-none">
          <p className="text-gray-700 mb-6">
            Welcome to VictoryLane. By accessing and using our website and services, you agree to
            be bound by these Terms of Service. Please read them carefully.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By creating an account, placing an order, or using our services, you acknowledge that you
            have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            If you do not agree, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Eligibility</h2>
          <p className="text-gray-700 mb-4">
            You must be at least 18 years old to use our services. By using our website, you represent
            and warrant that you meet this requirement.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Registration</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>You must provide accurate, current, and complete information</li>
            <li>You are responsible for maintaining the confidentiality of your password</li>
            <li>You are responsible for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Product Information & Pricing</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>We strive to provide accurate product descriptions and images</li>
            <li>Colors may vary slightly due to monitor settings</li>
            <li>Prices are in Ghana Cedis (GHS) and subject to change without notice</li>
            <li>We reserve the right to correct pricing errors</li>
            <li>Product availability is not guaranteed until order confirmation</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Orders & Payments</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Order Placement</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>An order is not confirmed until you receive our confirmation email</li>
            <li>We reserve the right to refuse or cancel any order</li>
            <li>Orders can be cancelled within 1 hour of placement</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Payment Terms</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>All payments are processed securely through Paystack</li>
            <li>We accept Credit/Debit Cards and Mobile Money</li>
            <li>Payment must be received before order processing</li>
            <li>You authorize us to charge the payment method provided</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Shipping & Delivery</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Delivery times are estimates and not guaranteed</li>
            <li>Risk of loss transfers to you upon delivery</li>
            <li>You must provide accurate delivery information</li>
            <li>We are not liable for delays beyond our control</li>
            <li>See our Shipping Policy for detailed information</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Returns & Refunds</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>We offer a 2-day return policy for eligible items</li>
            <li>Items must be unopened, unused, and in original packaging</li>
            <li>Refunds are processed within 5-7 business days after inspection</li>
            <li>See our Returns Policy for complete details</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You agree NOT to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Use our services for any illegal purpose</li>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit viruses or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Harass, abuse, or harm others</li>
            <li>Engage in fraudulent activities</li>
            <li>Resell products for commercial purposes without authorization</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content on our website (text, images, logos, graphics) is owned by VictoryLane
            or our licensors and protected by copyright, trademark, and other laws. You may not use,
            reproduce, or distribute our content without written permission.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            To the fullest extent permitted by law:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>We are not liable for indirect, incidental, or consequential damages</li>
            <li>Our total liability shall not exceed the amount you paid for the product</li>
            <li>We are not responsible for third-party actions or content</li>
            <li>Products are sold "as is" without warranties beyond manufacturer guarantees</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">11. Indemnification</h2>
          <p className="text-gray-700 mb-4">
            You agree to indemnify and hold VictoryLane harmless from any claims, damages, or
            expenses arising from your use of our services or violation of these terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">12. Dispute Resolution</h2>
          <p className="text-gray-700 mb-4">
            These terms are governed by the laws of Ghana. Any disputes shall be resolved through:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Good faith negotiation between parties</li>
            <li>Mediation if negotiation fails</li>
            <li>Ghana courts as final jurisdiction</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">13. Modifications</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting. Continued use of our services after changes
            constitutes acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">14. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your account and access to our services immediately, without
            notice, for conduct that we believe violates these terms or is harmful to us, other users,
            or third parties.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">15. Severability</h2>
          <p className="text-gray-700 mb-4">
            If any provision of these terms is found to be invalid or unenforceable, the remaining
            provisions shall continue in full force and effect.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">16. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            For questions about these Terms of Service, contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-1"><strong>Email:</strong> legal@victorylane.com</p>
            <p className="text-gray-700 mb-1"><strong>Phone:</strong> +233545840685</p>
            <p className="text-gray-700"><strong>Address:</strong> 123 Independence Avenue, Accra, Ghana</p>
          </div>

          <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Acknowledgment:</strong> By using VictoryLane, you acknowledge that you have
              read these Terms of Service and agree to be bound by them.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TermsPage
