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
import { Grid, TextField, Button, Typography, styled, makeStyles } from "@mui/material";
import { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';

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

  const handleOncastButtonClick = () => {
    navigate("/Player");
  };

  /**AXIOS */
  //여기서 POST매핑하면 끝.
  const CssTextField = styled(TextField)({
    '& .MuiInputBase-input': {
      color: "white",
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: "1px solid white"
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        border: "1px solid white"
      },
    },
  });

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#6966FF",
    '&:hover': {
      backgroundColor: "#6966FF",
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
                <CssTextField
                  fullWidth
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
              <Grid className={styles.textfield} item xs={9.5} style={{ textAlign: "right" }}>
                <CssTextField
                  fullWidth
                  multiline
                  rows={4}
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
              <ColorButton 
                variant="contained"
                onClick={handleCreate}
                style={{ marginRight: "10px" }}
              >
                생성</ColorButton>
              <Link to="/">
                <ColorButton className={styles.cancleButton}>취소</ColorButton>
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
