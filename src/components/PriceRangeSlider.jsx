export function PriceRangeSlider({ value, onChange, max }) {
  const [min, current] = value

  const handleMinChange = (e) => {
    const next = Math.min(Number(e.target.value), current - 100)
    onChange([next, current])
  }

  const handleMaxChange = (e) => {
    const next = Math.max(Number(e.target.value), min + 100)
    onChange([min, next])
  }

  const minPercent = (min / max) * 100
  const maxPercent = (current / max) * 100

  return (
    <div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-gray-200 dark:bg-white/10" />
        <div
          className="absolute h-1.5 rounded-full bg-[#007AFF]"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={max}
          step={100}
          value={min}
          onChange={handleMinChange}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
        />
        <input
          type="range"
          min={0}
          max={max}
          step={100}
          value={current}
          onChange={handleMaxChange}
          className="range-thumb absolute w-full appearance-none bg-transparent pointer-events-none"
        />
      </div>
      <div className="flex items-center justify-between text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-1">
        <span>{min.toLocaleString('ru-RU')} ₽</span>
        <span>{current.toLocaleString('ru-RU')} ₽</span>
      </div>
    </div>
  )
}
