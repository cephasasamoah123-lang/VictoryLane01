import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Heart, Search, Menu, X, LogOut, ChevronRight, Phone, ArrowLeft, Home as HomeIcon } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'
import api, { getImageUrl } from '../../lib/api'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import useWishlistStore from '../../store/wishlistStore'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  // Close drawer on any route change (pathname or query params)
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    setShowWelcome(true)
    const timer = setTimeout(() => setShowWelcome(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const { isAuthenticated, user, logout, isAdmin } = useAuthStore()

  const [categories, setCategories] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('Women')
  const [selectedCategory, setSelectedCategory] = useState('')
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const groupParam = params.get('group')
    const categoryParam = params.get('category')

    if (categoryParam && categories.length) {
      const matchedCategory = categories.find((category) => category.slug === categoryParam)
      if (matchedCategory && matchedCategory.group) {
        setSelectedDepartment(matchedCategory.group)
        setSelectedCategory(categoryParam)
        return
      }
    }

    if (groupParam) {
      setSelectedDepartment(groupParam)
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [location.search, categories])
  const allowedDepartments = ['Women', 'Men', 'Kids', 'Unisex', 'Accessories', 'Jewelry']
  const staticDepartments = allowedDepartments
  const fallbackCategories = [
    { name: 'Clothing', slug: 'clothing', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=60', group: 'Women', description: 'Everyday fits.' },
    { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1519741490412-259f8b11f0bb?auto=format&fit=crop&w=400&q=60', group: 'Accessories', description: 'Step out in style.' },
    { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1520975913443-5a4415d99f90?auto=format&fit=crop&w=400&q=60', group: 'Accessories', description: 'Finish every look.' },
    { name: 'Activewear', slug: 'activewear', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60', group: 'Women', description: 'Move freely.' },
    { name: 'Jewelry', slug: 'jewelry', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&q=60', group: 'Jewelry', description: 'Statement pieces.' },
  ]
  const defaultImage = 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d6?auto=format&fit=crop&w=400&q=60'

  const categoryGroups = categories.length
    ? Array.from(new Set(categories.map((category) => (allowedDepartments.includes(category.group) ? category.group : 'Unisex')).filter(Boolean)))
    : staticDepartments

  const departments = categoryGroups.length ? [...new Set([...staticDepartments, ...categoryGroups])] : staticDepartments
  let categoryOptions = categories.length
    ? categories.filter((category) => category.group === selectedDepartment)
    : fallbackCategories.filter((category) => category.group === selectedDepartment)
  if (!categoryOptions.length) categoryOptions = categories.length ? categories : fallbackCategories

  const selectedCategoryObject = categoryOptions.find((category) => category.slug === selectedCategory) || categoryOptions[0] || {}

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data?.categories || [])
      } catch (err) {
        console.warn('Failed to load categories for header', err)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (!categories.length) return

    const groups = Array.from(new Set(categories.map((category) => category.group).filter(Boolean)))
    const currentDepartment = groups.includes(selectedDepartment) ? selectedDepartment : groups[0] || 'Women'
    if (currentDepartment !== selectedDepartment) {
      setSelectedDepartment(currentDepartment)
      return
    }

    const groupCategories = categories.filter((category) => category.group === currentDepartment)
    if (groupCategories.length && !groupCategories.some((category) => category.slug === selectedCategory)) {
      setSelectedCategory(groupCategories[0].slug)
    }
  }, [categories, selectedDepartment, selectedCategory])

  const drawerNavigate = useCallback((path) => {
    flushSync(() => {
      setDrawerOpen(false)
    })
    setTimeout(() => navigate(path), 10)
  }, [navigate])
  const itemCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.items.length)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigateCategory = (department, category) => {
    const params = new URLSearchParams()
    if (department) params.set('group', department)
    if (category) params.set('category', category)
    navigate(`/products?${params.toString()}`)
  }

  const onSelectDepartment = (department) => {
    const nextCategory = categories.length
      ? categories.find((category) => category.group === department)?.slug || ''
      : fallbackCategories.find((category) => category.group === department)?.slug || ''
    setSelectedDepartment(department)
    setSelectedCategory(nextCategory)
    navigateCategory(department, nextCategory)
  }

  const onSelectCategory = (categorySlug) => {
    setSelectedCategory(categorySlug)
    navigateCategory(selectedDepartment, categorySlug)
  }

  return (
    <>
      {/* Layer 1: Promo Banner */}
      <div className="bg-primary-800 text-accent-100 text-center py-1.5 px-4">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          <Phone size={14} className="hidden sm:block" />
          <span>Call to Order: <a href="tel:0545840685" className="font-semibold text-white underline decoration-accent-400 underline-offset-2">0545840685</a></span>
          <span className="hidden sm:inline text-primary-400">|</span>
          <span className="hidden sm:inline">Free Shipping on orders over GH₵100</span>
        </div>
      </div>

      {showWelcome && (
        <div className="bg-slate-900 text-white text-center py-3 px-4 animate-fade-in-down">
          <p className="text-sm sm:text-base font-semibold tracking-wide">
            Welcome to VictoryLane — discover curated style and fast delivery.
          </p>
        </div>
      )}

      {/* Sticky wrapper for header + search + nav */}
      <div className="sticky top-0 z-40">
        {/* Layer 2: Main Header Bar */}
        <header className="bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="flex items-center justify-between py-2.5">
              {/* Left: Back + Home + Hamburger */}
              <div className="flex items-center gap-1">
                {location.pathname !== '/' && (
                  <button
                    onClick={() => navigate(-1)}
                    className="text-gray-700 hover:text-primary-700 p-1"
                    aria-label="Go back"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                {location.pathname !== '/' && (
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-primary-700 p-1"
                    aria-label="Go to home"
                  >
                    <HomeIcon size={22} />
                  </Link>
                )}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="text-gray-700 hover:text-primary-700 p-1"
                  aria-label="Open menu"
                >
                  <Menu size={26} />
                </button>
              </div>

              {/* Center: Logo */}
              <Link to="/" className="group flex flex-col items-center py-1.5 leading-none" aria-label="VictoryLane home">
                <span className="flex items-baseline gap-1.5 sm:gap-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  <span className="text-primary-800 drop-shadow-sm">Victory</span>
                  <span className="italic text-accent-500 transition-colors drop-shadow-sm group-hover:text-accent-600">Lane</span>
                  <span className="ml-0.5 mt-2 h-2 w-2 self-start rounded-full bg-accent-500 transition-transform group-hover:scale-125 sm:mt-3 sm:h-3 sm:w-3" />
                </span>
                <span className="mt-1 flex items-center gap-2 text-[0.48rem] font-bold uppercase tracking-[0.28em] text-primary-600 sm:text-[0.55rem]">
                  <i className="h-px w-4 bg-accent-400" /> Fashion for you <i className="h-px w-4 bg-accent-400" />
                </span>
              </Link>

              {/* Right: Icons */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/wishlist" className="relative hidden sm:block">
                      <Heart size={22} className="text-gray-700 hover:text-primary-700 transition-colors" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-berry-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {/* Desktop Account Dropdown */}
                    <div className="relative group hidden md:block">
                      <button className="flex items-center gap-1 text-gray-700 hover:text-primary-700">
                        <User size={22} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                        <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Orders</Link>
                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                        {isAdmin() && (
                          <>
                            <hr className="my-1" />
                            <Link to="/admin" className="block px-4 py-2 text-primary-700 hover:bg-gray-100 font-medium">Admin Panel</Link>
                          </>
                        )}
                        <hr className="my-1" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-berry-600 hover:bg-gray-100 flex items-center gap-2">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>

                    {/* Mobile Account */}
                    <Link to="/dashboard" className="md:hidden text-gray-700 hover:text-primary-700">
                      <User size={22} />
                    </Link>
                  </>
                ) : null}

                <Link to="/cart" className="relative">
                  <ShoppingCart size={22} className="text-gray-700 hover:text-primary-700 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-berry-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Layer 3: Search Bar */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container-custom py-2">
            <form onSubmit={handleSearch} className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands and categories"
                className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-accent-500 text-white rounded-md hover:bg-accent-600 text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Layer 4: Desktop Navigation */}
        <nav className="hidden md:block bg-white border-b border-slate-200">
          <div className="container-custom max-w-[1120px] mx-auto py-2">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-2 mb-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  <span className="font-semibold text-slate-700">Shop by</span>
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-600">Curated path</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 min-w-[220px]">
                  <span className="text-slate-400">Selected:</span>
                  <span className="truncate rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">{selectedDepartment} / {selectedCategoryObject.name || selectedCategory}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.35em] text-slate-400">Department</span>
                  <div className="flex gap-2 min-w-[320px]">
                    {departments.map((department) => (
                      <button
                        key={department}
                        type="button"
                        onClick={() => onSelectDepartment(department)}
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedDepartment === department ? 'bg-primary-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-white hover:text-primary-900'}`}
                      >
                        {department}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.35em] text-slate-400">Category</span>
                  <div className="flex gap-2 min-w-[360px]">
                    {categoryOptions.map((category) => (
                      <button
                        key={category._id || category.slug}
                        type="button"
                        onClick={() => onSelectCategory(category.slug)}
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${selectedCategory === category.slug ? 'bg-primary-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-white hover:text-primary-900'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 overflow-y-auto">
            {/* Drawer Header */}
            <div className="bg-primary-800 text-white p-4 flex items-center justify-between">
              <div>
                {isAuthenticated ? (
                  <div>
                    <p className="font-semibold">{user?.name || 'Welcome'}</p>
                    <p className="text-xs text-primary-100">{user?.email}</p>
                  </div>
                ) : (
                  <p className="font-display text-lg font-semibold text-white">Victory <span className="italic text-accent-300">Lane</span></p>
                )}
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-white hover:text-primary-200">
                <X size={24} />
              </button>
            </div>

            {/* Home */}
            <div className="py-2 border-b">
              <button
                onClick={() => drawerNavigate('/')}
                className="w-full flex items-center gap-2 px-4 py-3 text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <HomeIcon size={18} className="text-primary-700" />
                <span>Home</span>
              </button>
            </div>

            {/* Categories */}
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
              <p className="px-4 py-2 text-sm text-gray-700">Select a department, then a category, then a micro-category.</p>
              <div className="space-y-2 px-4">
                <div className="flex flex-wrap gap-2">
                  {departments.map((department) => (
                    <button
                      key={department}
                      onClick={() => onSelectDepartment(department)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition ${selectedDepartment === department ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {department}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category._id || category.slug}
                      onClick={() => onSelectCategory(category.slug)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition ${selectedCategory === category.slug ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Links */}
            {isAuthenticated && (
              <div className="border-t py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">My Account</p>
                <button onClick={() => drawerNavigate('/dashboard')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>Dashboard</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => drawerNavigate('/orders')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>My Orders</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => drawerNavigate('/wishlist')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button onClick={() => drawerNavigate('/profile')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                  <span>Profile</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                {isAdmin() && (
                  <button onClick={() => drawerNavigate('/admin')} className="w-full flex items-center justify-between px-4 py-3 text-primary-700 font-medium hover:bg-gray-50 active:bg-gray-100 text-left">
                    <span>Admin Panel</span>
                    <ChevronRight size={16} className="text-primary-400" />
                  </button>
                )}
              </div>
            )}

            {/* Help & Logout */}
            <div className="border-t py-2">
              <button onClick={() => drawerNavigate('/help')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                <span>Help Center</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              <button onClick={() => drawerNavigate('/track-order')} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 text-left">
                <span>Track Order</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => { flushSync(() => setDrawerOpen(false)); handleLogout() }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-berry-600 hover:bg-gray-50 active:bg-gray-100"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
