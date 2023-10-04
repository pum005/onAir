import React, { useState, useEffect } from 'react';
import styles from './Loading.module.css';

export const Loading = () => {
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  useEffect(() => {
    placeBallRandomly();
  }, []);

  const placeBallRandomly = () => {
    const x = Math.random() * (window.innerWidth - 50); // 50 is approximate ball size
    const y = Math.random() * (window.innerHeight - 50);
    setBallPosition({ x, y });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <img src={"/gif/loading4.gif"} alt="Loading..." />
      </div>
      <h2 style={{ color: "white" }}>로딩중...</h2>
      <div className={styles.score}>Score: {score}</div>
      <div 
        className={styles.ball} 
        style={{ left: ballPosition.x, top: ballPosition.y }} 
        onClick={() => {
          setScore(score + 1);
          placeBallRandomly();
        }}
      />
    </div>
  );
};