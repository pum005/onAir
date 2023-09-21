import React, { useState, useRef, useEffect } from "react";
import NavBar from "../../component/Common/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetIndices, setMusicInfo, setRadioDummyData } from "../../store";
import DJSelector from "../../component/Radio/DJSelector";
import styles from "./CreateRadio.module.css";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";

const CreateRadio = () => {
  /** state,ref */
  const titleRef = useRef<HTMLInputElement>(null); //제목 REF
  const [selectedTheme, setSelectedTheme] = useState(""); // 선택된 테마 상태
  const contentRef = useRef<HTMLTextAreaElement>(null); //내용 REF
  const [contentLength, setContentLength] = useState(0); //내용 count
  const [selectedDJ, setSelectedDJ] = useState(""); // 선택한 DJ 이름

  /** action */
  const navigate = useNavigate(); //페이지 이동 함수

  //임시 온캐스트 생성 후 온캐스트 페이지로 넘어가게 하는 버튼
  const [showButton, setShowButton] = useState(false);

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
      navigate;
    }
    if (!inputTheme.trim()) {
      alert("테마를 선택해주세요");
      return;
    }
    if (!inputDJ.trim()) {
      alert("DJ를 선택해주세요");
      return;
    }
    // navigate("/Loading");
    setShowButton(true);
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

  const [fetchOncast, setFetchOncast] = useState(false);

  const handleOncastButtonClick = () => {
    setFetchOncast(true);
  };

  const dispatch = useDispatch();

  type MusicItem = {
    title: string;
    artist: string;
    duration: number;
    albumCoverUrl: string;
    youtubeId: string;
  };

  useEffect(() => {
    if (fetchOncast) {
      requestWithTokenRefresh(() => {
        return axios.get("http://localhost:8080/api/oncast/play/7", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      }).then(response => {
        console.log("Response Data:", response.data);
        console.log("Music Data:", response.data.oncast.music);

        const data: {
          djName: string;
          ttsOne: string;
          ttsTwo: string;
          ttsThree: string;
          ttsFour: string;
          scriptOne: string;
          scriptTwo: string;
          scriptThree: string;
          scriptFour: string;
          music: {
            title: string;
            artist: string;
            duration: number;
            albumCoverUrl: string;
            youtubeId: string;
          }[];
        } = response.data.oncast; // 여기서 .oncast를 추가했습니다.

        const music: MusicItem[] = response.data.oncast.music; // 여기서도 .oncast를 추가했습니다.

        // Redux 액션 디스패치: 데이터를 Redux 스토어에 저장합니다.

        // oncast 데이터 액션 디스패치
        dispatch(
          setRadioDummyData({
            djName: data.djName,
            tts_one: data.ttsOne,
            tts_two: data.ttsTwo,
            tts_three: data.ttsThree,
            tts_four: data.ttsFour,
            script_one: data.scriptOne,
            script_two: data.scriptTwo,
            script_three: data.scriptThree,
            script_four: data.scriptFour,
            oncast_music_one: data.music[0].youtubeId,
            oncast_music_two: data.music[1].youtubeId,
            oncast_music_three: data.music[2].youtubeId,
          })
        );

        // 음악 데이터 액션 디스패치
        dispatch(
          setMusicInfo({
            musicTitle: music.map(m => m.title),
            musicArtist: music.map(m => m.artist),
            musicLength: music.map(m => m.duration),
            musicCover: music.map(m => m.albumCoverUrl),
          })
        );
        setFetchOncast(false); // 통신 후 상태 값을 초기화합니다.
        navigate("/RadioPlayer");
      });
    }
  }, [fetchOncast, dispatch]);

  /**AXIOS */
  //여기서 POST매핑하면 끝.

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.radioWrapper}>
        <div className={styles.flexContainer}>
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
          </div>
        </div>
        <div className={styles.flexContainer}>
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
      {showButton && (
        <button onClick={handleOncastButtonClick}>
          redux 온캐스트 들으러 가기
        </button>
      )}
      {showButton && (
        <Link to="/Player">
          <button>한 페이지에서 온캐스트 들으러 가기</button>
        </Link>
      )}
    </div>
  );
};

export default CreateRadio;
