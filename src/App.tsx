
import { useMemo, useState } from 'react'
import {
  ShoppingBag, ShoppingCart, Plus, Minus, X,
  PackagePlus, Search, Star, Eye, Trash2
} from 'lucide-react'

type Category = 'Skinny' | 'Straight' | 'Baggy' | 'Wide Leg'

type Product = {
  id: number
  name: string
  category: Category
  description: string
  specification: string
  image: string
  rating: number
  price: number
  quantity: number
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Classic Blue Jeans',
    category: 'Straight',
    description: 'Classic blue denim jeans for everyday wear.',
    specification: 'Denim cotton, 5 pockets, button closure',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700',
    rating: 4.8,
    price: 899,
    quantity: 3,
  },
  {
    id: 2,
    name: 'Black Skinny Jeans',
    category: 'Skinny',
    description: 'Modern black jeans with a fitted silhouette.',
    specification: 'Stretch denim, slim fit, zipper closure',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700',
    rating: 4.6,
    price: 799,
    quantity: 8,
  },
  {
    id: 3,
    name: 'Relaxed Baggy Jeans',
    category: 'Baggy',
    description: 'Relaxed-fit jeans with a casual streetwear style.',
    specification: 'Cotton denim, loose fit, 5 pockets',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700',
    rating: 4.9,
    price: 1099,
    quantity: 12,
  },
]

