import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import dj1 from "../../resources/ncs1.gif";
import dj2 from "../../resources/ncs2.gif";
import dj3 from "../../resources/ncs3.gif";
import dj4 from "../../resources/ncs4.gif";
import dj5 from "../../resources/ncs5.gif";
import { Grid, IconButton } from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

type DJSelectorProps = {
  onSelect: (DJ: string) => void;
};

function DJSelector({ onSelect }: DJSelectorProps) {
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const preview1 = "/preview/아라.mp3";
  const preview2 = "/preview/이안.mp3";
  const preview3 = "/preview/고은.mp3";
  const preview4 = "/preview/규원.mp3";
  const preview5 = "/preview/기효.mp3";
  const preview6 = "/preview/나오미.mp3";
  const preview7 = "/preview/정영화.mp3";
  const preview8 = "/preview/상도.mp3";
  const preview9 = "/preview/안나.mp3";
  const preview10 = "/preview/원탁.mp3";

  const handleSelect = (DJName: string, soundSrc: string) => {
    onSelect(DJName);
    setSelectedDJ(DJName);
    playSound(soundSrc);
  };
  const playSound = (soundSrc: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(soundSrc);
    audio.play();

    setCurrentAudio(audio);
  };

  const DJData = [
    {
      name: "아라",
      imgSrc: dj1,
      sound: preview1,
      description: "#활기찬 #차분한",
    },
    {
      name: "이안",
      imgSrc: dj2,
      sound: preview2,
      description: "#활기찬 #싹싹한",
    },
    {
      name: "고은",
      imgSrc: dj3,
      sound: preview3,
      description: " #차분한 #친절한",
    },
    {
      name: "규원",
      imgSrc: dj2,
      sound: preview4,
      description: "#차분한 #친절한",
    },
    {
      name: "기효",
      imgSrc: dj5,
      sound: preview5,
      description: "#활기찬 #열정적인",
    },
    {
      name: "나오미",
      imgSrc: dj3,
      sound: preview6,
      description: "#차분한 #싹싹한 #일본어",
    },
    {
      name: "정영화",
      imgSrc: dj4,
      sound: preview7,
      description: "#신뢰가는 #차분한",
    },
    {
      name: "상도",
      imgSrc: dj1,
      sound: preview8,
      description: "#구수한 #친근한",
    },
    {
      name: "안나",
      imgSrc: dj4,
      sound: preview9,
      description: "#활기찬 #싹싹한 #영어",
    },
    {
      name: "원탁",
      imgSrc: dj5,
      sound: preview10,
      description: "#신뢰가는 #쓸쓸한",
    },
  ];
  const [centerIndex, setCenterIndex] = useState(3);

  const handleNext = () => {
    setCenterIndex((prev) => Math.min(prev + 1, DJData.length - 4));
  };

  const handlePrev = () => {
    setCenterIndex((prev) => Math.max(prev - 1, 3));
  };

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  return (
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      <Grid item>
        <IconButton
          onClick={handlePrev}
          size="large"
          style={{ color: "white" }}
        >
          <ArrowBackIos />
        </IconButton>
      </Grid>

      {DJData.slice(centerIndex - 3, centerIndex + 4).map((DJ, index) => (
        <Grid item key={index} style={{ textAlign: "center", color: "white" }}>
          <Tooltip title={DJ.description}>
            <button
              onClick={() => handleSelect(DJ.name, DJ.sound)}
              style={{
                height: "52px", // 보더의 두께만큼 증가시킵니다 (2px x 2)
                width: "52px", // 보더의 두께만큼 증가시킵니다 (2px x 2)
                margin: 0,
                padding: 0,
                border:
                  selectedDJ === DJ.name ? "2px solid red" : "2px solid black",
                borderRadius: "5px", // 버튼을 둥글게 만듭니다
                overflow: "hidden", // 이 부분은 이미지가 둥근 부분 밖으로 나가지 않도록 합니다
              }}
            >
              <img
                src={DJ.imgSrc}
                alt={`${DJ.name}`}
                style={{
                  height: "50px",
                  width: "50px",
                }}
              />
            </button>
          </Tooltip>
          <div style={{ color: selectedDJ === DJ.name ? "red" : "white" }}>
            {`${DJ.name}`}
          </div>
        </Grid>
      ))}

      <Grid item>
        <IconButton
          onClick={handleNext}
          size="large"
          style={{ color: "white" }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Grid>
    </Grid>
  );
}
export default DJSelector;
