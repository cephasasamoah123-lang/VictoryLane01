import Card from '../components/ui/Card'
import { Cookie } from 'lucide-react'

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8">
          <Cookie className="mx-auto mb-4 text-primary-600" size={48} />
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: January 22, 2026</p>
        </div>

        <Card className="prose max-w-none">
          <p className="text-gray-700 mb-6">
            This Cookie Policy explains how VictoryLane uses cookies and similar technologies
            when you visit our website. It describes what these technologies are, why we use them,
            and your choices regarding their use.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
          <p className="text-gray-700 mb-4">
            Cookies are small text files stored on your device (computer, tablet, or mobile) when
            you visit a website. They help websites remember your preferences and improve your
            browsing experience.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Types of Cookies We Use</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies (Required)</h3>
          <p className="text-gray-700 mb-2">
            These cookies are necessary for the website to function properly. They enable core
            functionality such as:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>User authentication and account access</li>
            <li>Shopping cart functionality</li>
            <li>Security features</li>
            <li>Load balancing</li>
          </ul>
          <p className="text-sm text-gray-600 mb-4">
            <em>You cannot opt-out of essential cookies as the website won't work without them.</em>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Functional Cookies</h3>
          <p className="text-gray-700 mb-2">
            These cookies remember your preferences and choices to provide enhanced features:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Language preferences</li>
            <li>Region selection</li>
            <li>Display preferences (theme, layout)</li>
            <li>Previously viewed products</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies</h3>
          <p className="text-gray-700 mb-2">
            These cookies help us understand how visitors interact with our website:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Number of visitors and page views</li>
            <li>Pages visited and time spent</li>
            <li>Traffic sources</li>
            <li>Error tracking and performance monitoring</li>
          </ul>
          <p className="text-sm text-gray-600 mb-4">
            <em>This data is aggregated and anonymous.</em>
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Marketing Cookies</h3>
          <p className="text-gray-700 mb-2">
            These cookies track your browsing activity to show you relevant advertisements:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Personalized product recommendations</li>
            <li>Targeted advertising on other websites</li>
            <li>Campaign effectiveness measurement</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Third-Party Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use services from trusted third parties that may set cookies on your device:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Payment Processing</h4>
            <p className="text-sm text-gray-700">
              <strong>Paystack:</strong> Processes payments securely. May set cookies for fraud
              prevention and transaction processing.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Analytics</h4>
            <p className="text-sm text-gray-700">
              <strong>Google Analytics:</strong> Tracks website usage and performance. Data is
              anonymized and aggregated.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Social Media</h4>
            <p className="text-sm text-gray-700">
              <strong>Social Platforms:</strong> Enable social sharing features. May track your
              interactions with our content.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. How Long Do Cookies Last?</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Session Cookies</h3>
          <p className="text-gray-700 mb-4">
            Temporary cookies that are deleted when you close your browser. Used for shopping cart
            and login sessions.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Persistent Cookies</h3>
          <p className="text-gray-700 mb-4">
            Remain on your device for a set period (from days to years) or until you manually delete
            them. Used for remembering your preferences and login status.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Cookie Choices</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Browser Controls</h3>
          <p className="text-gray-700 mb-4">
            Most browsers allow you to control cookies through settings:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Block all cookies</li>
            <li>Allow only first-party cookies</li>
            <li>Delete cookies after each session</li>
            <li>Be notified when cookies are set</li>
          </ul>

          <p className="text-sm text-gray-600 mb-4">
            <strong>Note:</strong> Blocking cookies may affect website functionality and your user experience.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Opt-Out Links</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Google Analytics Opt-Out</a></li>
            <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Digital Advertising Alliance Opt-Out</a></li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Browser-Specific Instructions</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Google Chrome</h4>
              <p className="text-sm text-gray-700">
                Settings → Privacy and Security → Cookies and other site data
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Mozilla Firefox</h4>
              <p className="text-sm text-gray-700">
                Options → Privacy & Security → Cookies and Site Data
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Safari</h4>
              <p className="text-sm text-gray-700">
                Preferences → Privacy → Manage Website Data
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Microsoft Edge</h4>
              <p className="text-sm text-gray-700">
                Settings → Privacy, search, and services → Cookies and site permissions
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Mobile Devices</h2>
          <p className="text-gray-700 mb-4">
            Mobile devices may have different privacy controls. Check your device settings or app
            permissions to manage cookies and tracking.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Do Not Track Signals</h2>
          <p className="text-gray-700 mb-4">
            Some browsers include "Do Not Track" features. Currently, there is no industry standard
            for how to respond to these signals. We will update this policy if standards are established.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Updates to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Cookie Policy to reflect changes in our practices or for legal reasons.
            Changes will be posted on this page with an updated "Last updated" date.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about our use of cookies, contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-1"><strong>Email:</strong> privacy@victorylane.com</p>
            <p className="text-gray-700 mb-1"><strong>Phone:</strong> +233545840685</p>
            <p className="text-gray-700"><strong>Address:</strong> 123 Independence Avenue, Accra, Ghana</p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Your Consent:</strong> By continuing to use our website, you consent to our
              use of cookies as described in this policy. You can withdraw consent by adjusting
              your browser settings or contacting us.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CookiesPage
