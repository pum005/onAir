import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import MusicBoxModal from "../Common/MusicBoxModal";
import MusicAddModal from "../Common/MusicAddModal";
import AllMusicDetailModal from "./AllMusicDetailModal";
import MusicDetailModal from "./MusicDetailModal";
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
  const [isMusicBoxModalOpen, setMusicBoxModalOpen] = useState<boolean>(false); //보관함 추가 모달
  const [myMusicBox, setMyMusicBox] = useState(dummyData.my_music_box); //전체 보관함 관리 state
  const [playlistData, setPlaylistData] = useState(dummyData.playlist_info); //플레이리스트별 관리 state
  const [newPlaylistTitle, setNewPlaylistTitle] = useState(""); //새로운 플레이리스트 제목 관리 state
  const [isMusicAddModalOpen, setMusicAddModalOpen] = useState<boolean>(false); //음악 더하기 변수
  const [isAllMusicDetailModalOpen, setAllMusicDetailModalOpen] =
    useState<boolean>(false); //전체 보관함 음악 상세 보기 모달 state
  const [isMusicDetailModalOpen, setMusicDetailModalOpen] =
    useState<boolean>(false); //플레이리스트 음악 상세 보기 모달 state
  const [selectedPlaylistName, setSelectedPlaylistName] = useState<String>(""); //플레이리스트 이름 관리 state

  /** function */
  //보관함추가 실행 함수
  const MusicBoxModalOpen = () => {
    setMusicBoxModalOpen(true);
  };

  //보관함추가 닫기 함수
  const MusicBoxModalClose = () => {
    setMusicBoxModalOpen(false);
  };

  //보관함 추가 함수
  const addMusicBox = () => {
    const newPlaylist = {
      playlistName: newPlaylistTitle,
      playlistCount: 0,
      playlistImage: "https://icons8.com/icon/Xvnz23NvQSwk/shield",
    };
    setPlaylistData((prevData) => [...prevData, newPlaylist]);
    setNewPlaylistTitle("");
    MusicBoxModalClose();
  };
  // 예스맨

  //음악검색 모달 열기 함수
  const openMusicAddModal = () => {
    setMusicAddModalOpen(true);
  };
  //음악검색 모달 닫기 함수
  const closeMusicAddModal = () => {
    setMusicAddModalOpen(false);
  };

  //전체 음악상세보기 모달 열기 함수
  const openAllMusicDetailModal = () => {
    setAllMusicDetailModalOpen(true);
  };

  //전체 음악상세보기 모달 닫기 함수
  const closeAllMusicDetailModal = () => {
    setAllMusicDetailModalOpen(false);
  };

  //플레이리스트 음악상세보기 모달 열기 함수
  const openPlayListDetailModal = () => {
    setMusicDetailModalOpen(true);
  };
  //플레이리스트 음악상세보기 모달 닫기 함수
  const closePlayListDetailModal = () => {
    setMusicDetailModalOpen(false);
  };

  return (
    <div>
      <div>뮤직리스트</div>
      <button onClick={MusicBoxModalOpen}>보관함추가</button>
      <MusicBoxModal
        isOpen={isMusicBoxModalOpen}
        onClose={MusicBoxModalClose}
        addMusicBox={addMusicBox}
        title={newPlaylistTitle}
        setTitle={setNewPlaylistTitle}
      ></MusicBoxModal>
      <List>
        {/* 전체보관함 */}
        <ListItem alignItems="flex-start" className={styles.hoverableListItem}>
          <ListItemAvatar>
            <AudiotrackIcon
              color="primary"
              className={styles.audiotrackIcon}
              onClick={openMusicAddModal}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                className={styles.textPrimary}
                onClick={openAllMusicDetailModal}
              >
                전체보관함
              </Typography>
            }
            secondary={
              <Typography
                className={styles.textSecondary}
                component="span"
                variant="body2"
              >
                {myMusicBox} 곡
              </Typography>
            }
          />
          <Button
            className={styles.playButton}
            onClick={() => {
              if (myMusicBox === 0) {
                alert("재생할 노래가 없습니다!");
              }
            }}
          >
            <PlayCircleOutlineIcon />
          </Button>
          <AllMusicDetailModal
            isOpen={isAllMusicDetailModalOpen}
            onClose={closeAllMusicDetailModal}
            title="전체보관함"
          />
        </ListItem>
        <MusicAddModal
          isOpen={isMusicAddModalOpen}
          onClose={closeMusicAddModal}
        />
        {/* 플레이리스트  */}
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
                onClick={openMusicAddModal}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  className={styles.textPrimary}
                  onClick={openPlayListDetailModal}
                >
                  {playlist.playlistName}
                </Typography>
              }
              secondary={
                <Typography
                  className={styles.textSecondary}
                  component="span"
                  variant="body2"
                >
                  {playlist.playlistCount} 곡
                </Typography>
              }
            />
            <Button
              className={styles.playButton}
              onClick={() => {
                if (playlist.playlistCount === 0) {
                  alert("재생할 노래가 없습니다!");
                }
              }}
            >
              <PlayCircleOutlineIcon />
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default MusicList;
