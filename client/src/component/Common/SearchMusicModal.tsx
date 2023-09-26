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

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type MusucType = {
  musicTitle: string;
  musicArtist: string;
  musicImage: string;
  spotifyMusicDuration: number;
  externalIds: string;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MusucType[]>([]); //검색 관리 state
  const [isSearchLoading, setIsSearchLoading] = useState(false);

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
          alert("이미 보관함에 추가된 노래입니다.");
        } else if (response.data.code === 204) {
          setOpen(false);
          alert(response.data.message);
        } else {
          setOpen(true);
        }
      })
      .catch((error) => {
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
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "100px", // Add this line
        }}
      >
        <Box className={styles.modalContainer}>
          <div className={styles.header}>
            <Typography variant="h6">음악 검색</Typography>
            <CloseIcon onClick={onClose} className={styles.closeIcon} />
          </div>
          <div className={styles.textFieldContainer}>
            <TextField
              id="standard-basic"
              label="음악 제목"
              variant="standard"
              fullWidth
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
                style: { color: '#fff' }  // Add this line
              }}
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
                    style={{ marginLeft: "8px" }}
                    cursor="pointer"
                    onClick={() => handleAddMusic(music)}
                  />
                </div>
              ))}
          </div>
          <AlertDialog open={open} handleClose={handleClose} />
        </Box>
      </Modal>
      {isSearchLoading && <SearchLoading />}
      {isAddLoading && <AddLoading />}
    </div>
  );
};

export default SearchModal;
