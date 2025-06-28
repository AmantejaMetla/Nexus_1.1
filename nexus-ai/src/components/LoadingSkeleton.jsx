const LoadingSkeleton = ({ type = 'message', theme = 'light' }) => {
  const baseColor = theme === 'dark' ? '#374151' : '#F3F4F6'
  const highlightColor = theme === 'dark' ? '#4B5563' : '#E5E7EB'

  const skeletonStyle = {
    background: `linear-gradient(90deg, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite ease-in-out',
    borderRadius: '8px'
  }

  if (type === 'message') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        maxWidth: '80%'
      }}>
        {/* Avatar skeleton */}
        <div style={{
          ...skeletonStyle,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          flexShrink: 0
        }} />
        
        {/* Message content skeleton */}
        <div style={{ flex: 1 }}>
          <div style={{
            ...skeletonStyle,
            height: '16px',
            width: '60%',
            marginBottom: '8px'
          }} />
          <div style={{
            ...skeletonStyle,
            height: '16px',
            width: '85%',
            marginBottom: '8px'
          }} />
          <div style={{
            ...skeletonStyle,
            height: '16px',
            width: '45%'
          }} />
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    )
  }

  if (type === 'typing') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
        borderRadius: '20px',
        maxWidth: 'fit-content'
      }}>
        <div style={{
          ...skeletonStyle,
          width: '32px',
          height: '32px',
          borderRadius: '50%'
        }} />
        
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: theme === 'dark' ? '#6B7280' : '#9CA3AF',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '0s'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: theme === 'dark' ? '#6B7280' : '#9CA3AF',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '0.16s'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: theme === 'dark' ? '#6B7280' : '#9CA3AF',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '0.32s'
          }} />
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    )
  }

  if (type === 'profile') {
    return (
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Profile header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            ...skeletonStyle,
            width: '64px',
            height: '64px',
            borderRadius: '50%'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              ...skeletonStyle,
              height: '20px',
              width: '70%',
              marginBottom: '8px'
            }} />
            <div style={{
              ...skeletonStyle,
              height: '16px',
              width: '50%'
            }} />
          </div>
        </div>

        {/* Profile stats */}
        <div style={{
          display: 'flex',
          gap: '16px'
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1,
              textAlign: 'center'
            }}>
              <div style={{
                ...skeletonStyle,
                height: '24px',
                marginBottom: '8px'
              }} />
              <div style={{
                ...skeletonStyle,
                height: '14px',
                width: '60%',
                margin: '0 auto'
              }} />
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    )
  }

  // Default skeleton
  return (
    <div style={{
      ...skeletonStyle,
      height: '20px',
      width: '100%'
    }}>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingSkeleton 