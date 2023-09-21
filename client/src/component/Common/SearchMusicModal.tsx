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

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type MusucType = {
  musicTitle: string;
  musicArtist: string;
  musicImage: string;
  spotifyMusicDuration: number;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<MusucType[]>([]); //검색 관리 state

  const handleSearch = () => {
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
          console.log(response.data);
          if (Array.isArray(response.data) && response.data.length === 0) {
            alert("검색 결과가 없습니다.!");
            setSearchResults([]);
          } else {
            setSearchResults(response.data);
          }
        })
        .catch((error) => {
          console.log("에러발생", error);
        });
    }
  };
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddMusic = (music: MusucType) => {
    console.log(music);
    requestWithTokenRefresh(() => {
      return axios.get(
        `http://localhost:8080/api/search/youtube?musicTitle=${music.musicTitle}&musicArtist=${music.musicArtist}&spotifyMusicDuration=${music.spotifyMusicDuration}&musicImageUrl=${music.musicImage}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then((response) => {
        if (response.data.message === "이미 보관함에 추가된 노래입니다.") {
          setOpen(false);
          alert("이미 보관함에 추가된 노래입니다.");
        } else {
          setOpen(true);
        }
      })
      .catch((error) => {
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
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">노래 검색</Typography>
          <CloseIcon onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <TextField
            fullWidth
            variant="outlined"
            label="노래 제목"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            style={{ marginTop: "10px" }}
          >
            검색
          </Button>
        </div>
        <div
          style={{ marginTop: "30px", maxHeight: "300px", overflowY: "auto" }}
        >
          {searchResults.length > 0 &&
            searchResults.map((music, index) => (
              <div
                key={index}
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
                  src={music.musicImage}
                  alt={`${music.musicTitle} cover`}
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                <div style={{ flex: 2 }}>
                  <div>{music.musicTitle}</div>
                  <div style={{ color: "#888", fontSize: "0.9em" }}>
                    {music.musicArtist}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
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
  );
};

export default SearchModal;
