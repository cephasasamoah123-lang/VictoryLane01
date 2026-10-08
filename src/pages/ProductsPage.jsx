import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, Grid, List, Loader, SlidersHorizontal } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import api, { getImageUrl } from '../lib/api'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    group: searchParams.get('group') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  })
  const [sortBy, setSortBy] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('group') || 'All')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  const departments = ['All', 'Women', 'Men', 'Kids', 'Unisex', 'Accessories', 'Jewelry']

  const selectDepartment = (department) => {
    setSelectedDepartment(department)
    setSelectedCategory('')
    setFilters((prev) => ({
      ...prev,
      category: '',
      group: department === 'All' ? '' : department,
    }))
    setSearchParams(department === 'All' ? {} : { group: department })
  }

  const selectCategory = (slug) => {
    setSelectedCategory(slug)
    setFilters((prev) => ({
      ...prev,
      category: slug,
      group: '',
    }))
    setSearchParams({ category: slug })
  }

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data?.categories || [])
    }).catch(() => {})
  }, [])

  // Update filters when URL parameters change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || ''
    const groupFromUrl = searchParams.get('group') || ''
    const searchFromUrl = searchParams.get('search') || ''

    setFilters(prev => ({
      ...prev,
      category: categoryFromUrl,
      group: groupFromUrl,
      search: searchFromUrl,
    }))
  }, [searchParams])

  // Fetch products when filters or sort change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filters.category) params.set('category', filters.category)
        if (filters.group) params.set('group', filters.group)
        if (filters.search) params.set('search', filters.search)
        if (filters.minPrice) params.set('minPrice', filters.minPrice)
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
        if (filters.inStock) params.set('inStock', 'true')
        if (sortBy !== 'featured') params.set('sort', sortBy)

        const response = await api.get(`/products?${params.toString()}`)
        setProducts(response.data?.products || [])
        setTotal(response.data?.total || 0)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filters, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'group' && value ? { category: '' } : {}),
      ...(key === 'category' && value ? { group: '' } : {}),
    }))
  }

  const getCategoryName = () => {
    if (filters.category) {
      const found = categories.find(c => c.Slug === filters.category)
      return found?.Name || 'Products'
    }
    if (selectedDepartment !== 'All') return selectedDepartment
    return 'All Products'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{getCategoryName()}</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {products.length} of {total} products
          </p>
        </div>

        <div className="mb-6 overflow-x-auto pb-3">
          <div className="flex gap-2 min-w-max">
            {departments.map((department) => (
              <button
                key={department}
                type="button"
                onClick={() => selectDepartment(department)}
                className={`px-4 py-2 rounded-full text-sm border transition ${selectedDepartment === department ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg mb-3 shadow-sm"
            >
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <SlidersHorizontal size={18} />
                Filters
              </span>
              {filtersOpen ? <span className="text-gray-400 text-sm">Hide</span> : <span className="text-gray-400 text-sm">Show</span>}
            </button>
            <Card className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setFilters({
                    category: '',
                    group: '',
                    search: '',
                    minPrice: '',
                    maxPrice: '',
                    inStock: false,
                  })
                  setSearchParams({})
                }}
              >
                Clear Filters
              </Button>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="animate-spin text-primary-600" size={32} />
              </div>
            ) : products.length === 0 ? (
              <Card className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </Card>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {products.map((product) => (
                  <Link key={product._id} to={`/products/${product._id}`}>
                    <Card className={`overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`} padding={false}>
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className={viewMode === 'list' ? 'w-48 h-48 object-cover' : 'w-full h-64 object-cover'}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                      />
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary-600">
                            ₵{product.price}
                          </span>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
