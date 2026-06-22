import { products } from '../data/products.js'

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

/**
 * Точка подключения реальных API маркетплейсов в будущем:
 * замените тело функции на запросы к Wildberries/Ozon/Yandex и
 * верните массив объектов с той же формой, что в data/products.js.
 */
export async function fetchProducts(query) {
  await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY_MS))

  const normalized = query.trim().toLowerCase()
  const filtered = normalized
    ? products.filter((p) => p.title.toLowerCase().includes(normalized))
    : products

  return withBestPick(filtered)
}
