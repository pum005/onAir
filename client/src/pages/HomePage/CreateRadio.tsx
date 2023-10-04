import React, { useState, useRef, useEffect } from "react";
// import NavBar from "../../component/Common/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./CreateRadio.module.css";
import DJSelector from "../../component/Radio/DJSelector";
import ThemeSelector from "../../component/Radio/ThemeSelector";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Game from "../../pages/PlayerPage/Game";

import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Grid, Button, Typography, styled } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import Swal from "sweetalert2";

const CreateRadio = () => {
  const DJNameMapping = {
    아라: "vara",
    이안: "nian",
    고은: "ngoeun",
    규원: "nkyuwon",
    기효: "nes_c_kihyo",
    나오미: "nnaomi",
    정영화: "nyounghwa",
    상도: "nsangdo",
    안나: "danna",
    원탁: "nwontak",
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedTheme, setSelectedTheme] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [selectedDJ, setSelectedDJ] = useState("");
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [contentMaxLengthReached, setContentMaxLengthReached] = useState(false);
  const [isGame, setIsGame] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= 1000) {
      setContent(newContent);
      setContentLength(newContent.length);
      setContentMaxLengthReached(false); // 내용 길이가 1000자 이하일 경우 상태를 false로 설정
    } else {
      setContentMaxLengthReached(true);
    }
  };

  const handleCreate = () => {
    const inputTitle = title;
    const inputContent = content;
    const inputTheme = selectedTheme;
    const inputDJ = selectedDJ;

    if (!inputTitle.trim()) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: "swal2-popup",
        },
      });
      Toast.fire({
        icon: "warning",
        title: "제목을 입력해주세요!",
      });
      return;
    }
    if (!inputTheme.trim()) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: "swal2-popup",
        },
      });
      Toast.fire({
        icon: "warning",
        title: "테마를 입력해 주세요!",
      });
      return;
    }
    if (!inputContent.trim()) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: "swal2-popup",
        },
      });
      Toast.fire({
        icon: "warning",
        title: "내용을 입력해 주세요!",
      });
      return;
    }

    if (!inputDJ.trim()) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: "swal2-popup",
        },
      });
      Toast.fire({
        icon: "warning",
        title: "DJ를 선택해 주세요!",
      });
      return;
    }

    CreateOncast();
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handlDJSelect = (DJ: string) => {
    setSelectedDJ(DJ);
  };

  const comeBackHome = () => {
    navigate("/");
  };

  const CreateButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: "black",
    backgroundColor: "#EDEDED",
    "&:hover": {
      backgroundColor: "#444444",
    },
  }));

  const CancleButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: "white",
    backgroundColor: "#DA0037",
    "&:hover": {
      backgroundColor: "#444444",
    },
  }));

  const CreateOncast = () => {
    setIsGame(true);
    const djEnglishName =
      DJNameMapping[selectedDJ as keyof typeof DJNameMapping];
    requestWithTokenRefresh(() => {
      return axios.post(
        "http://localhost:8080/api/oncast/create",
        // dd
        {
          title: title,
          theme: selectedTheme,
          story: content,
          djName: djEnglishName,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          setIsGame(false);
          navigate("/OncastCreateComplete");
        } else {
          alert("온캐스트 생성에 실패했습니다.");
        }
      })
      .catch(error => {
        setIsGame(false);

        console.log("통신에러 발생", error);
      });
  };
  return (
    <div>
      {/* <NavBar /> */}
      {isGame ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          marginTop: "50px"
      }}>
          <Game />
      </div>
      ) : (
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
                  <textarea
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={styles.titleInput}
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
                  <ThemeSelector
                    selectedTheme={selectedTheme}
                    onThemeSelect={handleThemeSelect}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} alignItems="flex-start" spacing={2}>
                <Grid item xs={2}>
                  <Typography className={styles.itemTitle} variant="h5">
                    STORY
                  </Typography>
                </Grid>

                <Grid
                  className={styles.textfield}
                  item
                  xs={9.5}
                  style={{ textAlign: "right" }}
                >
                  <textarea
                    value={content}
                    onChange={handleContentChange} // 함수 변경
                    className={styles.storyInput}
                  />
                  <div
                    className={styles.typingLimit}
                    style={{ color: contentMaxLengthReached ? "red" : "white" }}
                  >
                    {`${contentLength}/1000`}
                  </div>
                </Grid>
              </Grid>

              <Grid item container xs={12} alignItems="center" spacing={2}>
                <Grid item xs={2}>
                  <Typography variant="h5" className={styles.itemTitle}>
                    DJ
                  </Typography>
                </Grid>
                <Grid item xs={10} style={{ userSelect: "none" }}>
                  <DJSelector onSelect={handlDJSelect} />
                </Grid>
              </Grid>

              <Grid item container xs={12} justifyContent="flex-end">
                <CreateButton
                  variant="contained"
                  onClick={handleCreate}
                  style={{ marginRight: "10px" }}
                  className={styles.createButton}
                >
                  생성
                </CreateButton>
                <Link to="/">
                  <CancleButton
                    variant="contained"
                    className={styles.cancleButton}
                  >
                    취소
                  </CancleButton>
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRadio;
