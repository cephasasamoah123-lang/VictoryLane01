import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-primary-100 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">
              <span className="text-white">Victory</span> <span className="italic text-accent-400">Lane</span>
            </h3>
            <p className="text-sm mb-4">
              Your one-stop destination for all your shopping needs. Quality products, great prices, and exceptional service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-accent-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-accent-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-accent-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-accent-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-accent-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/custom-requests" className="hover:text-accent-400 transition-colors">
                  Custom Requests
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-accent-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-accent-400 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-accent-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-accent-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-accent-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-accent-500 px-4 py-2 rounded-r-md hover:bg-accent-600 transition-colors"
              >
                <Mail size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {currentYear} VictoryLane. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-accent-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-accent-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-accent-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
