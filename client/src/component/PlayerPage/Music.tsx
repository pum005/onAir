import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export const Music = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();

  // const handleAudioEnd = () => {

  //   navigate("/RadioPlayer");
  // };

  const currentMusicKey = [
    `oncast_music_one`,
    `oncast_music_two`,
    `oncast_music_three`,
  ][radioDummyData.currentMusicIndex];

  // 현재 선택된 음악의 youtubeId 가져오기
  const currentYoutubeId = String(radioDummyData[currentMusicKey]);

  // 현재 노래의 제목, 아티스트, 앨범 표지 가져오기
  const currentMusicTitle =
    radioDummyData.musicTitle[radioDummyData.currentMusicIndex];
  const currentMusicArtist =
    radioDummyData.musicArtist[radioDummyData.currentMusicIndex];
  const currentMusicCover =
    radioDummyData.musicCover[radioDummyData.currentMusicIndex];

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {};

  const handleVideoEnd = () => {
    dispatch({ type: "INCREMENT_MUSIC_INDEX" }); // 인덱스 증가
    navigate("/RadioPlayer"); // Radio.tsx로의 경로를 설정합니다
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    console.log("Current Music Index:", radioDummyData.currentMusicIndex);
  }, [radioDummyData.currentMusicIndex]);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${currentMusicCover})`, // 수정된 부분
        // backgroundImage: `url(${currentMusicCover})`, // 배경 이미지 설정
        backgroundSize: "cover", // 배경 이미지를 컨테이너 크기에 맞게 조절
        backgroundPosition: "center", // 배경 이미지의 위치를 중앙으로 설정
        backgroundColor: "rgba(0, 1, 4, 0.9)", // 투명도를 조절하는 배경색
        height: "100%",
        color: "white",
      }}
    >
      <div>
        <h2>{currentMusicTitle}</h2> {/* 현재 노래 제목 렌더링 */}
        <p>{currentMusicArtist}</p> {/* 현재 아티스트 렌더링 */}
      </div>

      {/* <audio controls autoPlay onEnded={handleAudioEnd}>
        <source src={radioDummyData[currentMusic] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio> */}

      {/* 오디오 플레이어 아래에 앨범 커버 이미지 렌더링 */}
      <div style={{ marginTop: "20px" }}>
        <img
          src={currentMusicCover}
          alt="앨범 표지"
          style={{ width: "400px", height: "400px" }}
        />
      </div>
      <YouTube
        videoId={currentYoutubeId}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={handleVideoEnd} // 여기에 onEnd 이벤트 핸들러를 추가합니다.
      />
    </div>
  );
};