const money = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(amount)

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showCart, setShowCart] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: 'Straight' as Category,
    description: '',
    specification: '',
    image: '',
    rating: '5',
    price: '',
    quantity: '',
  })

  const categories = ['All', 'Skinny', 'Straight', 'Baggy', 'Wide Leg']

  const visibleProducts = useMemo(
    () =>
      products.filter(
        p =>
          (filter === 'All' || p.category === filter) &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, filter, search]
  )

  const totalItems = Object.values(cart).reduce(
    (sum, qty) => sum + qty,
    0
  )

  const total = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] ?? 0),
    0
  )

  function addToCart(id: number) {
    const product = products.find(p => p.id === id)
    if (!product) return

    setCart(prev => {
      const current = prev[id] ?? 0
      if (current >= product.quantity) return prev
      return { ...prev, [id]: current + 1 }
    })
  }

  function changeCartQuantity(id: number, amount: number) {
    setCart(prev => {
      const next = (prev[id] ?? 0) + amount
      if (next <= 0) {
        const updated = { ...prev }
        delete updated[id]
        return updated
      }

      const product = products.find(p => p.id === id)
      if (!product || next > product.quantity) return prev

      return { ...prev, [id]: next }
    })
  }

  function addProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.specification.trim() ||
      !form.image.trim() ||
      form.price === '' ||
      form.quantity === '' ||
      Number(form.price) <= 0 ||
      Number(form.quantity) < 0 ||
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.rating) < 1 ||
      Number(form.rating) > 5
    ) {
      alert('Please complete all fields with valid values.')
      return
    }

    const newProduct: Product = {
      id: Date.now(),
      ...form,
      rating: Number(form.rating),
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    setProducts(prev => [...prev, newProduct])
    setForm({
      name: '',
      category: 'Straight',
      description: '',
      specification: '',
      image: '',
      rating: '5',
      price: '',
      quantity: '',
    })
    setShowForm(false)
    setFilter('All')
  }

  function removeProduct(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id))
    setCart(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="min-h-screen text-slate-800">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <a href="#" className="flex items-center gap-2 text-xl font-black">
            <ShoppingBag className="text-blue-700" />
            VEN JEANS<span className="text-blue-700">STORE</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <PackagePlus size={18} />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 rounded-lg border px-3 py-2 font-semibold hover:bg-slate-50"
            >
              <ShoppingCart size={19} />
              Cart
              <span className="rounded-full bg-blue-700 px-2 py-0.5 text-xs text-white">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <section className="mb-8 rounded-2xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
            WELCOME TO VEN JEANS
          </p>
          <h1 className="max-w-xl text-3xl font-black sm:text-5xl">
           Find Your Perfect Fit.
          </h1>
          <p className="mt-4 max-w-lg text-slate-300">
            Explore our collection of jeans and find the perfect pair
            for your everyday style.
          </p>
          <button
            onClick={() =>
              document.getElementById('products')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
          >
            Explore Collection
          </button>
        </section>

        <section id="products">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                OUR COLLECTION
              </p>
              <h2 className="mt-1 text-2xl font-black">Shop Jeans</h2>
              <p className="mt-1 text-sm text-slate-500">
                {visibleProducts.length} products available
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jeans..."
                className="w-full outline-none sm:w-48"
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  filter === category
                    ? 'bg-blue-700 text-white'
                    : 'border bg-white hover:bg-blue-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map(product => {
              const cartQty = cart[product.id] ?? 0

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-64 w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold">
                      {product.category}
                    </span>
                    {product.quantity < 5 && (
                      <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold">{product.name}</h3>
                      <button
                        onClick={() => removeProduct(product.id)}
                        title="Delete product"
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {product.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-black text-blue-800">
                        {money(product.price)}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <Star size={15} className="fill-amber-400 text-amber-400" />
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Stock: {product.quantity}
                    </p>

                    <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2">
                      <span className="text-sm text-slate-600">
                        Cart quantity
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => changeCartQuantity(product.id, -1)}
                          disabled={cartQty === 0}
                          className="rounded border bg-white p-1 disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="min-w-4 text-center font-bold">
                          {cartQty}
                        </span>
                        <button
                          onClick={() => changeCartQuantity(product.id, 1)}
                          disabled={cartQty >= product.quantity}
                          className="rounded border bg-white p-1 disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-sm">
                      Subtotal:{' '}
                      <strong>{money(product.price * cartQty)}</strong>
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelected(product)}
                        className="flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm font-semibold hover:bg-slate-50"
                      >
                        <Eye size={16} /> Details
                      </button>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={cartQty >= product.quantity}
                        className="rounded-lg bg-blue-700 px-2 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {cartQty >= product.quantity
                          ? 'Stock Limit'
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {visibleProducts.length === 0 && (
            <p className="rounded-xl border bg-white p-10 text-center text-slate-500">
              No jeans found. Try another search or category.
            </p>
          )}
        </section>

        <section className="mt-10 flex flex-col justify-between gap-3 rounded-2xl bg-blue-50 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">OVERALL CART TOTAL</p>
            <p className="text-3xl font-black text-blue-800">
              {money(total)}
            </p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="rounded-lg bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            View Cart ({totalItems} items)
          </button>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Product Details</h2>
              <button onClick={() => setSelected(null)} aria-label="Close details">
                <X />
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <img
                src={selected.image}
                alt={selected.name}
                className="h-72 w-full rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-blue-700">{selected.category}</p>
                <h3 className="mt-2 text-2xl font-black">{selected.name}</h3>
                <p className="mt-3 text-xl font-bold">{money(selected.price)}</p>
                <p className="mt-3 text-slate-600">{selected.description}</p>
                <p className="mt-4 text-sm">
                  <strong>Specifications:</strong> {selected.specification}
                </p>
                <p className="mt-2 text-sm">
                  <strong>Rating:</strong> {selected.rating}/5
                </p>
                <p className="mt-2 text-sm">
                  <strong>Available stock:</strong> {selected.quantity}
                </p>
                <button
                  onClick={() => addToCart(selected.id)}
                  disabled={(cart[selected.id] ?? 0) >= selected.quantity}
                  className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-3 font-bold text-white disabled:bg-slate-400"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={addProduct}
            className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Add New Jeans</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
                <X />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Product Name *
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                  placeholder="Classic Denim Jeans"
                />
              </label>

              <label className="text-sm font-semibold">
                Category *
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as Category })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                >
                  {categories.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                Feature Image URL *
                <input
                  required
                  type="url"
                  value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                  placeholder="https://example.com/jeans.jpg"
                />
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                Description *
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                  rows={2}
                />
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                Product Specification *
                <textarea
                  required
                  value={form.specification}
                  onChange={e => setForm({ ...form, specification: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                  rows={2}
                  placeholder="Material, fit, closure..."
                />
              </label>

              <label className="text-sm font-semibold">
                Rating (1–5) *
                <input
                  required
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={e => setForm({ ...form, rating: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                />
              </label>

              <label className="text-sm font-semibold">
                Price (PHP) *
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                />
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                Stock Quantity *
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  className="mt-1 w-full rounded-lg border p-3 font-normal"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 p-3 font-bold text-white hover:bg-blue-800"
            >
              Save Product
            </button>
          </form>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} aria-label="Close cart">
                <X />
              </button>
            </div>

            {products.filter(p => (cart[p.id] ?? 0) > 0).length === 0 ? (
              <p className="py-8 text-center text-slate-500">
                Your cart is empty. Add some jeans!
              </p>
            ) : (
              products.filter(p => (cart[p.id] ?? 0) > 0).map(p => (
                <div key={p.id} className="flex gap-3 border-b py-4">
                  <img src={p.image} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm text-slate-500">{money(p.price)} each</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button onClick={() => changeCartQuantity(p.id, -1)} aria-label="Decrease quantity">
                        <Minus size={16} />
                      </button>
                      {cart[p.id]}
                      <button
                        onClick={() => changeCartQuantity(p.id, 1)}
                        disabled={(cart[p.id] ?? 0) >= p.quantity}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <strong>{money(p.price * (cart[p.id] ?? 0))}</strong>
                </div>
              ))
            )}

            <div className="mt-5 flex items-center justify-between text-xl font-black">
              <span>Total</span>
              <span className="text-blue-800">{money(total)}</span>
            </div>
            <button
              onClick={() => {
                setCart({})
                setShowCart(false)
              }}
              className="mt-5 w-full rounded-lg bg-blue-700 p-3 font-bold text-white hover:bg-blue-800"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}

      <footer className="mt-12 bg-slate-900 px-5 py-6 text-center text-sm text-slate-300">
        © 2026 Denim Store · Jeans Product Management App
      </footer>
    </div>
  )
}
