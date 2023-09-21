import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMusicInfo, setRadioDummyData } from "../../store"; // 필요한 액션들을 임포트합니다.
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Navigate, useNavigate } from "react-router-dom";

type RadioPlayModalProps = {
  open: boolean;
  handleClose: () => void;
  radioName?: string;
  oncastId?: number;
};

const RadioPlayModal: React.FC<RadioPlayModalProps> = ({
  open,
  handleClose,
  radioName,
  oncastId,
}) => {
  const [fetchedData, setFetchedData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate(); //페이지 이동 함수

  type MusicItem = {
    title: string;
    artist: string;
    duration: number;
    albumCoverUrl: string;
    youtubeId: string;
  };

  const handleConfirm = () => {
    if (oncastId) {
      requestWithTokenRefresh(() => {
        return axios.get(`http://localhost:8080/api/oncast/play/${oncastId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      })
        .then(response => {
          console.log("Response Data:", response.data);
          setFetchedData(response.data);

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
          } = response.data.oncast;

          const music: MusicItem[] = response.data.oncast.music;

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
              oncast_music_one: music[0].youtubeId,
              oncast_music_two: music[1].youtubeId,
              oncast_music_three: music[2].youtubeId,
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
          navigate("/RadioPlayer");
          // 모달 닫기
          handleClose();
        })
        .catch(error => {
          console.error("에러 발생", error);
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">라디오 플레이어</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {radioName
            ? `${radioName} 라디오를 들으시겠습니까?`
            : "전체 플레이리스트에 추가되었습니다."}{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
          확인
        </Button>
        <Button onClick={handleClose} color="secondary">
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RadioPlayModal;
