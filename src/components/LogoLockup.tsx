import LogoPrego from './LogoPrego'

/**
 * Lockup completo de la marca, replicando el logo oficial:
 * "COFFEE HOUSE" en arco · EST. — isotipo — 2024 · "PREGO"
 */
export default function LogoLockup({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Arco superior + isotipo flanqueado por EST. / 2024 */}
      <div className="relative w-full">
        <svg viewBox="0 0 300 90" className="w-full overflow-visible" aria-hidden="true">
          <defs>
            <path id="arco" d="M18 88a150 150 0 0 1 264 0" fill="none" />
          </defs>
          <text
            fill="currentColor"
            fontSize="23"
            fontWeight="500"
            letterSpacing="6"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <textPath href="#arco" startOffset="50%" textAnchor="middle">
              COFFEE HOUSE
            </textPath>
          </text>
        </svg>

        <div className="-mt-1 flex items-center justify-center gap-4 sm:gap-6">
          <span className="text-[0.7rem] font-medium tracking-[0.12em] sm:text-sm">
            EST.
          </span>
          <LogoPrego className="h-20 w-auto sm:h-24" />
          <span className="text-[0.7rem] font-medium tracking-[0.12em] sm:text-sm">
            2024
          </span>
        </div>
      </div>

      {/* Wordmark condensado */}
      <span
        className="mt-6 block text-[clamp(2.5rem,11vw,4.5rem)] font-light leading-none tracking-[0.14em] [text-indent:0.14em]"
        style={{ fontStretch: 'condensed' }}
      >
        PREGO
      </span>
    </div>
  )
}
