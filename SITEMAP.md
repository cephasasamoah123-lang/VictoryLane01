# E-Commerce Platform - Site Map

## 🗺️ Application Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE (/)                             │
│  • Hero Banner                                                   │
│  • Featured Products                                             │
│  • Category Showcase                                             │
│  • Features Section                                              │
│  • Newsletter Signup                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐    ┌──────────┐   ┌──────────┐
        │ Products │    │   Cart   │   │   Auth   │
        └──────────┘    └──────────┘   └──────────┘
              │               │               │
              │               │               │
┌─────────────┴─────┐         │         ┌─────┴──────────┐
│                   │         │         │                │
▼                   ▼         ▼         ▼                ▼
```

---

## 📄 Public Pages (No Authentication Required)

### 🏠 Home
- **Route**: `/`
- **Component**: `HomePage.jsx`
- **Features**:
  - Hero section with CTA buttons
  - Featured products grid
  - Category cards
  - Feature highlights
  - Newsletter subscription

### 🛍️ Products
- **Route**: `/products`
- **Component**: `ProductsPage.jsx`
- **Features**:
  - Product grid/list view
  - Category filtering
  - Price range filtering
  - Search functionality
  - Sort options
  - Pagination/infinite scroll ready

### 📦 Product Detail
- **Route**: `/products/:id`
- **Component**: `ProductDetailPage.jsx`
- **Features**:
  - Image gallery with thumbnails
  - Product information
  - Price and availability
  - Add to cart/wishlist
  - Quantity selector
  - Product specifications
  - Customer reviews section

### 🛒 Shopping Cart
- **Route**: `/cart`
- **Component**: `CartPage.jsx`
- **Features**:
  - Cart items list
  - Quantity management
  - Remove items
  - Price breakdown
  - Coupon application
  - Proceed to checkout

---

## 🔐 Authentication Pages

### Login
- **Route**: `/login`
- **Component**: `LoginPage.jsx`
- **Features**:
  - Email/password login
  - Social login options (Google, Facebook)
  - Remember me option
  - Forgot password link
  - Sign up link

### Register
- **Route**: `/register`
- **Component**: `RegisterPage.jsx`
- **Features**:
  - Name, email, password fields
  - Password confirmation
  - Terms acceptance
  - Social signup options
  - Login link

### Forgot Password
- **Route**: `/forgot-password`
- **Component**: `ForgotPasswordPage.jsx`
- **Features**:
  - Email input
  - Reset link sending
  - Back to login link

---

## 👤 Protected User Pages (Login Required)

### User Dashboard
```
/dashboard
├── Overview
│   ├── Quick stats
│   ├── Recent orders
│   └── Account info
└── Quick links to all user features
```

### My Orders
- **Route**: `/orders`
- **Component**: `OrdersPage.jsx`
- **Features**:
  - Order history list
  - Order status tracking
  - Order details
  - Reorder option
  - Download invoice

### Profile Settings
- **Route**: `/profile`
- **Component**: `ProfilePage.jsx`
- **Features**:
  - Personal information
  - Email and phone
  - Address management
  - Password change
  - Account preferences

### Wishlist
- **Route**: `/wishlist`
- **Component**: `WishlistPage.jsx`
- **Features**:
  - Saved products grid
  - Add to cart button
  - Remove from wishlist
  - Product quick view
  - Empty state message

### Custom Requests
- **Route**: `/custom-requests`
- **Component**: `CustomRequestsPage.jsx`
- **Features**:
  - Submit new request form
  - View submitted requests
  - Request status tracking
  - Request details view

### Checkout
- **Route**: `/checkout`
- **Component**: `CheckoutPage.jsx`
- **Features**:
  - 3-step process:
    1. Shipping address
    2. Payment information
    3. Order review
  - Order summary sidebar
  - Back/Continue navigation

---

## 👑 Admin Pages (Admin Role Required)

### Admin Dashboard
```
/admin
├── Statistics Overview
│   ├── Total Revenue
│   ├── Total Orders
│   ├── Total Users
│   └── Product Count
└── Quick Actions
    ├── Manage Products
    ├── Manage Orders
    ├── Custom Requests
    └── Manage Users
