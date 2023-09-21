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
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.log("에러발생", error);
        });
    }
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
        <div style={{ marginTop: "30px" }}>
          {searchResults.map((music, index) => (
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
                {music.spotifyMusicDuration}
              </div>
              <AddCircleOutlineIcon
                style={{ marginLeft: "8px" }}
                // onClick={() => handleClickOpen(index)}
                cursor="pointer"
              />
            </div>
          ))}
        </div>
      </Box>
    </Modal>
  );
};

export default SearchModal;
