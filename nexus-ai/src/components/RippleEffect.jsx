import { useState, useEffect } from 'react'

const RippleEffect = ({ trigger, children, color = 'rgba(255, 255, 255, 0.6)' }) => {
  const [ripples, setRipples] = useState([])

  const createRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.max(rect.width, rect.height) * 2
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }

  useEffect(() => {
    if (trigger) {
      // Auto-trigger ripple from center if no click event
      const fakeEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 50 })
        },
        clientX: 100,
        clientY: 25
      }
      createRipple(fakeEvent)
    }
  }, [trigger])

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={createRipple}
    >
      {children}
      
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default RippleEffect 