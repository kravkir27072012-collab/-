const PALETTE = [
  ['#FF9500', '#FF3B30'],
  ['#34C759', '#30B0C7'],
  ['#5856D6', '#AF52DE'],
  ['#007AFF', '#5AC8FA'],
  ['#FF2D55', '#FF9500'],
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function initials(name) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function MarketplaceAvatar({ name, size = 22 }) {
  const [from, to] = PALETTE[hashString(name) % PALETTE.length]

  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials(name)}
    </span>
  )
}
