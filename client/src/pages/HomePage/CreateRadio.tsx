import React, { useState, useRef } from "react";
import NavBar from "../../component/Common/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetIndices, setMusicInfo, setRadioDummyData } from "../../store";
import DJSelector from "../../component/Radio/DJSelector";

const CreateRadio = () => {
  /** state,ref */
  const titleRef = useRef<HTMLInputElement>(null); //제목 REF
  const [selectedTheme, setSelectedTheme] = useState(""); // 선택된 테마 상태
  const contentRef = useRef<HTMLTextAreaElement>(null); //내용 REF
  const [contentLength, setContentLength] = useState(0); //내용 count
  const [selectedDJ, setSelectedDJ] = useState(""); // 선택한 DJ 이름

  /** dummyData */
  const dispatch = useDispatch();
  dispatch(
    setRadioDummyData({
      tts_one: "dummyRadio/radio1.mp3",
      tts_two: "dummyRadio/radio2.mp3",
      tts_three: "dummyRadio/radio3.mp3",
      tts_four: "dummyRadio/radio4.mp3",
      script_one: "첫번째 라디오 스크립트입니다",
      script_two: "두번째 라디오 스크립트입니다",
      script_three: "세번째 라디오 스크립트입니다",
      script_four: "네번째 라디오 스크립트입니다",
      oncast_music_one: "dummyMusic/1.mp3",
      oncast_music_two: "dummyMusic/2.mp3",
      oncast_music_three: "dummyMusic/3.mp3",
    })
  );

  // 음악 정보 더미 데이터를 디스패치합니다.
  dispatch(
    setMusicInfo({
      musicTitle: ["결을(Feat. Ash ISLAND)", "작별인사", "혜화"],
      musicArtist: ["Cloudybay", "Ash ISLAND", "유토"],
      musicLength: [162000, 167000, 243000],
      musicCover: [
        "https://cdnimg.melon.co.kr/cm2/album/images/113/13/701/11313701_20230824151914_500.jpg?028e06e5f0ce0b0760e290fa61831224/melon/optimize/90",
        "https://image.bugsm.co.kr/album/images/500/205636/20563609.jpg",
      ],
    })
  );

  dispatch(resetIndices());

  /** action */
  const navigate = useNavigate(); //페이지 이동 함수

  const handleCreate = () => {
    const inputTitle = titleRef.current ? titleRef.current.value : "";
    const inputContent = contentRef.current ? contentRef.current.value : "";
    const inputTheme = selectedTheme;
    const inputDJ = selectedDJ;
    console.log("Title:", inputTitle);
    console.log("Content:", inputContent);
    console.log("inputTheme", inputTheme);
    console.log("inputDJ", inputDJ);

    if (!inputTitle.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }
    if (!inputContent.trim()) {
      alert("내용을 입력해주세요");
      return;
    }
    if (!inputTheme.trim()) {
      alert("테마를 선택해주세요");
      return;
    }
    if (!inputDJ.trim()) {
      alert("DJ를 선택해주세요");
      return;
    }
    navigate("/Loading");
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handlDJSelect = (DJ: string) => {
    setSelectedDJ(DJ);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentLength(e.target.value.length);
  };

  /**AXIOS */
  //여기서 POST매핑하면 끝.

  return (
    <div style={{ backgroundColor: "#000104", color: "white" }}>
      <NavBar />
      <div
        style={{
          maxWidth: "1000px",
          margin: "3rem auto",
          border: "1px solid #626262",
          borderRadius: "20px",
          backgroundColor: "rgba(34, 34, 34, 0.7)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div></div>
          <div style={{ textAlign: "center" }}>
            <h2>TITLE</h2>
          </div>
          <input type="text" ref={titleRef} style={{ width: "80%" }} />
          <div></div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2>THEME</h2>
          </div>
          <div>
            <button onClick={() => handleThemeSelect("JOYFUL")}>JOYFUL</button>
            <button onClick={() => handleThemeSelect("SENSITIVE")}>
              SENSITIVE
            </button>
            <button onClick={() => handleThemeSelect("HOPEFUL")}>
              HOPEFUL
            </button>
            <button onClick={() => handleThemeSelect("CHILL")}>CHILL</button>
            <button onClick={() => handleThemeSelect("AGGRESSIVE")}>
              AGGRESSIVE
            </button>
            <button onClick={() => handleThemeSelect("ROMANTIC")}>
              ROMANTIC
            </button>
            <button onClick={() => handleThemeSelect("RETRO")}>RETRO</button>
            <button onClick={() => handleThemeSelect("DRAMATIC")}>
              DRAMATIC
            </button>
            <button onClick={() => handleThemeSelect("FUNKY")}>FUNKY</button>
            {/* <button onClick={() => handleThemeSelect("EXOTIC")}>EXOTIC</button>
            <button onClick={() => handleThemeSelect("ELECTRIC")}>
              ELECTRIC
            </button>
            <button onClick={() => handleThemeSelect("ACOUSTIC")}>
              ACOUSTIC
            </button>
            <button onClick={() => handleThemeSelect("NOSTALGIC")}>
              NOSTALGIC
            </button>
            <button onClick={() => handleThemeSelect("DREAMY")}>DREAMY</button> */}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2>STORY</h2>
            {`${contentLength}/1000`}
          </div>
          <textarea
            ref={contentRef}
            onChange={handleContentChange}
            maxLength={1000}
            style={{ width: "80%", height: "100px" }}
          ></textarea>
        </div>

        <DJSelector onSelect={handlDJSelect}></DJSelector>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button onClick={handleCreate} style={{ marginRight: "10px" }}>
            생성
          </button>
          <Link to="/">
            <button>취소</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateRadio;