```

### Manage Products
- **Route**: `/admin/products`
- **Component**: `AdminProducts.jsx`
- **Features**:
  - Products table view
  - Add new product
  - Edit product
  - Delete product
  - Stock management
  - Status indicators

### Manage Orders
- **Route**: `/admin/orders`
- **Component**: `AdminOrders.jsx`
- **Features**:
  - Orders table view
  - Order status update
  - View order details
  - Customer information
  - Order totals

### Custom Requests Management
- **Route**: `/admin/requests`
- **Component**: `AdminRequests.jsx`
- **Features**:
  - Requests table view
  - Request status update
  - Review requests
  - Respond to requests
  - Budget information

### Manage Users
- **Route**: `/admin/users`
- **Component**: `AdminUsers.jsx`
- **Features**:
  - Users table view
  - User roles
  - Account status
  - Edit user details
  - User activity

---

## 🚫 Error Pages

### 404 Not Found
- **Route**: `*` (catch-all)
- **Component**: `NotFoundPage.jsx`
- **Features**:
  - 404 error message
  - Back to home button
  - Helpful links

---

## 🧭 Navigation Structure

### Header (Global)
```
Logo  [Search Bar]  [Wishlist] [Cart] [User Menu]
─────────────────────────────────────────────────
[All Products] [Electronics] [Fashion] [Home] [Sports] [Custom Request]
```

#### User Menu (Not Logged In)
- Sign In button

#### User Menu (Logged In - Customer)
- Dashboard
- My Orders
- Custom Requests
- Profile
- Logout

#### User Menu (Logged In - Admin)
- Dashboard
- My Orders
- Custom Requests
- Profile
- ─────────
- Admin Panel ⭐
- ─────────
- Logout

### Footer (Global)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Company   │    Links    │   Service   │ Newsletter  │
│   Info      │             │             │             │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ • About     │ • Home      │ • Help      │ [Subscribe] │
│ • Social    │ • Shop      │ • Tracking  │             │
│             │ • Custom    │ • Returns   │             │
│             │ • Contact   │ • FAQ       │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
            Privacy | Terms | Cookies
```

---

## 🔄 User Flows

### Shopping Flow
```
Homepage → Products → Product Detail → Add to Cart → Cart → Checkout → Order Complete
   │                      │
   └──────────────────────┴──────────→ Wishlist
```

### Authentication Flow
```
Login Page → Dashboard
    │            │
    ├→ Register  └→ Orders/Profile/Wishlist/Custom Requests
    │
    └→ Forgot Password → Email Sent → Password Reset
```

### Custom Request Flow
```
Homepage/Products → Custom Request Form → Submit → Dashboard → Track Status
```

### Admin Flow
```
Login (admin@example.com) → Admin Dashboard
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              Manage Products  Manage Orders  Manage Users
                                  │
                                  ▼
                            Custom Requests
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (lg/xl)

### Mobile Navigation
- Hamburger menu
- Collapsible navigation
- Touch-friendly buttons
- Stacked layouts

### Desktop Navigation
- Full header with all links
- Dropdown menus
- Grid layouts
- Hover states

---

## 🎨 Page Categories

### 🟢 Fully Functional (With Mock Data)
- ✅ Homepage
- ✅ Products Page
- ✅ Product Detail
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ All Auth Pages

### 🟡 UI Complete (Needs Backend)
- ⚠️ Checkout
- ⚠️ Orders History
- ⚠️ Custom Requests
- ⚠️ Profile Management
- ⚠️ All Admin Pages

---

## 🔗 Quick Reference

| Page | Route | Auth Required | Role |
|------|-------|---------------|------|
| Home | `/` | No | Public |
| Products | `/products` | No | Public |
| Product Detail | `/products/:id` | No | Public |
| Cart | `/cart` | No | Public |
| Login | `/login` | No | Public |
| Register | `/register` | No | Public |
| Forgot Password | `/forgot-password` | No | Public |
| Checkout | `/checkout` | Yes | Customer |
| Dashboard | `/dashboard` | Yes | Customer |
| Orders | `/orders` | Yes | Customer |
| Profile | `/profile` | Yes | Customer |
| Wishlist | `/wishlist` | Yes | Customer |
| Custom Requests | `/custom-requests` | Yes | Customer |
| Admin Dashboard | `/admin` | Yes | Admin |
| Admin Products | `/admin/products` | Yes | Admin |
| Admin Orders | `/admin/orders` | Yes | Admin |
| Admin Requests | `/admin/requests` | Yes | Admin |
| Admin Users | `/admin/users` | Yes | Admin |
| 404 | `*` | No | Public |

---

**Total Pages: 20+**
**Total Components: 30+**
**Total Routes: 21**
