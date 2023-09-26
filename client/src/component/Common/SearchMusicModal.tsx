import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "./AddFullList";
import AddLoading from "./AddLoading";
import SearchLoading from "./SearchLoading";
import styles from "./SearchModal.module.css";
import SearchIcon from "@mui/icons-material/Search";
import AlertModal from "./AlertModal";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setRefreshKey?: () => void;
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MusucType[]>([]); //검색 관리 state
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Alert 모달 상태
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
          `http://localhost:8080/api/search/spotify?title=${searchTerm}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then((response) => {
          setIsSearchLoading(false);
          if (Array.isArray(response.data) && response.data.length === 0) {
            alert("검색 결과가 없습니다.!");
            setSearchResults([]);
          } else {
            setSearchResults(response.data);
          }
        })
        .catch((error) => {
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
        `http://localhost:8080/api/search/youtube?musicTitle=${music.musicTitle}&musicArtist=${music.musicArtist}&spotifyMusicDuration=${music.spotifyMusicDuration}&musicImageUrl=${music.musicImage}&spotifyId=${music.externalIds}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then((response) => {
        setIsAddLoading(false);

        if (response.data.message === "이미 보관함에 추가된 노래입니다.") {
          setOpen(false);
          setAlertMessage("이미 보관함에 추가된 노래입니다.");
          setIsAlertOpen(true);
        } else if (response.data.code === 204) {
          setOpen(false);
          setAlertMessage(response.data.message);
          setIsAlertOpen(true);
        } else {
          setOpen(true);
          console.log(setRefreshKey);
          if (setRefreshKey) {
            setRefreshKey();
          }
        }
      })
      .catch((error) => {
        setIsAddLoading(false);
        console.log("에러발생", error);
      });
  };
  //
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
                <Typography variant="h6">노래 검색</Typography>
              </div>
            </div>
          </div>
          <div className={styles.textFieldContainer}>
            <TextField
              id="standard-basic"
              placeholder="노래 제목을 입력해주세요"
              variant="standard"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className={styles.searchField}
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
                    <div>{music.musicTitle}</div>
                    <div className={styles.artistName}>{music.musicArtist}</div>
                  </div>
                  <div className={styles.musicDuration}>
                    {formatTime(music.spotifyMusicDuration)}
                  </div>
                  <AddCircleOutlineIcon
                    style={{ marginLeft: "8px", color: "white" }}
                    cursor="pointer"
                    onClick={() => handleAddMusic(music)}
                  />
                </div>
              ))}
          </div>
          <AlertDialog open={open} handleClose={handleClose} />
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
