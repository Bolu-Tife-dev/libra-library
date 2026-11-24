export default function Book3D({
  title,
  author,
  color = '#4338ca',
  className = '',
  style = '',
  floatClass = '',
  compact = false,
  position = 'absolute',
}) {
  const size = compact ? 'h-36 w-24' : 'h-52 w-36'
  const pad = compact ? 'p-2.5' : 'p-4'
  const titleSize = compact ? 'text-[11px]' : 'text-sm'
  const authorSize = compact ? 'text-[8px]' : 'text-[10px]'
  const spine = compact ? 'w-2' : 'w-2.5'

  return (
    <div
      className={`book-3d preserve-3d ${position} ${className}`}
      style={{ '--book-transform': style || 'none' }}
    >
      <div className={`preserve-3d relative ${size} ${floatClass}`}>
        {/* cast shadow on the floor */}
        <div className="absolute -bottom-3 left-2 h-4 w-28 rounded-full bg-slate-950/30 blur-md" />

        {/* page block behind the cover, offset to suggest thickness */}
        <div className="absolute inset-y-1 right-0 w-3 translate-x-1 rounded-r-sm border-y border-r border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-300" />
        <div className="absolute inset-y-1 right-0 w-2 translate-x-2 rounded-r-sm bg-slate-200 dark:bg-slate-400" />

        {/* cover */}
        <div className="absolute inset-0 overflow-hidden rounded-r-sm rounded-l-sm border border-black/10" style={{ backgroundColor: color }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />
          <div className="absolute left-2 top-0 h-full w-px bg-white/30" />
          <div className={`absolute inset-0 flex flex-col justify-between ${pad} text-white`}>
            <span className={`${authorSize} font-medium uppercase tracking-[0.16em] text-white/60`}>Libra</span>
            <div>
              <p className={`${titleSize} font-semibold leading-snug drop-shadow-sm`}>{title}</p>
              <p className={`mt-1 ${authorSize} text-white/70`}>{author}</p>
            </div>
          </div>
        </div>

        {/* spine */}
        <div className={`absolute left-0 top-0 h-full ${spine} bg-black/30`} style={{ transform: 'rotateY(-90deg)', transformOrigin: 'left center' }} />
      </div>
    </div>
  )
}
