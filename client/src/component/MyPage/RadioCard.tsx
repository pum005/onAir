import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "../Common/AddFullList";
import PlayListModal from "../Common/PlayListModal";
import DeleteModal from "./DeleteModal";
import ShareModal from "./ShareModal";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioPlayModal from "../PlayerPage/RadioPlayModal";

type RecipeReviewCardProps = {
  oncastId: number;
  title: string;
  subheader: string;
  shareCheck: boolean;
  selectCheck: boolean;
  refreshkey?: () => void;
};

type SongDataType = {
  musicId: number;
  songTitle: string;
  artist: string;
  duration: string;
  albumCover: string;
}[];

export default function RecipeReviewCard({
  oncastId,
  title,
  subheader,
  shareCheck,
  refreshkey,
  songs = [],
}: RecipeReviewCardProps & { songs?: SongDataType }) {
  /** state */
  const [open, setOpen] = React.useState(false);
  const [playListModalOpen, setPlayListModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [radioplayModalOpen, setRadioplayModalOpen] = React.useState(false);
  const [selectedMusicId, setSelectedMusicId] = React.useState(0);
  //이건 토글로 두어야 계속 불러볼 수 있음.
  const [isPulsButtonClicked, setIsPlusButtonClicked] = React.useState(false);

  /** action */

  //음악 보관함에 추가
  const handleClickOpen = (musicId: number) => {
    setSelectedMusicId(musicId);
    setIsPlusButtonClicked(!isPulsButtonClicked);
  };

  const handleClose = () => {
    setOpen(false);
    // 알림 모달이 닫히면 플레이리스트 모달을 연다.
    setPlayListModalOpen(true);
  };

  const handlePlayListModalClose = () => {
    setPlayListModalOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };

  const handlePlayModalClick = () => {
    setRadioplayModalOpen(true);
  };

  const handlePlayModalClose = () => {
    setRadioplayModalOpen(false);
  };

  /**axios */
  //AddCircleOutlineIcon 이거 눌렀을때 전체 보관함 추가하고 나의 플레이리스트 열기
  React.useEffect(() => {
    if (selectedMusicId) {
      // selectedMusicId가 설정되었을 때만 API 호출
      requestWithTokenRefresh(() => {
        return axios.post(
          "http://localhost:8080/api/my-musicbox",
          { musicId: selectedMusicId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then((response) => {
          console.log(response.data);
          if (response.data.message === "음악 추가 완료") {
            setOpen(true);
          }
          if (response.data.message === "이미 보관함에 있는 음악입니다.") {
            setOpen(false);
            alert("이미 보관함에 있는 음악입니다.");
          }
        })
        .catch((error) => {
          console.error("에러발생", error);
        });
    }
  }, [selectedMusicId, isPulsButtonClicked]);
  //일단 여기 대기

  React.useEffect(() => {});

  return (
    <Card
      sx={{
        maxWidth: 345,
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "auto",
        height: "300px",
      }}
    >
      <CardContent style={{ maxHeight: "300px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            style={{ textAlign: "left" }}
          >
            {title}
          </Typography>
          <Typography variant="h6" component="div" color="primary">
            JOYFUL
          </Typography>
        </div>
        <Typography
          variant="h5"
          color="text.secondary"
          style={{ textAlign: "center" }}
          component="div"
        >
          {subheader}
        </Typography>
        <hr />
        {songs.map((song, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "5px",
            }}
          >
            <img
              src={song.albumCover}
              alt={`${song.songTitle} cover`}
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            <div style={{ flex: 2 }}>
              <div>{song.songTitle}</div>
              <div style={{ color: "#888", fontSize: "0.9em" }}>
                {song.artist}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>{song.duration}</div>
            <AddCircleOutlineIcon
              style={{ marginLeft: "8px" }}
              onClick={() => handleClickOpen(song.musicId)}
              cursor="pointer"
            />
          </div>
        ))}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <ShareIcon
              onClick={handleShareClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>
            <PlayCircleIcon
              onClick={handlePlayModalClick}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>
            <DeleteIcon
              onClick={handleDeleteClick}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            color: "#FF5C58",
          }}
          aria-label="add to favorites"
        ></IconButton>
      </CardContent>
      <AlertDialog open={open} handleClose={handleClose} />
      <PlayListModal
        musicId={selectedMusicId}
        isOpen={playListModalOpen}
        onClose={handlePlayListModalClose}
      />
      <DeleteModal
        setRefreshKey={refreshkey}
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        oncastId={oncastId}
      />
      <ShareModal
        isOpen={shareModalOpen}
        onClose={handleShareModalClose}
        oncastId={oncastId}
      />

      <RadioPlayModal
        open={radioplayModalOpen}
        handleClose={handlePlayModalClose}
        radioName={subheader}
        oncastId={oncastId}
      />
    </Card>
  );
}
