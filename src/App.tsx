import { Button } from '@components/common'
import { MathRace } from '@components/game/MathRace'
import { GameWrapper } from '@components/layout'
import '@styles/global.css'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const handleGameComplete = (score: number) => {
    setFinalScore(score)
    setIsPlaying(false)
  }

  const handleStartGame = () => {
    setFinalScore(null)
    setIsPlaying(true)
  }

  return (
    <GameWrapper>
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <MathRace
            key="game"
            mode="counting"
            difficulty="easy"
            problemCount={5}
            onComplete={handleGameComplete}
            onExit={() => setIsPlaying(false)}
          />
        ) : (
          <motion.div
            key="menu"
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h1 className="text-primary">Math Champions</h1>
            <p>Count the animals and type the number! 🦁</p>
            
            {finalScore !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-success"
                style={{ margin: '2rem 0' }}
              >
                <h2>Fantastic counting! 🌟</h2>
                <p>Your score: {finalScore}</p>
              </motion.div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <Button
                variant="primary"
                size="large"
                onClick={handleStartGame}
              >
                {finalScore !== null ? 'Count Again!' : 'Start Counting!'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameWrapper>
  )
}

export default App
