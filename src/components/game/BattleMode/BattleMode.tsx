import { useDeviceAuth } from '@/hooks/useDeviceAuth';
import { db } from '@/lib/firebase';
import { get, onValue, ref, set } from 'firebase/database';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MathRace } from '../MathRace';
import { Avatar } from '../MathRace/Avatar';
import { RaceTrack } from '../MathRace/RaceTrack';
import styles from './BattleMode.module.css';

interface BattleState {
  players: {
    [deviceId: string]: {
      name: string;
      score: number;
      progress: number;
      health: number;
      isReady: boolean;
      lastActive: number;
    };
  };
  gameStatus: 'waiting' | 'playing' | 'completed';
  winner?: string;
}

interface BattleModeProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

const FIXED_ROOM_ID = 'main_battle_room';

export const BattleMode = ({ onComplete, onExit }: BattleModeProps) => {
  const { deviceId, deviceInfo } = useDeviceAuth();
  const [battleState, setBattleState] = useState<BattleState>({
    players: {},
    gameStatus: 'waiting',
  });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (!deviceId) return;

    // Join or create a battle room
    const findOrCreateRoom = async () => {
      try {
        console.log('Finding or creating room...');
        
        // Join the room
        const roomRef = ref(db, `battleRooms/${FIXED_ROOM_ID}`);
        console.log('Room ref:', roomRef);
        
        const snapshot = await get(roomRef);
        const currentRoom = snapshot.val() || {
          players: {},
          gameStatus: 'waiting',
        };
        console.log('Current room data:', currentRoom);

        // Add player to room if not already present
        if (!currentRoom.players[deviceId]) {
          currentRoom.players[deviceId] = {
            name: deviceInfo?.name || 'Player',
            score: 0,
            progress: 0,
            health: 100,
            isReady: true,
            lastActive: Date.now(),
          };
        }

        console.log('Setting room data:', currentRoom);
        await set(roomRef, currentRoom);
        console.log('Room data set successfully');

        // Listen for room updates
        onValue(roomRef, (snapshot) => {
          console.log('Room update:', snapshot.val());
          const newState = snapshot.val() as BattleState;
          setBattleState(newState);

          // Start game if both players are ready
          if (
            newState.gameStatus === 'waiting' &&
            Object.keys(newState.players).length === 2 &&
            Object.values(newState.players).every((p) => p.isReady)
          ) {
            set(ref(db, `battleRooms/${FIXED_ROOM_ID}/gameStatus`), 'playing');
          }
        });
      } catch (error) {
        console.error('Error in findOrCreateRoom:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
      }
    };

    findOrCreateRoom();
  }, [deviceId, deviceInfo]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (!deviceId) return;

    const playerRef = ref(db, `battleRooms/${FIXED_ROOM_ID}/players/${deviceId}`);

    // Update player stats
    const playerUpdate = {
      score: battleState.players[deviceId].score + (isCorrect ? 10 : 0),
      progress: battleState.players[deviceId].progress + (isCorrect ? 10 : 0),
      lastActive: Date.now(),
    };

    if (isCorrect) {
      // Animate the avatar
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 500);

      // Check for game over
      if (playerUpdate.progress >= 100) {
        const roomRef = ref(db, `battleRooms/${FIXED_ROOM_ID}`);
        await set(roomRef, {
          ...battleState,
          gameStatus: 'completed',
          winner: deviceId,
        });
        if (onComplete) {
          onComplete(playerUpdate.score);
        }
        return;
      }
    }

    await set(playerRef, {
      ...battleState.players[deviceId],
      ...playerUpdate,
    });
  };

  const getOpponentStats = () => {
    const opponent = Object.entries(battleState.players).find(([id]) => id !== deviceId);
    return opponent ? opponent[1] : null;
  };

  if (!deviceId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.battleContainer}>
      <AnimatePresence mode="wait">
        {battleState.gameStatus === 'waiting' && (
          <motion.div
            className={styles.waitingScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>Waiting for opponent...</h2>
            <p>Players: {Object.keys(battleState.players).length}/2</p>
          </motion.div>
        )}

        {battleState.gameStatus === 'playing' && (
          <>
            <RaceTrack>
              {/* Player avatar */}
              <div className={styles.playerLabel}>
                {battleState.players[deviceId]?.name || 'Player'}
              </div>
              <Avatar
                progress={battleState.players[deviceId]?.progress || 0}
                isMoving={isMoving}
                character="🦁"
              />
            </RaceTrack>

            {/* Opponent track */}
            {getOpponentStats() && (
              <RaceTrack>
                <div className={styles.playerLabel}>
                  {getOpponentStats()?.name || 'Opponent'}
                </div>
                <Avatar
                  progress={getOpponentStats()?.progress || 0}
                  isMoving={false}
                  character="🦊"
                />
              </RaceTrack>
            )}

            <MathRace
              mode="simple_counting"
              difficulty="medium"
              onComplete={(score) => {
                if (onComplete) onComplete(score);
              }}
              onExit={onExit}
              onAnswer={(_, isCorrect) => handleAnswer(isCorrect)}
              hideTrack={true}
            />
          </>
        )}

        {battleState.gameStatus === 'completed' && (
          <motion.div
            className={styles.gameOver}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <h2>
              {battleState.winner === deviceId
                ? '🎉 Victory! 🎉'
                : '😔 Better luck next time!'}
            </h2>
            <button onClick={onExit} className={styles.exitButton}>
              Back to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 