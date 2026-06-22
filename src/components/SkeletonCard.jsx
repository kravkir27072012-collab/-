export function SkeletonCard() {
  return (
    <div className="rounded-[20px] bg-white dark:bg-[#1C1C20] border border-black/5 dark:border-white/10 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="skeleton rounded-[16px] aspect-square mb-3" />
      <div className="skeleton h-4 rounded-full mb-2 w-4/5" />
      <div className="skeleton h-4 rounded-full mb-3 w-2/5" />
      <div className="skeleton h-3 rounded-full mb-2 w-3/5" />
      <div className="skeleton h-3 rounded-full w-2/5" />
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
        <div className="skeleton h-3 rounded-full w-1/4" />
        <div className="skeleton h-7 rounded-full w-1/3" />
      </div>
    </div>
  )
}
