import '@styles/global.css'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button, NumberPad, ProgressBar } from '@components/common'
import { GameWrapper } from '@components/layout'

function App() {
  const [value, setValue] = useState('')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleNumberSelect = (num: number) => {
    setValue(prev => prev + num)
  }

  const handleDelete = () => {
    setValue(prev => prev.slice(0, -1))
  }

  const handleSubmit = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setProgress(prev => Math.min(prev + 10, 100))
      setValue('')
      setIsLoading(false)
    }, 500)
  }

  return (
    <GameWrapper isLoading={isLoading}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container"
      >
        <header className="text-center">
          <h1 className="text-primary">Math Champions</h1>
          <p>Let's make learning math fun!</p>
        </header>
        
        <main className="text-center" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Button variant="primary" size="large">
              Start Game
            </Button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <ProgressBar 
              value={progress} 
              max={100} 
              showLabel 
              animated 
              height="20px"
            />
          </div>

          <div>
            <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>
              {value || '0'}
            </div>
            <NumberPad
              onNumberSelect={handleNumberSelect}
              onDelete={handleDelete}
              onSubmit={handleSubmit}
              currentValue={value}
              disabled={isLoading}
            />
          </div>
        </main>
      </motion.div>
    </GameWrapper>
  )
}

export default App
