import { useRef, useState } from 'react'

/* A card that follows the cursor in 3D. Resets smoothly when the cursor leaves. */
export default function TiltCard({ children, className = '', max = 5 }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)')
  const [transition, setTransition] = useState('transform 350ms ease')

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransition('transform 90ms linear')
    setTransform(`rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`)
  }

  function handleLeave() {
    setTransition('transform 400ms ease')
    setTransform('rotateX(0deg) rotateY(0deg)')
  }

  return (
    <div className="perspective-scene">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transform, transition }}
        className={`card preserve-3d h-full ${className}`}
      >
        <div className="preserve-3d h-full" style={{ transform: 'translateZ(14px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
