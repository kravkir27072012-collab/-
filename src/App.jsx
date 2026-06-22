import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, Sparkles, Store, Tag } from 'lucide-react'
import { SearchBar } from './components/SearchBar.jsx'
import { FiltersPanel } from './components/FiltersPanel.jsx'
import { ProductCard } from './components/ProductCard.jsx'
import { SkeletonCard } from './components/SkeletonCard.jsx'
import { EmptyState } from './components/EmptyState.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { fetchProducts, averagePrice, withBestPick } from './services/productService.js'
import { products as allProducts, marketplaces } from './data/products.js'
import { useDebouncedValue } from './hooks/useDebouncedValue.js'
import { useDarkMode } from './hooks/useDarkMode.js'

const MAX_PRICE = Math.max(...allProducts.map((p) => p.price))

function applyFiltersAndSort(items, { sortBy, priceRange, selectedMarketplaces }) {
  const filtered = items.filter(
    (p) =>
      p.price >= priceRange[0] &&
      p.price <= priceRange[1] &&
      (selectedMarketplaces.length === 0 || selectedMarketplaces.includes(p.marketplace)),
  )

  // пересчитываем "лучший выбор" внутри отфильтрованной выборки —
  // иначе бейдж мог бы остаться на товаре, скрытом фильтрами
  let result = withBestPick(filtered)

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
    <div className="relative min-h-screen bg-[#F3F2F8] dark:bg-[#0B0B0F] transition-colors duration-300 overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="animate-blob absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#007AFF]/15 dark:bg-[#007AFF]/10 blur-3xl" />
        <div className="animate-blob absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#FF9500]/15 dark:bg-[#FF9500]/10 blur-3xl" style={{ animationDelay: '4s' }} />
        <div className="animate-blob absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#AF52DE]/10 dark:bg-[#AF52DE]/10 blur-3xl" style={{ animationDelay: '8s' }} />
      </div>

      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#F3F2F8]/80 dark:bg-[#0B0B0F]/80 border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center shadow-md shadow-blue-500/30">
              <Sparkles size={16} className="text-white" />
            </span>
            <h1 className="hidden sm:block text-[17px] font-bold text-gray-900 dark:text-white">
              FindBest
            </h1>
          </div>
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-2 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Лучшая цена на любой товар —{' '}
          <span className="bg-gradient-to-r from-[#007AFF] to-[#AF52DE] bg-clip-text text-transparent">
            в одном поиске
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Сравниваем цены, рейтинги и отзывы по нескольким маркетплейсам и сразу показываем самый удачный вариант.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap text-[13px] font-medium text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5 bg-white dark:bg-[#1C1C20] border border-black/5 dark:border-white/10 rounded-full px-3 py-1.5 shadow-sm">
            <Store size={14} className="text-[#007AFF]" /> {marketplaces.length} маркетплейса
          </span>
          <span className="flex items-center gap-1.5 bg-white dark:bg-[#1C1C20] border border-black/5 dark:border-white/10 rounded-full px-3 py-1.5 shadow-sm">
            <Tag size={14} className="text-[#FF9500]" /> {allProducts.length} товаров в каталоге
          </span>
        </div>
      </section>

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

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-black/5 dark:border-white/10">
        FindBest — агрегатор товаров. Данные демонстрационные.
      </footer>
    </div>
  )
}

export default App
