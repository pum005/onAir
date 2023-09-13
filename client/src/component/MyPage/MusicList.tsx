import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import MusicBoxModal from "../Common/MusicBoxModal";
import dummyData from "./dummyData.json";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import styles from "./MusicList.module.css";

function MusicList() {
  /** state */
  const userData = useSelector((state: RootState) => state.user); //리덕스에 있는 회원데이터
  const [isMusicBoxModalOpen, setMusicBoxModalOpen] = useState<boolean>(false);
  const [myMusicBox, setMyMusicBox] = useState(dummyData.my_music_box);
  const [playlistData, setPlaylistData] = useState(dummyData.playlist_info);

  const MusicBoxModalOpen = () => {
    setMusicBoxModalOpen(true);
  };

  const MusicBoxModalClose = () => {
    setMusicBoxModalOpen(false);
  };

  return (
    <div>
      <div>뮤직리스트</div>
      <button onClick={MusicBoxModalOpen}>보관함추가</button>
      <MusicBoxModal
        isOpen={isMusicBoxModalOpen}
        onClose={MusicBoxModalClose}
      ></MusicBoxModal>

      <List>
        <ListItem alignItems="flex-start" className={styles.hoverableListItem}>
          <ListItemAvatar>
            <AudiotrackIcon color="primary" style={{ fontSize: 40 }} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography style={{ color: "#FF69B4" }}>전체보관함</Typography>
            }
            secondary={
              <Typography
                style={{ color: "#FF69B4" }}
                component="span"
                variant="body2"
              >
                {myMusicBox} 곡
              </Typography>
            }
          />
          <Button className={styles.playButton}>
            <PlayCircleOutlineIcon />
          </Button>
        </ListItem>

        {playlistData.map((playlist, index) => (
          <ListItem
            key={index}
            alignItems="flex-start"
            className={styles.hoverableListItem}
          >
            <ListItemAvatar>
              <Avatar
                variant="square"
                src={playlist.playlistImage}
                alt={playlist.playlistName}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography style={{ color: "#FF69B4" }}>
                  {playlist.playlistName}
                </Typography>
              }
              secondary={
                <Typography
                  style={{ color: "#FF69B4" }}
                  component="span"
                  variant="body2"
                >
                  {playlist.playlistCount} 곡
                </Typography>
              }
            />
            <Button className={styles.playButton}>
              <PlayCircleOutlineIcon />
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MusicList;
