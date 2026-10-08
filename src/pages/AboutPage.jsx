import Card from '../components/ui/Card'
import { ShoppingBag, Users, Award, Heart } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About VictoryLane</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted e-commerce partner in Ghana, delivering quality products and exceptional service since day one.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide Ghanaians with easy access to quality products at affordable prices,
              while delivering exceptional customer service and building lasting relationships
              with our community.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To become Ghana's most trusted and beloved e-commerce platform, known for
              reliability, quality, and putting our customers first in everything we do.
            </p>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality First</h3>
              <p className="text-sm text-gray-600">
                We ensure every product meets our high standards before reaching you.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Customer Focus</h3>
              <p className="text-sm text-gray-600">
                Your satisfaction is our priority. We listen, adapt, and improve.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Award className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Excellence</h3>
              <p className="text-sm text-gray-600">
                We strive for excellence in every aspect of our service.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Heart className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">
                Honest, transparent, and ethical in all our dealings.
              </p>
            </Card>
          </div>
        </div>

        {/* Story */}
        <Card className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              VictoryLane was born from a simple idea: make shopping easier and more accessible
              for everyone in Ghana. We noticed the challenges people face when trying to find quality
              products at fair prices, and we knew we could do better.
            </p>
            <p className="mb-4">
              Starting with a small selection of carefully curated products, we've grown to offer
              thousands of items across multiple categories. Our commitment to quality, affordability,
              and customer satisfaction has remained unchanged.
            </p>
            <p>
              Today, we serve customers across Ghana, processing hundreds of orders and helping people
              find exactly what they need. But we're just getting started. VictoryLane is more
              than a store—it's a community of shoppers who trust us to deliver on our promises.
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
            <div className="text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">99%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-primary-100 mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </Card>
      </div>
    </div>
  )
}

export default AboutPage
