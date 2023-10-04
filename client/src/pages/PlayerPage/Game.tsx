import React, { useState, useEffect } from 'react';
import styles from './Game.module.css';

const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 30;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = Math.floor(Math.random() * 150) + 50; // Random height between 50 and 200

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

  // Handle jump
  useEffect(() => {
    const handleJump = () => {
      if (!isJumping) {
        setIsJumping(true);
        let jumpHeight = 0;

        const jumpInterval = setInterval(() => {
          setPlayerY((prev) => prev - 5);
          jumpHeight += 5;

          if (jumpHeight >= 100) {
            clearInterval(jumpInterval);
            setIsJumping(false);
          }
        }, 20);
      }
    };

    window.addEventListener('click', handleJump);
    return () => window.removeEventListener('click', handleJump);
  }, [isJumping]);

  // Generate obstacles
  useEffect(() => {
    const obstacleInterval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        x: GAME_WIDTH,
        y: GAME_HEIGHT - OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
      };
      setObstacles((prev) => [...prev, newObstacle]);
    }, 2000);

    return () => clearInterval(obstacleInterval);
  }, []);

  // Move obstacles
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((obs) => ({ ...obs, x: obs.x - 5 })).filter((obs) => obs.x > 0)
      );
    }, 50);

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
        }
    

export default Game;
