import { useState, useEffect } from 'react'

const FloatingShapes = () => {
  const [shapes, setShapes] = useState([])

  useEffect(() => {
    const generateShapes = () => {
      const shapeTypes = ['circle', 'triangle', 'square', 'diamond', 'hexagon']
      const colors = [
        'rgba(59, 130, 246, 0.15)', // blue
        'rgba(16, 185, 129, 0.15)', // green  
        'rgba(139, 92, 246, 0.15)', // purple
        'rgba(236, 72, 153, 0.15)', // pink
        'rgba(245, 158, 11, 0.15)', // orange
        'rgba(239, 68, 68, 0.15)'   // red
      ]
      
      const newShapes = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 60 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5
      }))
      setShapes(newShapes)
    }

    generateShapes()
  }, [])

  const renderShape = (shape) => {
    const { type, color, size, rotation } = shape
    
    const baseStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      position: 'absolute',
      borderRadius: type === 'circle' ? '50%' : type === 'diamond' ? '0' : '8px',
      transform: `rotate(${rotation}deg)`,
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(2px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }

    if (type === 'triangle') {
      return (
        <div
          key={shape.id}
          style={{
            ...baseStyle,
            backgroundColor: 'transparent',
            width: 0,
            height: 0,
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
            borderRadius: 0
          }}
        />
      )
    }

    if (type === 'diamond') {
      return (
        <div
          key={shape.id}
          style={{
            ...baseStyle,
            transform: `rotate(45deg) rotate(${rotation}deg)`,
            borderRadius: '4px'
          }}
        />
      )
    }

    if (type === 'hexagon') {
      return (
        <div
          key={shape.id}
          style={{
            ...baseStyle,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            borderRadius: 0
          }}
        />
      )
    }

    return (
      <div
        key={shape.id}
        style={baseStyle}
      />
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          style={{
            position: 'absolute',
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            animation: `floatAround ${shape.duration}s ease-in-out infinite ${shape.delay}s, 
                       pulse ${shape.duration * 0.3}s ease-in-out infinite alternate`
          }}
        >
          {renderShape(shape)}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes floatAround {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(180deg);
          }
          75% {
            transform: translate(-40px, -10px) rotate(270deg);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          100% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}

export default FloatingShapes 