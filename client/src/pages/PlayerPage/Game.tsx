import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Game.module.css";
import playerImage from "../../assets/player.png";
import axios from "axios";
import goldMedal from "../../assets/금메달-removebg-preview.png";
import silverMedal from "../../assets/은메달-removebg-preview.png";
import bronzeMedal from "../../assets/동메달-removebg-preview.png";
import ReplayIcon from "@mui/icons-material/Replay";
import { FaRankingStar } from "react-icons/fa6";
const GAME_SIZE = 600;
const PLAYER_SIZE = 10;
const BULLET_SIZE = 10;
const BULLET_SPEED = 10;
const PLAYER_SPEED = 2;

type Bullet = {
  id: number;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  color: string;
};

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState({
    x: (GAME_SIZE - PLAYER_SIZE) / 2,
    y: (GAME_SIZE - PLAYER_SIZE) / 2,
  });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const [isGameStarted, setIsGameStarted] = useState(false);

  // 랭킹 데이터를 저장할 상태 변수
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  type RankingItem = {
    index: number;
    profileImage: string;
    nickname: string;
    record: number;
  };

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
    setKeysPressed(prev => ({ ...prev, [e.key]: true }));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeysPressed(prev => ({ ...prev, [e.key]: false }));
  }, []);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000)
      .toString()
      .padStart(2, "0");
    const milliseconds = (time % 1000)
      .toString()
      .padStart(3, "0")
      .substring(0, 2); // 처음 두 자리만 표시
    return `${seconds} : ${milliseconds}`;
  };

  const generateBullet = useCallback(() => {
    const angle = Math.random() * 2 * Math.PI;
    const speed = BULLET_SPEED;

    // Calculate start position on the edge of the circle
    const x = GAME_SIZE / 2 + (GAME_SIZE / 2 + BULLET_SIZE) * Math.cos(angle);
    const y = GAME_SIZE / 2 + (GAME_SIZE / 2 + BULLET_SIZE) * Math.sin(angle);

    const deviation = ((Math.random() - 0.5) * Math.PI) / 3; // Deviating up to 60 degrees from the center
    const adjustedAngle = angle + deviation;

    const velocity = {
      x: -speed * Math.cos(adjustedAngle),
      y: -speed * Math.sin(adjustedAngle),
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
      setPlayerPosition(prev => {
        let newX = prev.x + dx * PLAYER_SPEED;
        let newY = prev.y + dy * PLAYER_SPEED;

        const distance = Math.sqrt(
          (newX - GAME_SIZE / 2) ** 2 + (newY - GAME_SIZE / 2) ** 2
        );
        const maxDistance = GAME_SIZE / 2 - PLAYER_SIZE / 2;

        if (distance > maxDistance) {
          setIsGameOver(true); // End the game if player goes beyond the boundary
          return prev; // Return previous position to prevent player from moving
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

  // 게임 시작 시 랭킹 데이터 가져오기
  useEffect(() => {
    axios
      .get("https://j9b302.p.ssafy.io/api/minigame/rank", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      })
      .then(response => {
        setRanking(response.data);
      })
      .catch(error => {
        console.error("랭킹 데이터 가져오기 실패", error);
      });
  }, [isGameStarted]);

  // 랭킹 갱신 함수
  const updateRanking = () => {
    axios
      .post(
        "https://j9b302.p.ssafy.io/api/minigame/rank",
        { record: gameTime },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      )
      .then(response => {
        console.log("랭킹이 갱신되었습니다.", response.data);
        // 랭킹 갱신 성공 후 랭킹 정보를 다시 가져옵니다.
        return axios.get("https://j9b302.p.ssafy.io/api/minigame/rank", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      })
      .then(response => {
        setRanking(response.data); // 가져온 랭킹 정보로 상태를 업데이트합니다.
        setIsGameStarted(false); // 게임 시작 화면으로 돌아갑니다.
      })
      .catch(error => {
        console.error("랭킹 갱신 또는 가져오기 실패", error);
      });
  };

  useEffect(() => {
    const bulletMoveInterval = setInterval(() => {
      setBullets(prevBullets =>
        prevBullets
          .map(bullet => {
            const newX = bullet.x + bullet.velocity.x;
            const newY = bullet.y + bullet.velocity.y;
            return { ...bullet, x: newX, y: newY };
          })
          .filter(bullet => {
            // Remove bullets that are off screen
            return (
              bullet.x >= -BULLET_SIZE &&
              bullet.x <= GAME_SIZE + BULLET_SIZE &&
              bullet.y >= -BULLET_SIZE &&
              bullet.y <= GAME_SIZE + BULLET_SIZE
            );
          })
      );
    }, 50);

    return () => clearInterval(bulletMoveInterval);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
    setPlayerPosition({
      x: (GAME_SIZE - PLAYER_SIZE) / 2,
      y: (GAME_SIZE - PLAYER_SIZE) / 2,
    });
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
    <div className={styles.gameWithRankingContainer}>
      <div className={styles.gameContainer}>
        {!isGameStarted ? (
          <div className={styles.startScreen}>
            <div className={styles.startBox}>
              <div className={styles.gameTitleBox}>
                <div className={styles.gameTitle}>탄막 피하기</div>
                <h5>
                  <div className={styles.gameSubTitle}>
                    최대한 오래 살아남으세요!
                  </div>
                </h5>
              </div>
              <div className={styles.startButton}>
                <button
                  onClick={() => {
                    setIsGameStarted(true);
                    setIsGameOver(false); // 게임 오버 상태를 초기화합니다.
                    setGameTime(0); // 게임 시간 초기화
                    setPlayerPosition({
                      x: (GAME_SIZE - PLAYER_SIZE) / 2,
                      y: (GAME_SIZE - PLAYER_SIZE) / 2,
                    }); // 플레이어 위치 초기화
                    setBullets([]); // 탄막들 초기화
                  }}
                >
                  <div className={styles.startGame}>시작하기</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.timer}>{formatTime(gameTime)}</div>
            {!isGameOver &&
              bullets.map(bullet => (
                <div
                  key={bullet.id}
                  className={styles.bullet}
                  style={{
                    left: bullet.x,
                    top: bullet.y,
                    backgroundColor: bullet.color,
                  }}
                ></div>
              ))}
            {!isGameOver && (
              <div
                className={styles.player}
                style={{
                  left: playerPosition.x,
                  top: playerPosition.y,
                  backgroundImage: `url(${playerImage})`,
                  backgroundSize: "cover",
                }}
              ></div>
            )}
            {isGameOver && (
              <div className={styles.gameOver}>
                <div className={styles.centerTimer}>
                  <div>Record</div>
                  <div className={styles.gameSeconds}>
                    {formatTime(gameTime)} 초
                  </div>
                </div>

                <button
                  className={styles.reButton}
                  onClick={restartGame}
                  style={{ marginRight: "10px" }}
                >
                  다시하기
                </button>
                <button className={styles.ranking} onClick={updateRanking}>
                  랭킹 등록
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* 랭킹 표시 */}
      <div className={styles.rankingContainer}>
        <h2 className={styles.titelTitle}>Top Player</h2>
        {/* <ul> */}
        {ranking.map((user, index) => (
          <li
            key={user.index}
            className={styles.songRow}
            style={{
              backgroundColor:
                index === 0
                  ? "rgba(255, 215, 0, 0.5)"
                  : index === 1
                  ? "rgba(192, 192, 192, 0.5)"
                  : index === 2
                  ? "rgba(160, 88, 34, 0.5)"
                  : "defaultColor",
              color:
                index === 0
                  ? "white" // #FFD700 with 50% opacity
                  : index === 1
                  ? "white" // #C0C0C0 with 50% opacity
                  : index === 2
                  ? "white" // #a05822 with 50% opacity
                  : "rgba(98, 98, 98, 1)", // #626262 with 100% opacity
            }}
          >
            <div className={styles.rankContainer}>
              {/* <div> */}
              <span className={styles.rank}>{`${index + 1}등`}</span>
              {/* {index === 0 && <img src={goldMedal} alt="Gold Medal" />} */}
              {/* {index === 1 && <img src={silverMedal} alt="Silver Medal" />} */}
              {/* {index === 2 && <img src={bronzeMedal} alt="Bronze Medal" />} */}
              {/* </div> */}
            </div>
            <div className={styles.profileImageWrapper}>
              <img src={user.profileImage} alt={`${user.nickname}'s profile`} />
            </div>
            <span className={styles.nickname}>{user.nickname}</span>
            <div className={styles.recordDiv}>
              <span>{formatTime(user.record)}</span>
            </div>
          </li>
        ))}
        {/* </ul> */}
      </div>
    </div>
  );
};

export default Game;
