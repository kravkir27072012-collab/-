# FindBest — поиск лучших товаров на маркетплейсах

Фронтенд агрегатора товаров: поиск, фильтры, сортировка, карточки
товаров с автоматическим выделением «лучшего выбора». Сейчас
работает на моковых данных, готов к подключению реальных API.

## Структура

- `src/data/products.js` — моковые товары.
- `src/services/productService.js` — единая точка загрузки данных
  (`fetchProducts`). Сюда подставляются реальные запросы к API
  Wildberries/Ozon/Яндекс.Маркета и т.д. — верните массив объектов
  такой же формы, как в `data/products.js`.
- `src/components/` — UI-компоненты (поиск, фильтры, карточка,
  скелетон, empty-state, переключатель темы).
- `src/hooks/` — `useDebouncedValue` (дебаунс поиска),
  `useDarkMode` (тёмная тема).

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production-сборка в dist/
npm run preview  # просмотр production-сборки
```

## Подключение реальных маркетплейсов

В `src/services/productService.js` замените тело `fetchProducts(query)`
на запросы к нужным API (Wildberries, Ozon, Яндекс.Маркет и т.п.),
агрегируйте результаты в один массив с полями: `id`, `title`, `image`,
`price`, `rating`, `reviews`, `marketplace`, `sku`, `url`. Остальной
код (фильтры, сортировка, выбор «лучшего товара») трогать не нужно.
