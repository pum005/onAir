import React, { useState, useEffect, useCallback, useRef} from 'react';
import styles from './Game.module.css';
import playerImage from '../../assets/player.png';

const GAME_SIZE = 600;
const PLAYER_SIZE = 10;
const BULLET_SIZE = 10;
const BULLET_SPEED = 10;
const PLAYER_SPEED = 2; 

type Bullet = {
    id: number;
    x: number;
    y: number;
    velocity: { x: number, y: number };
    color: string;
};

const Game = () => {
    const [playerPosition, setPlayerPosition] = useState({ x: (GAME_SIZE - PLAYER_SIZE) / 2, y: (GAME_SIZE - PLAYER_SIZE) / 2 });
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
    const [isGameStarted, setIsGameStarted] = useState(false);

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    // 게임 시간 (초) 상태 변수
    const [gameTime, setGameTime] = useState(0);
    // 게임 타이머 ID
    const gameTimerId = useRef<number | null>(null);
    
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
    }, []);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
    }, []);

    const formatTime = (time: number) => {
        const seconds = Math.floor(time / 1000).toString().padStart(2, '0');
        const milliseconds = (time % 1000).toString().padStart(3, '0').substring(0, 2); // 처음 두 자리만 표시
        return `${seconds}:${milliseconds}`;
    };

    const generateBullet = useCallback(() => {
        const angle = Math.random() * 2 * Math.PI;
        const speed = BULLET_SPEED;
        
        // Calculate start position on the edge of the circle
        const x = (GAME_SIZE / 2) + (GAME_SIZE / 2 + BULLET_SIZE) * Math.cos(angle);
        const y = (GAME_SIZE / 2) + (GAME_SIZE / 2 + BULLET_SIZE) * Math.sin(angle);

        const deviation = (Math.random() - 0.5) * Math.PI / 3; // Deviating up to 60 degrees from the center
        const adjustedAngle = angle + deviation;

        const velocity = {
            x: -speed * Math.cos(adjustedAngle),
            y: -speed * Math.sin(adjustedAngle)
        };

        return { id: Date.now(), x, y, velocity, color: getRandomColor() };
    }, []);

    const movePlayer = useCallback(() => {
        let dx = 0;
        let dy = 0;
    
        if (keysPressed["ArrowUp"] || keysPressed["w"]) dy -= 1;
        if (keysPressed["ArrowDown"] || keysPressed["s"]) dy += 1;
        if (keysPressed["ArrowLeft"] || keysPressed["a"]) dx -= 1;
        if (keysPressed["ArrowRight"] || keysPressed["d"]) dx += 1;
    
        if (dx !== 0 || dy !== 0) {
            setPlayerPosition((prev) => {
                let newX = prev.x + dx * PLAYER_SPEED;
                let newY = prev.y + dy * PLAYER_SPEED;
    
                const distance = Math.sqrt((newX - GAME_SIZE / 2) ** 2 + (newY - GAME_SIZE / 2) ** 2);
                const maxDistance = GAME_SIZE / 2 - PLAYER_SIZE / 2;
    
                if (distance > maxDistance) {
                    setIsGameOver(true);  // End the game if player goes beyond the boundary
                    return prev;          // Return previous position to prevent player from moving
                }
    
                return { x: newX, y: newY };
            });
        }
    
        frameId = requestAnimationFrame(movePlayer);
    }, [keysPressed]);

    let frameId: number;
    let bulletFrameId: number;

    useEffect(() => {
        frameId = requestAnimationFrame(movePlayer);
        return () => cancelAnimationFrame(frameId);
    }, [movePlayer]);

    useEffect(() => {
        const bulletMoveInterval = setInterval(() => {
            setBullets(prevBullets => prevBullets.map(bullet => {
                const newX = bullet.x + bullet.velocity.x;
                const newY = bullet.y + bullet.velocity.y;
                return { ...bullet, x: newX, y: newY };
            }).filter(bullet => {
                // Remove bullets that are off screen
                return bullet.x >= -BULLET_SIZE && bullet.x <= GAME_SIZE + BULLET_SIZE &&
                       bullet.y >= -BULLET_SIZE && bullet.y <= GAME_SIZE + BULLET_SIZE;
            }));
        }, 50);

        return () => clearInterval(bulletMoveInterval);
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    useEffect(() => {
        if (isGameStarted) {
            const bulletInterval = setInterval(() => {
                const newBullet = generateBullet();
                setBullets(prev => [...prev, newBullet]);
            }, 100);
    
            return () => clearInterval(bulletInterval);
        }
    }, [generateBullet, isGameStarted]);

    useEffect(() => {
        if (isGameStarted && !isGameOver) {
            gameTimerId.current = window.setInterval(() => {
                setGameTime(prevTime => prevTime + 10); // 10ms 증가
            }, 10); // 10ms마다 실행
        } else if (isGameOver && gameTimerId.current) {
            clearInterval(gameTimerId.current);
        }
    
        return () => {
            if (gameTimerId.current) {
                clearInterval(gameTimerId.current);
            }
        };
    }, [isGameStarted, isGameOver]);
    useEffect(() => {
        bullets.forEach(bullet => {
            if (
                bullet.x < playerPosition.x + PLAYER_SIZE &&
                bullet.x + BULLET_SIZE > playerPosition.x &&
                bullet.y < playerPosition.y + PLAYER_SIZE &&
                bullet.y + BULLET_SIZE > playerPosition.y
            ) {
                setIsGameOver(true);
                setBullets([]);
            }
        });
    }, [bullets, playerPosition]);

    const restartGame = () => {
        setIsGameOver(false);
        setPlayerPosition({ x: (GAME_SIZE - PLAYER_SIZE) / 2, y: (GAME_SIZE - PLAYER_SIZE) / 2 });
        setBullets([]);
        setGameTime(0); // 게임 시간 초기화
    };

    useEffect(() => {
        if (isGameOver) {
            cancelAnimationFrame(frameId); // 플레이어 이동 애니메이션 멈춤
        }
        return () => cancelAnimationFrame(frameId);
    }, [movePlayer, isGameOver]);

    

    return (
        <div className={styles.gameContainer}>
            {!isGameStarted ? (
                <div className={styles.startScreen}>
                    <h1>탄막 피하기</h1>
                    <h5>원에 닿으면 죽습니다.
                        <br />
                        최대한 오래 살아보세요!!
                    </h5>
                    <button onClick={() => setIsGameStarted(true)}>시작하기</button>
                </div>
            ) : (
                <>
                <div className={styles.timer}>{formatTime(gameTime)}</div>
                {!isGameOver && bullets.map(bullet => (
    <div 
        key={bullet.id} 
        className={styles.bullet} 
        style={{ left: bullet.x, top: bullet.y, backgroundColor: bullet.color }}
    ></div>
))}
                    {!isGameOver && <div className={styles.player} style={{ left: playerPosition.x, top: playerPosition.y, backgroundImage: `url(${playerImage})`, 
            backgroundSize: 'cover'  }}></div>}
                    {isGameOver && (
                        <div className={styles.gameOver}>
                            <div className={styles.centerTimer}>시간: {formatTime(gameTime)}</div>
                            <button className={styles.reButton} onClick={restartGame}>다시하기</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Game;
