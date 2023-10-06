import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddLoading from "./AddLoading";
import SearchLoading from "./SearchLoading";
import styles from "./SearchModal.module.css";
import SearchIcon from "@mui/icons-material/Search";
import AlertModal from "./AlertModal";
import Swal from "sweetalert2";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setRefreshKey?: () => void;
  playlistId?: number;
};

type MusucType = {
  musicTitle: string;
  musicArtist: string;
  musicImage: string;
  spotifyMusicDuration: number;
  externalIds: string;
};

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  setRefreshKey,
  playlistId,
}) => {
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MusucType[]>([]); //검색 관리 state
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Alert 모달
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  const handleModalClose = () => {
    setSearchTerm(""); // 검색어 초기화
    setSearchResults([]); // 검색 결과 초기화
    onClose(); // 모달 닫기
  };

  const handleSearch = () => {
    setIsSearchLoading(true);
    if (searchTerm) {
      requestWithTokenRefresh(() => {
        console.log(searchTerm);
        return axios.get(
          `https://j9b302.p.ssafy.io/api/search/spotify?title=${searchTerm}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then(response => {
          setIsSearchLoading(false);
          if (Array.isArray(response.data) && response.data.length === 0) {
            const Toast = Swal.mixin({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              customClass: {
                popup: "swal2-popup",
              },
            });
            Toast.fire({
              icon: "warning",
              title: "검색 결과가 없습니다!",
            });

            setSearchResults([]);
          } else {
            setSearchResults(response.data);
          }
        })
        .catch(error => {
          setIsSearchLoading(false);
          console.log("에러발생", error);
        });
    } else {
      setIsSearchLoading(false);
    }
  };
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [isAddLoading, setIsAddLoading] = useState(false);

  const handleAddMusic = (music: MusucType) => {
    setIsAddLoading(true);
    requestWithTokenRefresh(() => {
      return axios.get(
        `https://j9b302.p.ssafy.io/api/search/youtube?musicTitle=${music.musicTitle}&musicArtist=${music.musicArtist}&spotifyMusicDuration=${music.spotifyMusicDuration}&musicImageUrl=${music.musicImage}&spotifyId=${music.externalIds}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then(response => {
        setIsAddLoading(false);
        if (response.data.message === "이미 보관함에 추가된 노래입니다.") {
          setOpen(false);
          setAlertMessage("이미 보관함에 추가된 음악입니다 !");
          setIsAlertOpen(true);
          console.log(response.data.musicId);
          console.log(playlistId);
          if (response.data.musicId && playlistId) {
            requestWithTokenRefresh(() => {
              return axios
                .post(
                  "https://j9b302.p.ssafy.io/api/playlist/music",
                  {
                    playlistMetaId: playlistId,
                    musicId: response.data.musicId,
                  },
                  {
                    headers: {
                      Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                    },
                    withCredentials: true,
                  }
                )
                .then(response => {
                  console.log(response.data.message);
                  if (
                    response.data.message ===
                    "이미 플레이리스트에 추가된 음악입니다."
                  ) {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top",
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                      customClass: {
                        popup: "swal2-popup",
                      },
                    });
                    Toast.fire({
                      icon: "error",
                      title: "이미 플레이리스트에 추가된 음악입니다.!",
                    });
                    // alert("이미 플레이리스트에 추가된 음악입니다.!");
                  } else {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top",
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                      customClass: {
                        popup: "swal2-popup",
                      },
                    });
                    Toast.fire({
                      icon: "success",
                      title: "현재 플레이 리스트에 음악이 추가되었습니다.!",
                    });

                    if (setRefreshKey) {
                      setRefreshKey();
                    }
                  }
                })
                .catch(error => {
                  console.error("Error adding music to playlist", error);
                });
            });
          }
        } else if (response.data.code === 204) {
          setOpen(false);
          setAlertMessage(response.data.message);
          setIsAlertOpen(true);
        } else {
          setAlertMessage("전체보관함에 추가되었습니다.");
          if (setRefreshKey) {
            setRefreshKey();
          }
          setOpen(true);
          if (response.data.musicId && playlistId) {
            requestWithTokenRefresh(() => {
              return axios
                .post(
                  "https://j9b302.p.ssafy.io/api/playlist/music",
                  {
                    playlistMetaId: playlistId,
                    musicId: response.data.musicId,
                  },
                  {
                    headers: {
                      Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                    },
                    withCredentials: true,
                  }
                )
                .then(response => {
                  if (
                    response.data.message ===
                    "이미 플레이리스트에 추가된 음악입니다."
                  ) {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top",
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                      customClass: {
                        popup: "swal2-popup",
                      },
                    });
                    Toast.fire({
                      icon: "error",
                      title: "이미 플레이리스트에 추가된 음악입니다!",
                    });
                  } else {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: "top",
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                      customClass: {
                        popup: "swal2-popup",
                      },
                    });
                    Toast.fire({
                      icon: "success",
                      title: "현재 플레이 리스트에 음악이 추가되었습니다.!",
                    });
                    if (setRefreshKey) {
                      setRefreshKey();
                    }
                  }
                })
                .catch(error => {
                  console.error("Error adding music to playlist", error);
                });
            });
          }
        }
      })
      .catch(error => {
        setIsAddLoading(false);
        console.log("에러발생", error);
      });
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.round(milliseconds / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleModalClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box className={styles.modalContainer}>
          <div className={styles.header}>
            <div>
              <div>
                <CloseIcon
                  onClick={handleModalClose}
                  className={styles.closeIcon}
                />
              </div>
              <div>
                <Typography
                  className={styles.musicSearchTitle}
                  variant="h5"
                  fontFamily="GangwonEduPowerExtraBoldA"
                  marginBottom="10px"
                >
                  음악 검색
                </Typography>
              </div>
            </div>
          </div>
          <div className={styles.textFieldContainer}>
            <TextField
              id="standard-basic"
              placeholder="음악 제목을 입력해주세요"
              variant="standard"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <SearchIcon
                    className={styles.searchButton}
                    onClick={handleSearch}
                  />
                ),
              }}
              inputProps={{
                style: { color: "#f5e9e9" }, // This style is applied to the actual input element
              }}
              style={{ width: "300px" }}
            />
          </div>
          <div className={styles.searchResults}>
            {searchResults.length > 0 &&
              searchResults.map((music, index) => (
                <div key={index} className={styles.musicItem}>
                  <img
                    src={music.musicImage}
                    alt={`${music.musicTitle} cover`}
                    className={styles.musicImage}
                  />
                  <div className={styles.musicDetails}>
                    <div
                      ref={el => (titleRefs.current[index] = el)}
                      className={styles.musicTitle}
                      title={music.musicTitle}
                      onMouseOver={() => {
                        const titleEl = titleRefs.current[index];
                        const spanEl = titleEl?.querySelector("span"); // span 요소를 가져옵니다.
                        if (
                          spanEl &&
                          titleEl &&
                          spanEl.scrollWidth > titleEl.clientWidth
                        ) {
                          titleEl.classList.add("longTitle");
                        }
                      }}
                      onMouseOut={() => {
                        const el = titleRefs.current[index];
                        if (el) {
                          el.classList.remove("longTitle");
                        }
                      }}
                    >
                      <span style={{ fontFamily: "Pretendard-SemiBold" }}>
                        {music.musicTitle}
                      </span>
                    </div>
                    <div
                      style={{ fontFamily: "Pretendard-SemiBold" }}
                      className={styles.artistName}
                    >
                      {music.musicArtist}
                    </div>
                  </div>
                  <div
                    style={{ fontFamily: "Pretendard-SemiBold" }}
                    className={styles.musicDuration}
                  >
                    {formatTime(music.spotifyMusicDuration)}
                  </div>
                  <AddCircleOutlineIcon
                    style={{ marginLeft: "8px" }}
                    className={styles.addCircleButtonClick}
                    cursor="pointer"
                    onClick={() => handleAddMusic(music)}
                  />
                </div>
              ))}
          </div>

          <AlertModal
            open={open}
            onClose={handleClose}
            message={alertMessage}
          ></AlertModal>
        </Box>
      </Modal>
      <AlertModal
        open={isAlertOpen}
        message={alertMessage}
        onClose={closeAlert}
      />
      {isSearchLoading && <SearchLoading />}
      {isAddLoading && <AddLoading />}
    </div>
  );
};

export default SearchModal;
