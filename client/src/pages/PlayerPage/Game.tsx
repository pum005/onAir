import React, { useState, useEffect } from 'react';
import styles from './Game.module.css';

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 30;
const OBSTACLE_WIDTH = 30;
const JUMP_MIN_HEIGHT = 100;
const JUMP_MAX_HEIGHT = 250;

type Obstacle = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const Game = () => {
  const [playerY, setPlayerY] = useState(GAME_HEIGHT - PLAYER_SIZE);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpEndTime, setJumpEndTime] = useState<number | null>(null);

  // Handle jump
  useEffect(() => {
    let jumpInterval: any;

    const handleJumpStart = () => {
      if (!isJumping) {
        setIsJumping(true);
        setJumpEndTime(Date.now() + 300);
      }
    };

    const handleJumpEnd = () => {
      if (isJumping) {
        const jumpDuration = Date.now() - (jumpEndTime || 0);
        const jumpHeight = JUMP_MIN_HEIGHT + (JUMP_MAX_HEIGHT - JUMP_MIN_HEIGHT) * (jumpDuration / 300);
        
        let currentJumpHeight = 0;

        jumpInterval = setInterval(() => {
          setPlayerY((prev) => prev - 5);
          currentJumpHeight += 5;

          if (currentJumpHeight >= jumpHeight) {
            clearInterval(jumpInterval);
            setIsJumping(false);
          }
        }, 10);
      }
    };

    window.addEventListener('mousedown', handleJumpStart);
    window.addEventListener('mouseup', handleJumpEnd);

    return () => {
      window.removeEventListener('mousedown', handleJumpStart);
      window.removeEventListener('mouseup', handleJumpEnd);
    };
  }, [isJumping, jumpEndTime]);

  // Generate obstacles with random height
  useEffect(() => {
    const obstacleInterval = setInterval(() => {
      const obstacleHeight = Math.floor(Math.random() * 150) + 50;
      const newObstacle = {
        id: Date.now(),
        x: GAME_WIDTH,
        y: GAME_HEIGHT - obstacleHeight,
        width: OBSTACLE_WIDTH,
        height: obstacleHeight,
      };
      setObstacles((prev) => [...prev, newObstacle]);
    }, 2000);

    return () => clearInterval(obstacleInterval);
  }, []);

  // Move obstacles
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((obs) => ({ ...obs, x: obs.x - 10 })).filter((obs) => obs.x > 0)
      );
    }, 30);

    return () => clearInterval(moveInterval);
  }, []);

  // Check collision
  useEffect(() => {
    obstacles.forEach((obs) => {
      if (
        playerY + PLAYER_SIZE > obs.y &&
        playerY < obs.y + obs.height &&
        PLAYER_SIZE > obs.x &&
        0 < obs.x + obs.width
      ) {
        // Collision detected
        alert('Game over! Your score: ' + score);
        setObstacles([]);
        setScore(0);
      } else {
        setScore((prev) => prev + 1);
      }
    });
  }, [obstacles, playerY, score]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.player} style={{ bottom: playerY }}></div>
      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className={styles.obstacle}
          style={{
            width: obs.width,
            height: obs.height,
            left: obs.x,
          }}
        ></div>
      ))}
      <div className={styles.score}>Score: {score}</div>
    </div>
  );
};

export default Game;
