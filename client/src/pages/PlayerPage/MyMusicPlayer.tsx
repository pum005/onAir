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
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <img
          src={musicDummyData[currentTrackIndex].cover}
          alt={musicDummyData[currentTrackIndex].title}
          style={{ width: "250px", height: "250px" }}
        />
        <div>
          <strong>Title:</strong> {musicDummyData[currentTrackIndex].title}
        </div>
        <div>
          <strong>Artist:</strong> {musicDummyData[currentTrackIndex].artist}
        </div>
        <audio ref={audioRef} onEnded={handleSongEnd} controls>
          <source type="audio/mp3" />
        </audio>
      </div>
    </div>
  );
};
