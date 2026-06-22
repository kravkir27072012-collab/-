import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={() => onToggle(!isDark)}
      aria-label="Переключить тему"
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 shrink-0 ${
        isDark ? 'bg-[#007AFF]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center
                    transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {isDark ? <Moon size={13} className="text-[#007AFF]" /> : <Sun size={13} className="text-amber-500" />}
      </span>
    </button>
  )
}
