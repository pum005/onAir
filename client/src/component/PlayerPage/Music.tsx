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
      <audio controls autoPlay onEnded={handleAudioEnd}>
        <source src={radioDummyData[currentMusic] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
