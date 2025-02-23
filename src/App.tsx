import { Button } from '@components/common'
import { BattleMode } from '@components/game/BattleMode'
import { GameModeSelect } from '@components/game/GameModeSelect'
import { MathRace } from '@components/game/MathRace'
import { GameWrapper } from '@components/layout/GameWrapper'
import '@styles/global.css'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useDeviceAuth } from './hooks/useDeviceAuth'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameMode, setGameMode] = useState<'single' | 'battle' | null>(null)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const { isAuthorizedDevice, isLoading } = useDeviceAuth()

  const handleStartGame = () => {
    setIsPlaying(true)
    setFinalScore(null)
  }

  const handleGameComplete = (score: number) => {
    setFinalScore(score)
    setIsPlaying(false)
    setGameMode(null)
  }

  const handleSelectMode = (mode: 'single' | 'battle') => {
    setGameMode(mode)
    setIsPlaying(true)
  }

  const handleExit = () => {
    setIsPlaying(false)
    setGameMode(null)
  }

  if (isLoading) {
    return (
      <div className="loading">
        Loading...
      </div>
    )
  }

  return (
    <GameWrapper onExit={isPlaying ? handleExit : undefined}>
      <AnimatePresence mode="wait">
        {isPlaying ? (
          gameMode === 'battle' ? (
            <BattleMode
              key="battle"
              onComplete={handleGameComplete}
              onExit={handleExit}
            />
          ) : (
            <MathRace
              key="game"
              onComplete={handleGameComplete}
              mode="counting"
            />
          )
        ) : gameMode === null ? (
          <GameModeSelect
            key="mode-select"
            onSelectMode={handleSelectMode}
            canBattle={isAuthorizedDevice}
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
                {finalScore !== null ? 'Play Again!' : 'Start Playing!'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameWrapper>
  )
}

export default App
