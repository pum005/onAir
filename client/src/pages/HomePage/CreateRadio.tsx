import React, { useState, useRef, useEffect } from "react";
import NavBar from "../../component/Common/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./CreateRadio.module.css";
import { resetIndices, setMusicInfo, setRadioDummyData } from "../../store";
import DJSelector from "../../component/Radio/DJSelector";
import axios from "axios";
import { Navigate } from "react-router-dom";

import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Grid, TextField, Button, Typography } from "@mui/material";

const CreateRadio = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [selectedTheme, setSelectedTheme] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [contentLength, setContentLength] = useState(0);
  const [selectedDJ, setSelectedDJ] = useState("");
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  const handleCreate = () => {
    const inputTitle = titleRef.current ? titleRef.current.value : "";
    const inputContent = contentRef.current ? contentRef.current.value : "";
    const inputTheme = selectedTheme;
    const inputDJ = selectedDJ;

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

  // const [fetchOncast, setFetchOncast] = useState(false);

  // const handleOncastButtonClick = () => {
  //   setFetchOncast(true);
  // };

  const handleOncastButtonClick = () => {
    navigate("/Player");
  };

  // const dispatch = useDispatch();

  // type MusicItem = {
  //   title: string;
  //   artist: string;
  //   duration: number;
  //   albumCoverUrl: string;
  //   youtubeId: string;
  // };

  // useEffect(() => {
  //   if (fetchOncast) {
  //     requestWithTokenRefresh(() => {
  //       return axios.get("http://localhost:8080/api/oncast/play/7", {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("accessToken"),
  //         },
  //         withCredentials: true,
  //       });
  //     }).then((response) => {
  //       console.log("Response Data:", response.data);
  //       console.log("Music Data:", response.data.oncast.music);

  //       const data: {
  //         djName: string;
  //         ttsOne: string;
  //         ttsTwo: string;
  //         ttsThree: string;
  //         ttsFour: string;
  //         scriptOne: string;
  //         scriptTwo: string;
  //         scriptThree: string;
  //         scriptFour: string;
  //         music: {
  //           title: string;
  //           artist: string;
  //           duration: number;
  //           albumCoverUrl: string;
  //           youtubeId: string;
  //         }[];
  //       } = response.data.oncast; // 여기서 .oncast를 추가했습니다.

  //       const music: MusicItem[] = response.data.oncast.music; // 여기서도 .oncast를 추가했습니다.

  //       // Redux 액션 디스패치: 데이터를 Redux 스토어에 저장합니다.

  //       // oncast 데이터 액션 디스패치
  //       dispatch(
  //         setRadioDummyData({
  //           djName: data.djName,
  //           tts_one: data.ttsOne,
  //           tts_two: data.ttsTwo,
  //           tts_three: data.ttsThree,
  //           tts_four: data.ttsFour,
  //           script_one: data.scriptOne,
  //           script_two: data.scriptTwo,
  //           script_three: data.scriptThree,
  //           script_four: data.scriptFour,
  //           oncast_music_one: data.music[0].youtubeId,
  //           oncast_music_two: data.music[1].youtubeId,
  //           oncast_music_three: data.music[2].youtubeId,
  //         })
  //       );

  //       // 음악 데이터 액션 디스패치
  //       dispatch(
  //         setMusicInfo({
  //           musicTitle: music.map((m) => m.title),
  //           musicArtist: music.map((m) => m.artist),
  //           musicLength: music.map((m) => m.duration),
  //           musicCover: music.map((m) => m.albumCoverUrl),
  //         })
  //       );
  //       setFetchOncast(false); // 통신 후 상태 값을 초기화합니다.
  //       navigate("/RadioPlayer");
  //     });
  //   }
  // }, [fetchOncast, dispatch]);

  /**AXIOS */
  //여기서 POST매핑하면 끝.

  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <div>
          <Grid container spacing={3} className={styles.oncastCreate}>
            <Grid item container xs={12} alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <Typography variant="h5" className={styles.itemTitle}>
                  TITLE
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <TextField
                  style={{ color: "red" }}
                  className={styles.titleInput}
                  fullWidth
                  inputRef={titleRef}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <Typography variant="h5" className={styles.itemTitle}>
                  THEME
                </Typography>
              </Grid>
              <Grid item xs={10} className={styles.themeSelect}>
                {[
                  "JOYFUL",
                  "SENSITIVE",
                  "HOPEFUL",
                  "CHILL",
                  "AGGRESSIVE",
                  "ROMANTIC",
                  "RETRO",
                  "DRAMATIC",
                  "FUNKY",
                  "EXOTIC",
                  "ACOUSTIC",
                  "NOSTALGIC",
                  "DREAMY",
                  "UPBEAT",
                  "ENERGETIC",
                  "MELANCHOLY",
                  "SAD",
                ].map((theme) => (
                  <Button
                    key={theme}
                    onClick={() => handleThemeSelect(theme)}
                    className={
                      theme === selectedTheme ? styles.selectedTheme : ""
                    }
                  >
                    {theme}
                  </Button>
                ))}
              </Grid>
            </Grid>

            <Grid item container xs={12} alignItems="flex-start" spacing={2}>
              <Grid item xs={2}>
                <Typography className={styles.itemTitle} variant="h5">
                  STORY
                </Typography>
              </Grid>
              <Grid item xs={9.5} style={{ textAlign: "right" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  inputRef={contentRef}
                  onChange={handleContentChange}
                  variant="outlined"
                  className={styles.storyInput}
                />
                <div
                  className={styles.typingLimit}
                >{`${contentLength}/1000`}</div>
              </Grid>
            </Grid>

            <Grid item container xs={12} alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <Typography variant="h5" className={styles.itemTitle}>
                  DJ
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <DJSelector onSelect={handlDJSelect} />
              </Grid>
            </Grid>

            <Grid item container xs={12} justifyContent="flex-end">
              <Button
                className={styles.createButton}
                onClick={handleCreate}
                style={{ marginRight: "10px" }}
              >
                생성
              </Button>
              <Link to="/">
                <Button className={styles.cancleButton}>취소</Button>
              </Link>
            </Grid>
          </Grid>
        </div>
        {showButton && (
          <Button
            onClick={handleOncastButtonClick}
            variant="contained"
            color="primary"
          >
            온캐스트 들으러 가기
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateRadio;
