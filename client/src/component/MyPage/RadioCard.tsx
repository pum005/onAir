import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "../Common/AddFullList";
import { Button } from "@mui/material";
import PlayListModal from "../Common/PlayListModal";
import DeleteModal from "./DeleteModal";
import ShareModal from "./ShareModal";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";

type RecipeReviewCardProps = {
  title: string;
  subheader: string;
  shareCheck: boolean;
  selectCheck: boolean;
};

type SongDataType = {
  musicId: number;
  songTitle: string;
  artist: string;
  duration: string;
  albumCover: string;
}[];

export default function RecipeReviewCard({
  title,
  subheader,
  songs = [],
}: RecipeReviewCardProps & { songs?: SongDataType }) {
  /** state */
  const [open, setOpen] = React.useState(false);
  const [playListModalOpen, setPlayListModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [selectedMusicId, setSelectedMusicId] = React.useState(0);

  /** action */
  const handleClickOpen = (musicId: number) => {
    setSelectedMusicId(musicId);
    // setOpen(true);
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
          if (response.data === "성공") {
            setOpen(true);
          }
          if (response.data === "이미 보관함에 있는 음악입니다.") {
            setOpen(false);
          }
        })
        .catch((error) => {
          console.error("에러발생", error);
        });
    }
  }, [selectedMusicId, open]);
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
          variant="body2"
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
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeleteClick}
          >
            삭제하기
          </Button>
          <Button variant="outlined" color="primary" onClick={handleShareClick}>
            공유하기
          </Button>
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
        isOpen={playListModalOpen}
        onClose={handlePlayListModalClose}
      />
      <DeleteModal isOpen={deleteModalOpen} onClose={handleDeleteModalClose} />
      <ShareModal isOpen={shareModalOpen} onClose={handleShareModalClose} />
    </Card>
  );
}
