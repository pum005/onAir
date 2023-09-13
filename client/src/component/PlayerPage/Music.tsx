import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

export const Music = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();

  const handleAudioEnd = () => {
    dispatch({ type: "INCREMENT_MUSIC_INDEX" }); // 인덱스 증가
    navigate("/RadioPlayer");
  };

  // 현재 인덱스에 맞게 음악 선택
  const currentMusic = [
    `oncast_music_one`,
    `oncast_music_two`,
    `oncast_music_three`,
  ][radioDummyData.currentMusicIndex];

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <div>
        <h2>노래 제목</h2>
        <p>아티스트 이름</p>
      </div>
      <audio controls autoPlay onEnded={handleAudioEnd}>
        <source src={radioDummyData[currentMusic] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <h2>여기 앨범 표지 들어올거임</h2>
    </div>
  );
};
