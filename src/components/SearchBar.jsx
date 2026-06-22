import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange, isSearching }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search
        size={20}
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${
          isSearching ? 'animate-pulse' : ''
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Например: кроссовки Nike или мышка ATK A9"
        className="w-full rounded-2xl bg-white dark:bg-[#1C1C20] border border-black/5 dark:border-white/10
                   py-3.5 pl-12 pr-10 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400
                   shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40
                   transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Очистить поиск"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
