import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardMedia from "@mui/material/CardMedia";
import AddIcon from "@mui/icons-material/Add";
import AlertDialog from "../Common/AddFullList";
import { Button } from "@mui/material";
import PlayListModal from "../Common/PlayListModal";
import DeleteModal from "./DeleteModal";
import ShareModal from "./ShareModal";

type RecipeReviewCardProps = {
  title: string;
  subheader: string;
  feeling: string;
  image: string;
};

type SongDataType = {
  songTitle: string;
  artist: string;
  duration: string;
  albumCover: string;
}[];

export default function RecipeReviewCard({
  title,
  subheader,
  songs = [],
  feeling,
  image,
}: RecipeReviewCardProps & { songs?: SongDataType }) {
  const [open, setOpen] = React.useState(false);
  const [playListModalOpen, setPlayListModalOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // 알림 모달이 닫히면 플레이리스트 모달을 연다.
    setPlayListModalOpen(true);
  };

  const handlePlayListModalClose = () => {
    setPlayListModalOpen(false);
  };

  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const [shareModalOpen, setShareModalOpen] = React.useState(false);

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setShareModalOpen(false);
  };

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
            <AddIcon
              style={{ marginLeft: "8px" }}
              onClick={handleClickOpen}
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
