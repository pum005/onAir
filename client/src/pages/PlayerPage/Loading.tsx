import React, { useState, useEffect } from 'react';
import styles from './Loading.module.css';

export const Loading = () => {
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacleX, setObstacleX] = useState(800);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (isJumping) {
      let jumpHeight = 0;
      const jumpInterval = setInterval(() => {
        jumpHeight += 5;
        setPlayerY(playerY - jumpHeight);
        if (jumpHeight >= 100) {
          clearInterval(jumpInterval);
          setIsJumping(false);
        }
      }, 20);
      return () => clearInterval(jumpInterval);
    } else {
      let fallHeight = 0;
      const fallInterval = setInterval(() => {
        fallHeight += 5;
        setPlayerY(playerY + fallHeight);
        if (fallHeight >= 100) {
          clearInterval(fallInterval);
        }
      }, 20);
      return () => clearInterval(fallInterval);
    }
  }, [isJumping]);

  useEffect(() => {
    const obstacleInterval = setInterval(() => {
      setObstacleX(obstacleX - 5);
      if (obstacleX < -30) setObstacleX(800);
      if (obstacleX < 50 && obstacleX > 20 && playerY === 0) {
        setGameOver(true);
        clearInterval(obstacleInterval);
      }
    }, 20);
    return () => clearInterval(obstacleInterval);
  }, [obstacleX, playerY]);

  useEffect(() => {
    if (!gameOver) {
      const scoreInterval = setInterval(() => {
        setScore(score + 1);
      }, 100);
      return () => clearInterval(scoreInterval);
    }
  }, [score, gameOver]);

  return (
    <div className={styles.container}>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.game}>
        <div 
          className={styles.player} 
          style={{ bottom: `${playerY}px` }}
          onKeyPress={(e) => {
            if (e.code === 'Space' && !isJumping && !gameOver) {
              setIsJumping(true);
            }
          }}
          tabIndex={0} // Focusable for keypress
        />
        <div className={styles.obstacle} style={{ left: `${obstacleX}px` }} />
      </div>
    </div>
  );
};
