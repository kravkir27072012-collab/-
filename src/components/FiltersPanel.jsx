import { marketplaces } from '../data/products.js'

const SORT_OPTIONS = [
  { value: 'best', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: дешевле' },
  { value: 'price-desc', label: 'Цена: дороже' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'reviews', label: 'По числу отзывов' },
]

export function FiltersPanel({
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  selectedMarketplaces,
  onToggleMarketplace,
}) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#1C1C20] border border-black/5 dark:border-white/10 p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Сортировка</p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 ${
                sortBy === opt.value
                  ? 'bg-[#007AFF] text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Цена: {priceRange[0].toLocaleString('ru-RU')} ₽ – {priceRange[1].toLocaleString('ru-RU')} ₽
        </p>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#007AFF]"
        />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Маркетплейс</p>
        <div className="flex flex-wrap gap-2">
          {marketplaces.map((mp) => (
            <button
              key={mp}
              onClick={() => onToggleMarketplace(mp)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 ${
                selectedMarketplaces.includes(mp)
                  ? 'bg-[#007AFF] text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
            >
              {mp}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { SORT_OPTIONS }
