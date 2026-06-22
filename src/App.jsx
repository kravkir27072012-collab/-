import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { SearchBar } from './components/SearchBar.jsx'
import { FiltersPanel } from './components/FiltersPanel.jsx'
import { ProductCard } from './components/ProductCard.jsx'
import { SkeletonCard } from './components/SkeletonCard.jsx'
import { EmptyState } from './components/EmptyState.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { fetchProducts, averagePrice } from './services/productService.js'
import { products as allProducts } from './data/products.js'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { useDarkMode } from './hooks/useDarkMode.js'

const MAX_PRICE = Math.max(...allProducts.map((p) => p.price))

function applyFiltersAndSort(items, { sortBy, priceRange, selectedMarketplaces }) {
  let result = items.filter(
    (p) =>
      p.price >= priceRange[0] &&
      p.price <= priceRange[1] &&
      (selectedMarketplaces.length === 0 || selectedMarketplaces.includes(p.marketplace)),
  )

  switch (sortBy) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result = [...result].sort((a, b) => b.rating - a.rating)
      break
    case 'reviews':
      result = [...result].sort((a, b) => b.reviews - a.reviews)
      break
    default:
      // best — уже отсортировано сервисом (лучший выбор наверху)
      break
  }

  return result
}

function App() {
  const [isDark, setIsDark] = useDarkMode()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('best')
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE])
  const [selectedMarketplaces, setSelectedMarketplaces] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    fetchProducts(debouncedQuery).then((result) => {
      if (active) {
        setProducts(result)
        setIsLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [debouncedQuery])

  const visibleProducts = useMemo(
    () => applyFiltersAndSort(products, { sortBy, priceRange, selectedMarketplaces }),
    [products, sortBy, priceRange, selectedMarketplaces],
  )

  const avgPrice = useMemo(() => averagePrice(visibleProducts), [visibleProducts])

  const toggleMarketplace = (mp) =>
    setSelectedMarketplaces((prev) => (prev.includes(mp) ? prev.filter((m) => m !== mp) : [...prev, mp]))

  return (
    <div className="min-h-screen bg-[#F3F2F8] dark:bg-[#0B0B0F] transition-colors duration-300">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#F3F2F8]/80 dark:bg-[#0B0B0F]/80 border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <h1 className="hidden sm:block text-[17px] font-bold text-gray-900 dark:text-white shrink-0">
            FindBest
          </h1>
          <SearchBar value={query} onChange={setQuery} isSearching={isLoading} />
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="lg:hidden shrink-0 w-10 h-10 rounded-full bg-white dark:bg-[#1C1C20] border border-black/5 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
            aria-label="Фильтры"
          >
            <SlidersHorizontal size={18} />
          </button>
          <ThemeToggle isDark={isDark} onToggle={setIsDark} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <FiltersPanel
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={MAX_PRICE}
              selectedMarketplaces={selectedMarketplaces}
              onToggleMarketplace={toggleMarketplace}
            />
          </div>
        </aside>

        <section>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {isLoading ? 'Ищем лучшие предложения…' : `Найдено ${visibleProducts.length} товаров`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

            {!isLoading && visibleProducts.length === 0 && <EmptyState query={debouncedQuery} />}

            {!isLoading &&
              visibleProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  averagePrice={avgPrice}
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
