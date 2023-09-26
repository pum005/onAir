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
import {
  Grid,
  TextField,
  Button,
  Typography,
  styled,
  makeStyles,
} from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
const CreateRadio = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedTheme, setSelectedTheme] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [selectedDJ, setSelectedDJ] = useState("");
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  const handleCreate = () => {
    const inputTitle = title;
    const inputContent = content;
    const inputTheme = selectedTheme;
    const inputDJ = selectedDJ;

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
    setShowButton(true);
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handlDJSelect = (DJ: string) => {
    setSelectedDJ(DJ);
  };

  const handleOncastButtonClick = () => {
    navigate("/Player");
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
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    className={`${styles.theme} ${
                      theme === selectedTheme ? styles.selectedTheme : ""
                    }`}
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
              <Grid
                className={styles.textfield}
                item
                xs={9.5}
                style={{ textAlign: "right" }}
              >
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setContentLength(e.target.value.length);
                  }}
                  className={styles.titleInput}
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
