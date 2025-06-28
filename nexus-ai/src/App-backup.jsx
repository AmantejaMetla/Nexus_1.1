// Simple test version without Firebase - if this works, the issue is with Firebase
import React from 'react'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #dbeafe, #c7d2fe)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e40af', marginBottom: '1rem' }}>
          🎉 React is Working!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          If you see this, React is loading correctly.
        </p>
        <button 
          style={{
            background: '#4f46e5',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={() => alert('Button works!')}
        >
          Test Button
        </button>
        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>✅ Vite is running</p>
          <p>✅ React is loaded</p>
          <p>✅ JavaScript is working</p>
          <p>🔄 Now testing Firebase...</p>
        </div>
      </div>
    </div>
  )
}

export default App 