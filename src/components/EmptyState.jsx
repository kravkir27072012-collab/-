import { SearchX } from 'lucide-react'

export function EmptyState({ query }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
        <SearchX size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Ничего не найдено</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        {query
          ? `По запросу «${query}» товаров не нашлось. Попробуйте изменить запрос или фильтры.`
          : 'Попробуйте изменить фильтры — подходящих товаров не нашлось.'}
      </p>
    </div>
  )
}
