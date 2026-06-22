import { useState } from 'react'
import { Star, ExternalLink, Copy, Check } from 'lucide-react'
import { MarketplaceAvatar } from './MarketplaceAvatar.jsx'

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < full ? 'fill-[#FFB400] text-[#FFB400]' : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
    </div>
  )
}

export function ProductCard({ product, averagePrice, style }) {
  const [copied, setCopied] = useState(false)

  const diffPercent = averagePrice > 0 ? Math.round((1 - product.price / averagePrice) * 100) : 0

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(product.sku)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = product.sku
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // буфер обмена недоступен (например, небезопасный контекст) — молча игнорируем
    }
  }

  return (
    <div
      style={style}
      className={`animate-card-in group relative rounded-[20px] bg-white dark:bg-[#1C1C20] border p-4
                 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)]
                 hover:-translate-y-1 transition-all duration-300 flex flex-col ${
                   product.isBest
                     ? 'border-[#FF9500]/40 ring-1 ring-[#FF9500]/20'
                     : 'border-black/5 dark:border-white/10'
                 }`}
    >
      {product.isBest && (
        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#FF9500] to-[#FF3B30] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm shadow-orange-500/30">
          🔥 Лучший выбор
        </span>
      )}

      <div className="rounded-[16px] bg-[#F6F6F8] dark:bg-[#2A2A30] aspect-square overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <h3 className="font-bold text-[15px] text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 min-h-[2.5em]">
        {product.title}
      </h3>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          {product.price.toLocaleString('ru-RU')} ₽
        </span>
        {diffPercent > 0 && (
          <span className="text-[12px] font-medium text-[#34C759]">дешевле на {diffPercent}%</span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[13px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span>{product.rating}</span>
        </div>
        <span>{product.reviews.toLocaleString('ru-RU')} отзывов</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
        <MarketplaceAvatar name={product.marketplace} size={18} />
        <span>{product.marketplace}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 flex-1 min-w-0 text-[12px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Скопировать артикул"
        >
          {copied ? <Check size={13} className="shrink-0 text-[#34C759]" /> : <Copy size={13} className="shrink-0" />}
          <span className="truncate">{copied ? 'Скопировано' : product.sku}</span>
        </button>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#007AFF] hover:bg-[#0066D6] text-white text-[13px] font-semibold
                     px-3.5 py-1.5 rounded-full transition-colors duration-150 shrink-0"
        >
          Перейти к товару
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}
