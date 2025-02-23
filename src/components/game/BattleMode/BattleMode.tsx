import { useDeviceAuth } from '@/hooks/useDeviceAuth';
import { db } from '@/lib/firebase';
import { Problem } from '@/types/game.types';
import { get, onValue, ref, set } from 'firebase/database';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MathRace } from '../MathRace';
import styles from './BattleMode.module.css';

interface BattleState {
  players: {
    [deviceId: string]: {
      score: number;
      progress: number;
      health: number;
      isReady: boolean;
      lastActive: number;
    };
  };
  currentProblem?: Problem;
  gameStatus: 'waiting' | 'playing' | 'completed';
  winner?: string;
}

interface BattleModeProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
}

export const BattleMode = ({ onComplete, onExit }: BattleModeProps) => {
  const { deviceId } = useDeviceAuth();
  const [battleState, setBattleState] = useState<BattleState>({
    players: {},
    gameStatus: 'waiting',
  });
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    // Join or create a battle room
    const findOrCreateRoom = async () => {
      const roomsRef = ref(db, 'battleRooms');
      const snapshot = await get(roomsRef);
      const rooms = snapshot.val() || {};

      // Find an available room or create a new one
      let availableRoom = null;
      for (const [id, room] of Object.entries(rooms)) {
        const roomData = room as BattleState;
        if (roomData.gameStatus === 'waiting' && Object.keys(roomData.players).length < 2) {
          availableRoom = id;
          break;
        }
      }

      const finalRoomId = availableRoom || `battle_${Date.now()}`;
      setRoomId(finalRoomId);

      // Join the room
      const roomRef = ref(db, `battleRooms/${finalRoomId}`);
      const currentRoom = (await get(roomRef)).val() || {
        players: {},
        gameStatus: 'waiting',
      };

      // Add player to room
      currentRoom.players[deviceId] = {
        score: 0,
        progress: 0,
        health: 100,
        isReady: true,
        lastActive: Date.now(),
      };

      await set(roomRef, currentRoom);

      // Listen for room updates
      onValue(roomRef, (snapshot) => {
        const newState = snapshot.val() as BattleState;
        setBattleState(newState);

        // Start game if both players are ready
        if (
          newState.gameStatus === 'waiting' &&
          Object.keys(newState.players).length === 2 &&
          Object.values(newState.players).every((p) => p.isReady)
        ) {
          set(ref(db, `battleRooms/${finalRoomId}/gameStatus`), 'playing');
        }
      });
    };

    findOrCreateRoom();
  }, [deviceId]);

  const handleAnswer = async (answer: number) => {
    if (!roomId || !deviceId) return;

    const isCorrect = answer === battleState.currentProblem?.answer;
    const roomRef = ref(db, `battleRooms/${roomId}`);
    const playerRef = ref(db, `battleRooms/${roomId}/players/${deviceId}`);

    // Update player stats
    const playerUpdate = {
      score: battleState.players[deviceId].score + (isCorrect ? 10 : 0),
      progress: battleState.players[deviceId].progress + (isCorrect ? 10 : 0),
      lastActive: Date.now(),
    };

    // If correct, damage opponent
    if (isCorrect) {
      const opponent = Object.keys(battleState.players).find((id) => id !== deviceId);
      if (opponent) {
        const opponentRef = ref(db, `battleRooms/${roomId}/players/${opponent}`);
        const opponentHealth = battleState.players[opponent].health - 20;
        await set(opponentRef, {
          ...battleState.players[opponent],
          health: opponentHealth,
        });

        // Check for game over
        if (opponentHealth <= 0) {
          await set(roomRef, {
            ...battleState,
            gameStatus: 'completed',
            winner: deviceId,
          });
          if (onComplete) {
            onComplete(playerUpdate.score);
          }
        }
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

  if (!deviceId || !roomId) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.battleContainer}>
      {/* Battle HUD */}
      <motion.div className={styles.battleHUD}>
        <div className={styles.playerStats}>
          <motion.div
            className={styles.healthBar}
            style={{
              width: `${battleState.players[deviceId]?.health || 0}%`,
            }}
          />
          <span>HP: {battleState.players[deviceId]?.health || 0}</span>
          <span>Score: {battleState.players[deviceId]?.score || 0}</span>
        </div>

        {getOpponentStats() && (
          <div className={styles.opponentStats}>
            <motion.div
              className={styles.healthBar}
              style={{
                width: `${getOpponentStats()?.health || 0}%`,
              }}
            />
            <span>Opponent HP: {getOpponentStats()?.health || 0}</span>
            <span>Score: {getOpponentStats()?.score || 0}</span>
          </div>
        )}
      </motion.div>

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
          <MathRace
            mode="arithmetic"
            difficulty="medium"
            onComplete={(score) => {
              if (onComplete) onComplete(score);
            }}
            onExit={onExit}
            onAnswer={handleAnswer}
          />
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