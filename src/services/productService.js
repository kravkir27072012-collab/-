import { products, SEARCH_URLS, PREFIX } from '../data/products.js'
import { searchProductsWithGemini } from './geminiService.js'

const SEARCH_DELAY_MS = 500

/**
 * "Лучший выбор" — нормализуем цену (ниже лучше), рейтинг и число
 * отзывов (выше лучше) в шкалу 0..1 и берём взвешенную сумму.
 */
function scoreProduct(product, allProducts) {
  const prices = allProducts.map((p) => p.price)
  const reviews = allProducts.map((p) => p.reviews)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const maxReviews = Math.max(...reviews)

  const priceScore = maxPrice === minPrice ? 1 : 1 - (product.price - minPrice) / (maxPrice - minPrice)
  const ratingScore = product.rating / 5
  const reviewsScore = maxReviews === 0 ? 0 : product.reviews / maxReviews

  return priceScore * 0.45 + ratingScore * 0.35 + reviewsScore * 0.2
}

export function withBestPick(items) {
  if (items.length === 0) return items

  const scored = items.map((p) => ({ ...p, score: scoreProduct(p, items) }))
  const bestId = scored.reduce((best, p) => (p.score > best.score ? p : best), scored[0]).id

  return scored
    .map((p) => ({ ...p, isBest: p.id === bestId }))
    .sort((a, b) => (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0) || b.score - a.score)
}

export function averagePrice(items) {
  if (items.length === 0) return 0
  return items.reduce((sum, p) => sum + p.price, 0) / items.length
}

function mapGeminiItem(item, index) {
  const prefix = PREFIX[item.marketplace] ?? 'XX'
  const sku = `${prefix}-AI-${1000 + index}`
  const buildUrl = SEARCH_URLS[item.marketplace]

  return {
    id: `gemini-${index}`,
    title: item.title,
    image: `https://source.unsplash.com/600x600/?${encodeURIComponent(item.imageQuery)}`,
    price: Math.round(item.price),
    rating: Math.round(item.rating * 10) / 10,
    reviews: item.reviews,
    marketplace: item.marketplace,
    sku,
    url: buildUrl ? buildUrl(item.title) : '#',
  }
}

/**
 * "Мозг" поиска — Gemini генерирует список реалистичных предложений по
 * запросу. При ошибке/пустом запросе используется локальный mock-каталог
 * как фолбэк, чтобы сайт не падал без сети/ключа.
 */
export async function fetchProducts(query) {
  const normalized = query.trim()

  if (!normalized) {
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY_MS))
    return withBestPick(products)
  }

  try {
    const items = await searchProductsWithGemini(normalized)
    if (items.length === 0) throw new Error('Gemini вернул пустой список')
    return withBestPick(items.map(mapGeminiItem))
  } catch (err) {
    console.warn('Gemini search failed, falling back to local catalog:', err)
    const lowered = normalized.toLowerCase()
    const filtered = products.filter((p) => p.title.toLowerCase().includes(lowered))
    return withBestPick(filtered)
  }
}
