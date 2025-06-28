import { useState, useEffect } from 'react'

const TypewriterText = ({ text, speed = 30, onComplete, className, style }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      if (onComplete) {
        setTimeout(onComplete, 100)
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete])

  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return (
    <span className={className} style={style}>
      {displayedText}
      {!isComplete && (
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          backgroundColor: 'currentColor',
          marginLeft: '2px',
          animation: 'blink 1s infinite'
        }}>
          <style jsx>{`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
          `}</style>
        </span>
      )}
    </span>
  )
}

export default TypewriterText 