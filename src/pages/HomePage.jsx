 import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Truck, Shield, HeadphonesIcon } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import api, { getImageUrl } from '../lib/api'
import FashionPromo from '../components/promo/FashionPromo'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₵100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Dedicated customer service',
  },
  {
    icon: ShoppingBag,
    title: '2-Days Return',
    description: '2-day return policy',
  },
]

const occasions = [
  { title: 'Workwear', copy: 'Polished pieces for every weekday.', search: 'blazer', tone: 'from-primary-800 to-primary-600' },
  { title: 'Weekend', copy: 'Easy looks made for going out.', search: 'casual', tone: 'from-primary-600 to-primary-400' },
  { title: 'Events', copy: 'Statement styles for your next moment.', search: 'dress', tone: 'from-accent-700 to-accent-500' },
  { title: 'Gifting', copy: 'Thoughtful finds for every celebration.', search: 'gift', tone: 'from-primary-900 to-accent-700' },
]

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?limit=4&sort=rating'),
          api.get('/categories'),
        ])
        setFeaturedProducts(productsRes.data?.products || [])
        setCategories(categoriesRes.data?.categories || [])
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }
    fetchData()
  }, [])

  // "Shop by Category" should be a small set of top-level entry points, not every
  // leaf category (there are 90+ of those, and several share a name across groups,
  // e.g. "Jackets" exists under both Men and Women). Collapse to one tile per group,
  // using that group's lowest-SortOrder category as the representative image.
  const allowedDepartments = ['Women', 'Men', 'Kids', 'Unisex', 'Accessories', 'Jewelry']
  const groupTiles = categories.reduce((acc, cat) => {
    const g = allowedDepartments.includes(cat.group) ? cat.group : 'Unisex'
    if (!acc[g] || (cat.order ?? 0) < (acc[g].order ?? 0)) acc[g] = cat
    return acc
  }, {})
  const categoryTiles = Object.entries(groupTiles)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, cat]) => ({ ...cat, groupName }))
    .slice(0, 8)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative isolate min-h-[34rem] overflow-hidden bg-primary-900 text-white">
        <FashionPromo />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-primary-950/95 via-primary-900/82 to-primary-950/45" />
        <div className="pointer-events-none absolute -top-24 -right-24 z-[2] h-96 w-96 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 z-[2] h-80 w-80 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="container-custom relative z-[3] flex min-h-[34rem] items-center py-14 sm:py-20 lg:py-24">
            <div className="max-w-xl">
              <span className="eyebrow text-accent-300 mb-4">
                Created for you
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] mb-4 sm:mb-6 text-primary-100">
                Shop the <em className="bg-gradient-to-r from-accent-300 via-accent-400 to-primary-300 bg-clip-text italic text-transparent">latest trends</em>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-primary-100 max-w-lg">
                Discover amazing products at unbeatable prices. Quality guaranteed, delivered across Ghana.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/products">
                  <Button size="lg" variant="accent" className="border-0 bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg shadow-primary-950/30 hover:from-primary-400 hover:to-accent-400 focus:ring-accent-300">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/custom-requests">
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-300 text-white hover:bg-white/10">
                    Custom Request
                  </Button>
                </Link>
              </div>
          </div>
          </div>
      </section>

      <section className="py-12 sm:py-16 bg-primary-800 text-white">
        <div className="container-custom flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow text-accent-300 mb-3">Seasonal edit</span>
            <h2 className="font-display text-3xl sm:text-4xl font-medium">Fresh styles, just landed.</h2>
            <p className="mt-2 text-primary-100">Explore the pieces everyone will be asking about this season.</p>
          </div>
          <div className="flex flex-wrap gap-3"><Link to="/products?sort=newest"><Button variant="accent" size="lg">Shop new arrivals</Button></Link><Link to="/style-quiz"><Button variant="outline" size="lg" className="border-primary-200 bg-white/5 text-white hover:bg-white/10">Take the style quiz</Button></Link></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-accent-200 hover:bg-accent-50/40 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center">
                    <feature.icon className="text-accent-600" size={22} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-12">
            <span className="eyebrow justify-center mb-3">Shop your way</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium">Shop by occasion</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {occasions.map((occasion) => (
              <Link key={occasion.title} to={`/products?search=${encodeURIComponent(occasion.search)}`} className={`group rounded-xl bg-gradient-to-br ${occasion.tone} p-6 text-white shadow-sm transition-transform hover:-translate-y-1`}>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-accent-200">Shop this look</p>
                <h3 className="mt-8 font-display text-2xl font-medium">{occasion.title}</h3>
                <p className="mt-2 text-sm text-white/80">{occasion.copy}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-accent-200">Discover the edit →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14">
            <span className="eyebrow justify-center mb-3">Browse</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoryTiles.map((category) => (
              <Link key={category.groupName} to={`/products?group=${encodeURIComponent(category.groupName)}`} className="group">
                <div className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-sm">
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.groupName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-display font-medium text-lg text-white">{category.groupName}</h3>
                    <span className="text-xs text-accent-300 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">Shop now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10 sm:mb-14">
            <div>
              <span className="eyebrow mb-3">Handpicked</span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium">Featured Products</h2>
            </div>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <Link key={product._id} to={`/products/${product._id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full" padding={false}>
                  <div className="relative overflow-hidden">
                    {i === 0 && (
                      <span className="absolute top-3 left-3 z-10 bg-accent-500 text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                        Bestseller
                      </span>
                    )}
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-primary-900/90 text-white text-center text-sm font-medium py-2.5">
                      Quick view
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-display font-medium text-lg mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-display text-xl font-semibold text-primary-800">
                        ₵{product.price}
                      </span>
                      <div className="flex items-center">
                        <span className="text-accent-500">★</span>
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-base sm:text-xl text-primary-100 mb-6 sm:mb-8">
            Submit a custom request and we'll help you find the perfect product
          </p>
          <Link to="/custom-requests">
            <Button size="lg" variant="accent">
              Make a Custom Request
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14">
            <span className="eyebrow justify-center mb-3">Reviews</span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium">What shoppers say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ama Owusu', location: 'Accra', quote: 'The quality is far better than I expected and delivery to East Legon was quick. My go-to for gifts now.' },
              { name: 'Kwabena Mensah', location: 'Kumasi', quote: 'Mobile Money checkout made this so easy. Customer service actually replies fast when I had a sizing question.' },
              { name: 'Efua Asante', location: 'Takoradi', quote: 'I submitted a custom request for a fabric I couldn\u2019t find anywhere else and they sourced it in days.' },
            ].map((t) => (
              <Card key={t.name} className="border-gray-100">
                <div className="text-accent-400 mb-3 text-sm">★★★★★</div>
                <p className="text-gray-700 mb-5 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-800 font-display font-medium flex items-center justify-center text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          <Card className="bg-gray-50 border-gray-100">
            <div className="text-center max-w-2xl mx-auto py-4">
              <h2 className="font-display text-2xl sm:text-3xl font-medium mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600 mb-6">
                Get the latest updates on new products and exclusive offers
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <Button type="submit" variant="accent">Subscribe</Button>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default HomePage
