import React, { useState, useRef, useEffect } from "react";
// import NavBar from "../../component/Common/Navbar";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import styles from "./MyMusicPlayer.module.css";
import SearchModal from "../../component/Common/SearchMusicModal";
import DeleteModal from "../../component/MyPage/DeleteModal";
import { useLocation } from "react-router-dom";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import axios from "axios";
import Swal from "sweetalert2";
import noMusicLogo from "../../resources/LogoDesign.png";
import Typography from "@mui/material/Typography";
import store, {
  RootState,
  setMusicDataTemp,
  setPlaylistMetaId,
  setSelectedMusicIndex,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";

type MusicInfo = {
  musicId: number;
  title: string;
  artist: string;
  duration: number;
  albumCoverUrl: string;
  youtubeVideoId: string;
};

export const MyMusicPlayer = () => {
  const dispatch = useDispatch();
  const selectedMusicIndex = useSelector(
    (state: RootState) => state.selectedMusicIndex
  ); // 리덕스 상태에서 selectedMusicIndex를 가져옵니다.

  const [musicData, setMusicData] = useState<MusicInfo[]>([]);

  const location = useLocation();
  //받아와야함

  const playlistMetaId = location.state?.playlistMetaId;
  const passedMusicIndex = location.state?.currentMusicIndex;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    passedMusicIndex || 0
  );

  const [refreshKey, setRefreshKey] = useState(false);

  const handlePlaylistItemClick = (musicId: number) => {
    // 선택된 음악의 musicId를 사용하여 사용자 지정 이벤트를 발송합니다.
    const event = new CustomEvent("musicSelect", { detail: { musicId } });
    window.dispatchEvent(event);
  };
  useEffect(() => {
    // selectedMusicIndex가 바뀔 때마다 currentTrackIndex를 동기화합니다.
    setCurrentTrackIndex(selectedMusicIndex);
  }, [selectedMusicIndex]);
  //이건 플레이리스트를 관리하기 위한 useEffect

  useEffect(() => {
    dispatch(setPlaylistMetaId(playlistMetaId));
  }, [playlistMetaId, dispatch]);

  useEffect(() => {
    if (typeof passedMusicIndex === "number") {
      setCurrentTrackIndex(passedMusicIndex);
    }
  }, [passedMusicIndex]);

  console.log(passedMusicIndex);
  useEffect(() => {
    if (!passedMusicIndex) {
      dispatch(setSelectedMusicIndex(0));
    }

    if (playlistMetaId) {
      requestWithTokenRefresh(() => {
        return axios.get(
          `https://j9b302.p.ssafy.io/api/playlist/${playlistMetaId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then(response => {
          // 이부분 message 안뜸
          if (response.data) {
            setMusicData(response.data);
            const musicDataArray: MusicInfo[] = response.data;
            store.dispatch(setMusicDataTemp(musicDataArray));
          } else {
            Swal.fire({
              icon: "error",
              title: "보관함에 음악이 없습니다!",
              showConfirmButton: false,
              timer: 1500,
            });
            setMusicData([]);
          }
        })
        .catch(error => {
          console.error("axios 에러", error);
        });
    } else {
      requestWithTokenRefresh(() => {
        return axios.get("https://j9b302.p.ssafy.io/api/my-musicbox/info", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      })
        .then(response => {
          if (response.data.message === "보관함에 음악이 없습니다.") {
            Swal.fire({
              icon: "error",
              title: "보관함에 음악이 없습니다!",
              showConfirmButton: false,
              timer: 1500,
            });
            setMusicData([]);
          } else {
            setMusicData(response.data.musicInfo);
            const musicDataArray: MusicInfo[] = response.data.musicInfo;
            store.dispatch(setMusicDataTemp(musicDataArray));
          }
        })
        .catch(error => {
          console.error("axios 에러", error);
        });
    }
  }, [playlistMetaId, refreshKey]);

  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false); // 모달의 열림/닫힘 상태를 관리하는 상태 변수
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const [deletingMusicId, setDeletingMusicId] = useState<number | null>(null);

  const handleDeleteIconClick = (musicId: number) => {
    setDeletingMusicId(musicId);
    handleDeleteModalOpen();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const width = target.offsetWidth;
    const mouseX = e.clientX - target.offsetLeft;
    const rotateY = (mouseX / width - 0.5) * 40;
    target.style.transform = `rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.transform = `rotateY(0deg)`;
  };

  return (
    <div className={styles.root}>
      {/* <NavBar /> */}
      <div className={styles.container}>
        <div className={styles.songDisplayContainer}>
          <div className={styles.coverImageContainer}>
            {/* 이부분 노래가 아무것도 없을때 기본 이미지 설정 가능 */}
            <img
              src={
                musicData.length === 0
                  ? noMusicLogo
                  : musicData[currentTrackIndex]?.albumCoverUrl
              }
              alt={
                musicData.length === 0
                  ? "noMusicLogo"
                  : musicData[currentTrackIndex]?.title
              }
              className={styles.coverImage}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          </div>
          <div className={styles.songListContainer}>
            <div className={styles.songListHeader}>
              <div>현재 재생 목록</div>
              <AddCircleOutline
                onClick={handleSearchModalOpen}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className={styles.songList}>
              {musicData.map((song, index) => (
                <div
                  key={index}
                  className={`${styles.playlistItem} ${
                    currentTrackIndex === index ? styles.playlistItemActive : ""
                  }`}
                  onClick={() => handlePlaylistItemClick(song.musicId)}
                >
                  <img
                    src={song.albumCoverUrl}
                    alt={song.title}
                    className={styles.albumImage}
                  />
                  <div
                    style={{ flex: 1 }}
                    onClick={() => setCurrentTrackIndex(index)}
                  >
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontFamily: "Pretendard-SemiBold",
                        color: "white",
                      }}
                      className={styles.songTitle}
                    >
                      {song.title}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "Pretendard-SemiBold",
                        color: "#a3a3a3",
                      }}
                      variant="body2"
                    >
                      {song.artist}
                    </Typography>
                  </div>
                  <div
                    className={styles.songLength}
                    style={{
                      fontFamily: "Pretendard-SemiBold",
                      color: "#a3a3a3",
                    }}
                  >
                    <DeleteOutlineIcon
                      className={styles.deleteIcon}
                      onClick={event => {
                        event.stopPropagation();
                        handleDeleteIconClick(song.musicId); // pass the song ID to be deleted
                      }}
                    />
                    {Math.floor(song.duration / 60000)}:
                    {String((song.duration % 60000) / 1000).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose} // 모달 바깥쪽을 클릭하면 모달을 닫는다.
        playlistId={playlistMetaId}
        setRefreshKey={() => setRefreshKey(prev => !prev)}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose} // 모달 바깥쪽을 클릭하면 모달을 닫는다.
        musicId={deletingMusicId}
        playlistId={playlistMetaId}
        setRefreshKey={() => setRefreshKey(prev => !prev)}
      />
    </div>
  );
};
