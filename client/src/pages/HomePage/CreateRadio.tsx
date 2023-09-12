import NavBar from "../../component/Common/Navbar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRadioDummyData } from "../../store";

type CreateRadioProps = {};

export const CreateRadio = () => {
  const dispatch = useDispatch();

  const handleCreate = () => {
    // 더미 데이터를 디스패치합니다.
    dispatch(
      setRadioDummyData({
        tts_one: "dummyRadio/radio1.mp3",
        tts_two: "dummyRadio/radio2.mp3",
        tts_three: "dummyRadio/radio3.mp3",
        tts_four: "dummyRadio/radio4.mp3",
        script_one: "This is dummy script 1",
        script_two: "This is dummy script 2",
        script_three: "This is dummy script 3",
        script_four: "This is dummy script 4",
        oncast_music_one: "dummyMusic/1.mp3",
        oncast_music_two: "dummyMusic/2.mp3",
        oncast_music_three: "dummyMusic/3.mp3",
      })
    );
  };

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>라디오 만드는 페이지</h2>
      <Link to="/Loading">
        <button onClick={handleCreate}>생성</button>
      </Link>
    </div>
  );
};
