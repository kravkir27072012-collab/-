const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

const MARKETPLACES = ['Wildberries', 'Ozon', 'Яндекс.Маркет', 'СберМегаМаркет', 'AliExpress']

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          marketplace: { type: 'string', enum: MARKETPLACES },
          price: { type: 'number' },
          rating: { type: 'number' },
          reviews: { type: 'integer' },
          imageQuery: { type: 'string' },
        },
        required: ['title', 'marketplace', 'price', 'rating', 'reviews', 'imageQuery'],
      },
    },
  },
  required: ['items'],
}

function buildPrompt(query) {
  return `Ты — поисковый движок маркетплейсов. Пользователь ищет товар: "${query}".

Придумай реалистичный список из 6-10 предложений этого товара (или похожих товаров той же категории)
от разных маркетплейсов: ${MARKETPLACES.join(', ')}. Для каждого предложения укажи:
- title: точное название товара (модель, бренд)
- marketplace: один из списка выше
- price: цена в рублях (целое число, реалистичная для такого товара в России)
- rating: рейтинг от 3.5 до 5.0
- reviews: количество отзывов (целое число)
- imageQuery: 2-3 слова на английском для поиска фото товара (например "nike sneakers")

Используй разные маркетплейсы и разброс цен/рейтингов, как в реальном сравнении цен.
Если товар можно найти у нескольких продавцов — добавь несколько предложений одного и того же товара.`
}

export async function searchProductsWithGemini(query) {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY не задан')
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(query) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini API: пустой ответ')
  }

  const parsed = JSON.parse(text)
  return parsed.items ?? []
}
