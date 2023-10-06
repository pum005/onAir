import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
// import NavBar from "../../component/Common/Navbar";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Radio } from "../../component/PlayerPage/Radio";
import { Music } from "../../component/PlayerPage/Music";
import { FinishModal } from "../../component/PlayerPage/FinishModal";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import Modal from "../../component/PlayerPage/PlayListModal";
import { useLocation } from "react-router-dom";

type OncastDataType = {
  ttsOne: string;
  ttsTwo: string;
  ttsThree: string;
  ttsFour: string;
  scriptOne: string;
  scriptTwo: string;
  scriptThree: string;
  scriptFour: string;
  music: any[];
  djName: string;
};

export const Player = (): ReactElement => {
  // 반환 타입을 ReactElement로 설정
  const [oncasts, setOncasts] = useState<OncastDataType | null>(null); // 타입을 명시
  const [playState, setPlayState] = useState<"TTS" | "MUSIC">("TTS");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false); //
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DJNameMappingReverse = {
    vara: "아라",
    nara: "아라",
    nian: "이안",
    ngoeun: "고은",
    nkyuwon: "규원",
    nes_c_kihyo: "기효",
    nnaomi: "나오미",
    nyounghwa: "정영화",
    nsangdo: "상도",
    danna: "안나",
    nwontak: "원탁",
  };

  type DJNameEnglish = keyof typeof DJNameMappingReverse;

  //이부분이 이제 재생했을때 하드코딩 되어있는 oncast가 아니라 location에서 가져오는 oncastId
  const location = useLocation();
  const { oncastId } = location.state;
  // const oncastId = 57;

  const [currentMusicList, setCurrentMusicList] = useState<
    Array<{
      musicId: number;
      title: string;
      artist: string;
      albumCoverUrl: string;
      duration: number;
    }>
  >([]);

  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const handleOpenAlertDialog = () => {
    setOpenAlertDialog(true);
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  useEffect(() => {
    console.log(oncastId);
    requestWithTokenRefresh(() => {
      return axios.get(
        `https://j9b302.p.ssafy.io/api/oncast/play/${oncastId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then(response => {
        console.log(response.data);
        const oncastData = response.data.oncast;
        if (oncastData.djName in DJNameMappingReverse) {
          oncastData.djName =
            DJNameMappingReverse[oncastData.djName as DJNameEnglish];
        }
        setOncasts(oncastData);
      })
      .catch(error => {
        console.error("통신에러 발생", error);
      });
  }, [oncastId]);

  if (!oncasts) {
    return <div>Loading...</div>;
  }

  const ttsFiles = [
    oncasts.ttsOne,
    oncasts.ttsTwo,
    oncasts.ttsThree,
    oncasts.ttsFour,
    oncasts.djName,
  ];

  const scriptFiles = [
    oncasts.scriptOne,
    oncasts.scriptTwo,
    oncasts.scriptThree,
    oncasts.scriptFour,
  ];

  const musicFiles = oncasts.music;

  const handleFinished = () => {
    console.log(
      "handleFinished called. currentIndex:",
      currentIndex,
      "playState:",
      playState
    );

    // 체크: 현재 상태가 TTS이고, currentIndex가 3이면
    if (playState === "TTS" && currentIndex === 3) {
      console.log("currentIndex is 3 and playState is TTS. Showing modal...");
      setShowModal(true);
      return;
    }

    // 체크: 현재 상태가 TTS이면
    if (playState === "TTS") {
      setPlayState("MUSIC");
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setPlayState("TTS");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000104",
        height: "100vh",
        color: "white",
      }}
    >
      {/* <NavBar /> */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "20px",
        }}
      >
        <QueueMusicIcon
          style={{ fontSize: "45px", color: "white", cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {playState === "TTS" ? (
        <Radio
          ttsFiles={[ttsFiles[currentIndex]]}
          scriptFiles={[scriptFiles[currentIndex]]}
          djName={oncasts.djName}
          onFinish={handleFinished}
        />
      ) : (
        currentIndex !== 3 && (
          <Music
            musicFiles={[musicFiles[currentIndex]]}
            onFinish={handleFinished}
            onMusicChange={music =>
              setCurrentMusicList(prev => [...prev, music])
            }
          />
        )
      )}
      <FinishModal show={showModal} onClose={() => setShowModal(false)} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMusicList={currentMusicList}
      />
    </div>
  );
};
