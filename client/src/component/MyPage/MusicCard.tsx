import React, { useState } from "react";
import MusicAddModal from "../Common/MusicAddModal";
import MusicDetailModal from "./MusicDetailModal";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import picture from "../../resources/흥애.png";
import logoPicture from "../../resources/LogoDesign.png";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./MusicCard.module.css";
import MusicBoxAddModal from "../Common/CreatePlayList";
import { Link } from "react-router-dom";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import axios from "axios";
import Swal from "sweetalert2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteModal from "./DeleteModal";
import MusicBoxMusicListModal from "./MusicBoxMusicListModal";
import { useNavigate } from "react-router-dom";
import AlertModal from "../Common/AlertModal";

type ApiResponseType = {
  my_music_box: number;
  playlist_info: Array<{
    playlistImage: string;
    playlistCount: number;
    playlistName: string;
    playlistMetaId: number;
  }>;
};

function MusicCard({ refreshFlag }: any) {
  /** state */
  const [isMusicBoxModalOpen, setMusicBoxModalOpen] = useState<boolean>(false); //보관함 추가 모달
  // const [myMusicBox, setMyMusicBox] = useState(0); //전체 보관함 관리 state
  const [data, setData] = useState<ApiResponseType | null>(null); //데이터 관리
  const [isMusicAddModalOpen, setMusicAddModalOpen] = useState<boolean>(false); //음악 더하기 변수
  const [isDeleteModal, setDeleteModal] = useState<boolean>(false);
  // 전체 보관함 상태
  const [isMusicDetailModalOpen, setMusicDetailModalOpen] =
    useState<boolean>(false);
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] =
    useState<string>("");

  // 플레이리스트 상태
  const [isMusicDetailModalOpenTwo, setMusicDetailModalOpenTwo] =
    useState<boolean>(false);
  const [selectedPlaylistTitleTwo, setSelectedPlaylistTitleTwo] =
    useState<string>("");

  const [refreshPlaylist, setRefreshPlaylist] = useState(false); //플리추가 렌더링 할 state(보관함 전체 불러오기)
  const [refreshKey, setRefreshKey] = useState(false); //닫기눌렀을때도 리렌더링
  const [refreshKeyTwo, setRefreshKeyTwo] = useState(false);

  const [removeList, setRemoveList] = useState(0);

  const [selectedPlaylistMetaId, setSelectedPlaylistMetaId] = useState<
    number | null
  >(null);
  const navigate = useNavigate();
  /** function */
  //보관함추가 실행 함수
  const MusicBoxModalOpen = () => {
    setMusicBoxModalOpen(true);
  };

  //보관함추가 닫기 함수
  const MusicBoxModalClose = () => {
    setMusicBoxModalOpen(false);
  };

  //음악검색 모달 열기 함수
  const openMusicAddModal = () => {
    setMusicAddModalOpen(true);
  };
  //음악검색 모달 닫기 함수
  const closeMusicAddModal = () => {
    setMusicAddModalOpen(false);
  };

  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  // 전체 보관함 모달 열기 함수
  const openMusicDetailModal = (playlistName: string) => {
    setSelectedPlaylistTitle(playlistName);
    setMusicDetailModalOpen(true);
  };

  // 플레이리스트 모달 열기 함수
  const openMusicDetailModalTwo = (
    playlistName: string,
    playlistMetaId?: number | null
  ) => {
    setSelectedPlaylistTitleTwo(playlistName);
    if (playlistMetaId) {
      setSelectedPlaylistMetaId(playlistMetaId);
    }
    setMusicDetailModalOpenTwo(true);
  };

  // 음악 리스트상세보기 모달 닫기 함수
  const closeMusicDetailModal = () => {
    setRefreshKey(prevKey => !prevKey);
    setMusicDetailModalOpen(false);
  };

  const closeMusicDetailModalTwo = () => {
    setRefreshKeyTwo(prevKey => !prevKey);
    setMusicDetailModalOpenTwo(false);
  };

  const handlePlayButtonClick = () => {
    navigate("/MyMusicPlayer", { state: { playlistMetaId: null } });
  };

  const handlePlayListPlayButtonClick = (playlistMetaId: number) => {
    navigate("/MyMusicPlayer", { state: { playlistMetaId: playlistMetaId } });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  /** axios */
  //음악 보관함리스트 가져오기
  React.useEffect(() => {
    requestWithTokenRefresh(() => {
      return axios.get("https://j9b302.p.ssafy.io/api/my-musicbox", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });
    })
      .then(response => {
        // 데이터 정규화
        const normalizedData: ApiResponseType = {
          my_music_box: response.data.my_music_box,
          playlist_info: response.data.playlist_info || [],
        };
        setData(normalizedData);
      })
      .catch(error => {
        console.error("데이터 가져오기 오류:", error);
      });
  }, [refreshPlaylist, refreshKey, refreshFlag, refreshKeyTwo]);

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <div className={styles.listScrollbar}>
        <List style={{ paddingTop: "0" }}>
          <ListItem
            alignItems="center"
            className={styles.hoverableListItem}
            style={{ height: "56.8px" }}
            onClick={MusicBoxModalOpen}
          >
            <ListItemAvatar
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AddIcon
                className={styles.audiotrackIcon}
                style={{
                  cursor: "pointer",
                  fontSize: "40px",
                  color: "white",
                }}
              />
            </ListItemAvatar>
            <ListItemText
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography
                className={styles.textPrimary}
                style={{ fontFamily: "Pretendard-Medium" }}
              >
                플레이리스트 생성
              </Typography>
            </ListItemText>
          </ListItem>

          {/* 전체보관함 */}
          <ListItem
            alignItems="center"
            className={styles.hoverableListItem}
            style={{ display: "flex", alignItems: "center", height: "56.8px" }} // 높이를 조정했습니다.
          >
            <ListItemAvatar
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <AudiotrackIcon
                className={styles.audiotrackIcon}
                onClick={() => {
                  if (data?.my_music_box === 0) {
                    Swal.fire({
                      icon: "error",
                      title: "보관함에 음악이 없습니다!",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  } else {
                    openMusicDetailModal("전체보관함");
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "40px",
                  color: "white",
                  borderRadius: "5px",
                  border: "1px solid #626262",
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  className={styles.textPrimary}
                  onClick={() => {
                    if (data?.my_music_box === 0) {
                      Swal.fire({
                        icon: "error",
                        title: "보관함에 음악이 없습니다!",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    } else {
                      openMusicDetailModal("전체보관함");
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    fontFamily: "Pretendard-Medium",
                    color: "white",
                  }}
                >
                  전체보관함
                </Typography>
              }
            />
            <Typography
              className={styles.textSecondary}
              component="span"
              variant="body2"
              style={{ marginRight: "30%", marginLeft: "auto" }} // 여기에서 스타일을 조절하여 곡 수를 원하는 위치에 배치합니다.
            >
              {data?.my_music_box} 곡
            </Typography>
            <Button
              className={styles.playButton}
              onClick={() => {
                if (data?.my_music_box === 0) {
                  Swal.fire({
                    icon: "error",
                    title: "재생할 음악이 없습니다!",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                } else {
                  handlePlayButtonClick();
                }
              }}
            >
              <PlayArrowIcon
                className={styles.playArrowIcon}
                style={{ color: "rgb(75, 75, 75)" }}
              />
            </Button>
            <MusicDetailModal
              isOpen={isMusicDetailModalOpen}
              onClose={closeMusicDetailModal}
              title={selectedPlaylistTitle}
              playlistMetaId={null}
            />
          </ListItem>

          <MusicAddModal
            isOpen={isMusicAddModalOpen}
            onClose={closeMusicAddModal}
          />
          {/* 플레이리스트  */}
          {data?.playlist_info.map((Playlist, index) => (
            <ListItem
              key={index}
              alignItems="center"
              className={styles.hoverableListItem}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  style={{ marginTop: "auto", marginBottom: "auto" }}
                  variant="square"
                  src={Playlist.playlistImage || logoPicture}
                  alt={Playlist.playlistName}
                  onClick={() => {
                    if (Playlist.playlistCount === 0) {
                      Swal.fire({
                        icon: "error",
                        title: "보관함에 음악이 없습니다!",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    } else {
                      openMusicDetailModalTwo(
                        Playlist.playlistName,
                        Playlist.playlistMetaId
                      );
                    }
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    className={styles.textPrimary}
                    style={{ fontFamily: "Pretendard-Medium" }}
                    onClick={() => {
                      if (Playlist.playlistCount === 0) {
                        Swal.fire({
                          icon: "error",
                          title: "재생할 음악이 없습니다!",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      } else {
                        openMusicDetailModalTwo(
                          Playlist.playlistName,
                          Playlist.playlistMetaId
                        );
                      }
                    }}
                  >
                    {Playlist.playlistName}
                  </Typography>
                }
              />
              <Typography
                className={styles.textSecondary}
                component="span"
                variant="body2"
                style={{
                  marginRight: "30%",
                  marginLeft: "auto",
                  fontFamily: "Pretendard-Medium",
                }} // 여기에서 스타일을 조절하여 곡 수를 원하는 위치에 배치합니다.
              >
                {Playlist.playlistCount} 곡
              </Typography>
              <DeleteOutlineIcon // 2. 쓰레기통 아이콘 추가
                className={styles.DeleteOutlineIcon}
                onClick={() => {
                  setRemoveList(Playlist.playlistMetaId);
                  openDeleteModal();
                }}
                style={{ color: "rgba(228, 224, 224, 0.197)" }}
              />
              <Button
                className={styles.playButton}
                onClick={event => {
                  if (Playlist.playlistCount === 0) {
                    Swal.fire({
                      icon: "error",
                      title: "재생할 음악이 없습니다!",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  } else {
                    handlePlayListPlayButtonClick(Playlist.playlistMetaId);
                  }
                }}
              >
                <PlayArrowIcon
                  className={styles.playArrowIcon}
                  style={{ color: "rgba(228, 224, 224, 0.197)" }}
                />
              </Button>
            </ListItem>
          ))}
          <MusicBoxMusicListModal
            isOpen={isMusicDetailModalOpenTwo}
            onClose={closeMusicDetailModalTwo}
            title={selectedPlaylistTitleTwo}
            playlistMetaId={selectedPlaylistMetaId}
          />
        </List>
        <MusicBoxAddModal
          isOpen={isMusicBoxModalOpen}
          onClose={MusicBoxModalClose}
          refresh={() => setRefreshPlaylist(!refreshPlaylist)}
        />
        <DeleteModal
          isOpen={isDeleteModal}
          onClose={closeDeleteModal}
          playlistId={removeList}
          refresh={() => setRefreshKey(prevKey => !prevKey)}
        />
        <AlertModal
          open={showAlert}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      </div>
    </div>
  );
}

export default MusicCard;
