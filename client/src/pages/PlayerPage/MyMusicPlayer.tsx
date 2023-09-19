import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../component/Common/Navbar";
import { musicDummyData } from "./MusicDummy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

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
        {/* 음악 컨테이너 상단 헤더 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>현재 재생 목록</div>
          <AddCircleOutline />
        </div>
        {/* 이미지와 노래 리스트를 감싸는 컨테이너 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5%",
            marginRight: "5%",
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
              flex: 0.5,
              overflowY: "auto",
              paddingRight: "20px",
              maxHeight: "80vh",
              marginLeft: "20%",
            }}
          >
            {musicDummyData.map((song, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
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
                {/* 앨범 이미지 추가 */}
                <img
                  src={song.cover}
                  alt={song.title}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{song.title}</strong>
                  <br />
                  {song.artist}
                </div>
                {/* 노래 길이 오른쪽 배치 */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <DeleteOutlineIcon style={{ marginRight: "10px" }} />{" "}
                  {/* 쓰레기통 아이콘 추가 */}
                  {Math.floor(song.length / 60000)}:
                  {String((song.length % 60000) / 1000).padStart(2, "0")}{" "}
                  {/* 음악 길이 형식 수정 */}
                </div>
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
