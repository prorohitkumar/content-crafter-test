import React from 'react'

export default function CodeGenerator() {
  return (
    <div className="center-container">
    <img src={`${process.env.PUBLIC_URL}/welcome.gif`} alt="Welcome" className="centered-image" />
    <div className="coming-soon-text">Coming Soon!</div>
  </div>
  )
}
