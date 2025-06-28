import { useState, useEffect } from 'react'
import FloatingShapes from './FloatingShapes'
import RippleEffect from './RippleEffect'

const LandingPage = ({ onEnterApp }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect - track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Geometric Shapes */}
      <FloatingShapes />

      {/* Parallax Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5,
        transform: `translate(${(mousePos.x - 50) * 0.1}px, ${(mousePos.y - 50) * 0.1}px) translateY(${scrollY * 0.2}px)`
      }}></div>

      {/* Parallax secondary layer */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        right: '-10%',
        bottom: '-10%',
        background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
        transform: `translate(${(mousePos.x - 50) * -0.05}px, ${(mousePos.y - 50) * -0.05}px) translateY(${scrollY * -0.1}px)`
      }}></div>

      {/* Main Content Container */}
      <div style={{
        textAlign: 'center',
        zIndex: 10,
        maxWidth: '800px',
        padding: '0 20px',
        transform: `translateY(${scrollY * -0.3}px)`
      }}>
        {/* Masked "Nexus" Text with enhanced animations */}
        <h1 style={{
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: '900',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Inter", sans-serif',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)',
          backgroundSize: '400% 400%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          margin: '0 0 20px',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          animation: 'gradient 8s ease infinite, textFloat 6s ease-in-out infinite',
          textShadow: '0 0 40px rgba(59, 130, 246, 0.2)',
          transform: `translate(${(mousePos.x - 50) * 0.02}px, ${(mousePos.y - 50) * 0.02}px)`
        }}>
          Nexus
        </h1>

        {/* Enhanced Tagline */}
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: 'rgba(51, 65, 85, 0.9)',
          margin: '0 0 40px',
          fontWeight: '300',
          letterSpacing: '0.5px',
          lineHeight: 1.6,
          animation: 'fadeInUp 1s ease-out 0.5s both',
          transform: `translate(${(mousePos.x - 50) * 0.01}px, ${(mousePos.y - 50) * 0.01}px)`
        }}>
          Intuitive • Modular • Intelligent
          <br />
          <span style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            opacity: 0.7 
          }}>
            The future of AI interaction starts here.
          </span>
        </p>

        {/* Enhanced CTA Button with Ripple Effect */}
        <RippleEffect color="rgba(59, 130, 246, 0.3)">
          <button
            onClick={onEnterApp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: isHovered 
                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '50px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              backdropFilter: 'blur(20px)',
              boxShadow: isHovered 
                ? '0 8px 32px rgba(59, 130, 246, 0.4), 0 0 0 2px rgba(59, 130, 246, 0.2)' 
                : '0 4px 16px rgba(59, 130, 246, 0.3)',
              transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
              letterSpacing: '0.5px',
              animation: 'breathe 4s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 2
            }}>
              Get Started
            </span>
          </button>
        </RippleEffect>

      </div>

      {/* Enhanced Bottom Text - Positioned outside main container */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        textAlign: 'center',
        zIndex: 20
      }}>
        <p style={{
          fontSize: '14px',
          color: 'rgba(51, 65, 85, 0.6)',
          margin: 0,
          fontWeight: '300',
          animation: 'fadeInUp 1s ease-out 1s both'
        }}>
          Experience the next generation of AI conversation
        </p>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes textFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage 