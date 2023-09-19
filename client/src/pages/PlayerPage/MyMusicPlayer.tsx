import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../component/Common/Navbar";
import { musicDummyData } from "./MusicDummy";

type MyMusicPlayerProps = {};

export const MyMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicDummyData[currentTrackIndex].musicSrc; // 노래 소스 업데이트
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  const handleSongEnd = () => {
    if (currentTrackIndex < musicDummyData.length - 1) {
      setCurrentTrackIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  return (
    <div
      style={{ backgroundColor: "#000104", minHeight: "100vh", color: "white" }}
    >
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 60px)",
        }}
      >
        {/* 이미지와 노래 리스트를 감싸는 컨테이너 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 이미지를 담는 컨테이너 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={musicDummyData[currentTrackIndex].cover}
              alt={musicDummyData[currentTrackIndex].title}
              style={{ width: "500px", height: "500px" }}
            />
          </div>
          {/* 노래 리스트를 담는 컨테이너 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "20px",
              maxHeight: "80vh",
            }}
          >
            {musicDummyData.map((song, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  width: "60%",
                  backgroundColor:
                    currentTrackIndex === index
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                  marginBottom: "10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
                onClick={() => setCurrentTrackIndex(index)}
              >
                <strong>{song.title}</strong>
                <br />
                {song.artist}
                <br />
                {Math.floor(song.length / 60000)}:
                {((song.length % 60000) / 1000).toFixed(0)}
              </div>
            ))}
          </div>
        </div>
        {/* 오디오 플레이어를 담는 컨테이너 */}
        <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
          <audio ref={audioRef} onEnded={handleSongEnd} controls>
            <source type="audio/mp3" />
          </audio>
        </div>
      </div>
    </div>
  );
};
