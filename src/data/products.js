const SEARCH_URLS = {
  Wildberries: (q) => `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(q)}`,
  Ozon: (q) => `https://www.ozon.ru/search/?text=${encodeURIComponent(q)}`,
  'Яндекс.Маркет': (q) => `https://market.yandex.ru/search?text=${encodeURIComponent(q)}`,
  СберМегаМаркет: (q) => `https://sbermegamarket.ru/catalog/?q=${encodeURIComponent(q)}`,
  AliExpress: (q) => `https://aliexpress.ru/wholesale?SearchText=${encodeURIComponent(q)}`,
}

const PREFIX = {
  Wildberries: 'WB',
  Ozon: 'OZ',
  'Яндекс.Маркет': 'YM',
  СберМегаМаркет: 'SM',
  AliExpress: 'AE',
}

// Базовые товары: одно название/картинка, несколько предложений от
// разных маркетплейсов с разной ценой/рейтингом/отзывами.
const RAW = [
  {
    title: 'Кроссовки Nike Air Max 270',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    query: 'nike air max 270',
    code: 'NK270',
    offers: [
      { marketplace: 'Wildberries', price: 8990, rating: 4.7, reviews: 1243 },
      { marketplace: 'Ozon', price: 10490, rating: 4.5, reviews: 312 },
    ],
  },
  {
    title: 'Мышка A4Tech Bloody A9',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80',
    query: 'ATK A9 mouse',
    code: 'ATKA9',
    offers: [
      { marketplace: 'Яндекс.Маркет', price: 1290, rating: 4.8, reviews: 982 },
      { marketplace: 'Wildberries', price: 1450, rating: 4.3, reviews: 87 },
    ],
  },
  {
    title: 'Наушники Apple AirPods Pro 2',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80',
    query: 'airpods pro 2',
    code: 'APP2',
    offers: [
      { marketplace: 'Ozon', price: 19990, rating: 4.9, reviews: 3120 },
      { marketplace: 'СберМегаМаркет', price: 21490, rating: 4.6, reviews: 540 },
      { marketplace: 'AliExpress', price: 18490, rating: 4.2, reviews: 96 },
    ],
  },
  {
    title: 'Смарт-часы Xiaomi Mi Band 8',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    query: 'mi band 8',
    code: 'MIB8',
    offers: [
      { marketplace: 'Wildberries', price: 3290, rating: 4.4, reviews: 654 },
      { marketplace: 'AliExpress', price: 2790, rating: 4.1, reviews: 1830 },
    ],
  },
  {
    title: 'Клавиатура Logitech MX Keys',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    query: 'logitech mx keys',
    code: 'MXK',
    offers: [
      { marketplace: 'Яндекс.Маркет', price: 8990, rating: 4.8, reviews: 421 },
      { marketplace: 'Ozon', price: 9990, rating: 4.2, reviews: 58 },
    ],
  },
  {
    title: 'Рюкзак Xiaomi Mi City Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    query: 'mi city backpack',
    code: 'MICB',
    offers: [
      { marketplace: 'СберМегаМаркет', price: 2390, rating: 4.6, reviews: 765 },
      { marketplace: 'Wildberries', price: 2590, rating: 4.4, reviews: 213 },
    ],
  },
  {
    title: 'Робот-пылесос Dreame Bot L10 Pro',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
    query: 'dreame l10 pro',
    code: 'DRL10',
    offers: [
      { marketplace: 'Wildberries', price: 24990, rating: 4.7, reviews: 298 },
      { marketplace: 'Ozon', price: 26990, rating: 4.5, reviews: 134 },
    ],
  },
  {
    title: 'Электросамокат Xiaomi Mi Scooter 3',
    image: 'https://images.unsplash.com/photo-1604868189265-219ba7bf2aa3?w=600&q=80',
    query: 'mi scooter 3',
    code: 'MISC3',
    offers: [
      { marketplace: 'Ozon', price: 29990, rating: 4.5, reviews: 412 },
      { marketplace: 'СберМегаМаркет', price: 31490, rating: 4.3, reviews: 89 },
    ],
  },
  {
    title: 'Смартфон Apple iPhone 15 128GB',
    image: 'https://images.unsplash.com/photo-1697284960036-de4ce5051da9?w=600&q=80',
    query: 'iphone 15 128gb',
    code: 'IPH15',
    offers: [
      { marketplace: 'Wildberries', price: 64990, rating: 4.9, reviews: 2210 },
      { marketplace: 'Ozon', price: 67990, rating: 4.8, reviews: 1456 },
      { marketplace: 'Яндекс.Маркет', price: 65990, rating: 4.7, reviews: 980 },
    ],
  },
  {
    title: 'Телевизор Samsung QLED 55"',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
    query: 'samsung qled 55',
    code: 'SQLED55',
    offers: [
      { marketplace: 'Ozon', price: 54990, rating: 4.6, reviews: 318 },
      { marketplace: 'СберМегаМаркет', price: 57990, rating: 4.5, reviews: 142 },
    ],
  },
  {
    title: 'Куртка The North Face',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    query: 'the north face jacket',
    code: 'TNF',
    offers: [
      { marketplace: 'Wildberries', price: 12990, rating: 4.6, reviews: 540 },
      { marketplace: 'AliExpress', price: 9490, rating: 4.0, reviews: 712 },
    ],
  },
  {
    title: 'Футболка Nike Dri-FIT',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    query: 'nike dri-fit tshirt',
    code: 'NKDF',
    offers: [
      { marketplace: 'Wildberries', price: 1990, rating: 4.5, reviews: 1820 },
      { marketplace: 'Ozon', price: 2290, rating: 4.4, reviews: 430 },
    ],
  },
  {
    title: 'Кофемашина DeLonghi Magnifica',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80',
    query: 'delonghi magnifica',
    code: 'DLM',
    offers: [
      { marketplace: 'Яндекс.Маркет', price: 32990, rating: 4.7, reviews: 256 },
      { marketplace: 'СберМегаМаркет', price: 34990, rating: 4.6, reviews: 98 },
    ],
  },
  {
    title: 'Фен Dyson Supersonic',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80',
    query: 'dyson supersonic',
    code: 'DYS',
    offers: [
      { marketplace: 'Wildberries', price: 28990, rating: 4.8, reviews: 670 },
      { marketplace: 'Ozon', price: 30490, rating: 4.6, reviews: 211 },
    ],
  },
  {
    title: 'Игровая консоль PlayStation 5',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',
    query: 'playstation 5',
    code: 'PS5',
    offers: [
      { marketplace: 'Ozon', price: 49990, rating: 4.9, reviews: 1980 },
      { marketplace: 'Wildberries', price: 51490, rating: 4.7, reviews: 890 },
    ],
  },
  {
    title: 'Чайник электрический Bosch',
    image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&q=80',
    query: 'bosch electric kettle',
    code: 'BSHK',
    offers: [
      { marketplace: 'Яндекс.Маркет', price: 2490, rating: 4.5, reviews: 320 },
      { marketplace: 'СберМегаМаркет', price: 2690, rating: 4.3, reviews: 110 },
    ],
  },
  {
    title: 'Конструктор LEGO City',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80',
    query: 'lego city set',
    code: 'LEGOC',
    offers: [
      { marketplace: 'Wildberries', price: 4990, rating: 4.9, reviews: 540 },
      { marketplace: 'Ozon', price: 5290, rating: 4.7, reviews: 220 },
    ],
  },
  {
    title: 'Велосипед Stels Navigator',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
    query: 'stels navigator bike',
    code: 'STLN',
    offers: [
      { marketplace: 'СберМегаМаркет', price: 18990, rating: 4.4, reviews: 95 },
      { marketplace: 'Ozon', price: 19990, rating: 4.3, reviews: 61 },
    ],
  },
  {
    title: 'Палатка туристическая 3-местная',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    query: 'tourist tent 3 person',
    code: 'TENT3',
    offers: [
      { marketplace: 'Wildberries', price: 6990, rating: 4.5, reviews: 178 },
      { marketplace: 'AliExpress', price: 5490, rating: 4.0, reviews: 340 },
    ],
  },
  {
    title: 'Блендер Philips HR2222',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
    query: 'philips blender hr2222',
    code: 'PHB',
    offers: [
      { marketplace: 'Яндекс.Маркет', price: 3490, rating: 4.6, reviews: 410 },
      { marketplace: 'Wildberries', price: 3790, rating: 4.4, reviews: 150 },
    ],
  },
]

export const products = RAW.flatMap((item, productIndex) =>
  item.offers.map((offer, offerIndex) => {
    const prefix = PREFIX[offer.marketplace]
    const sku = `${prefix}-${item.code}-${100 + productIndex * 10 + offerIndex}`

    return {
      id: `p${productIndex}-${offerIndex}`,
      title: item.title,
      image: item.image,
      price: offer.price,
      rating: offer.rating,
      reviews: offer.reviews,
      marketplace: offer.marketplace,
      sku,
      url: SEARCH_URLS[offer.marketplace](item.query),
    }
  }),
)

export const marketplaces = [...new Set(products.map((p) => p.marketplace))]
