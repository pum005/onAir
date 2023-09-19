import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // 여기에 검색 로직을 추가합니다.
    console.log(`Searching for: ${searchTerm}`);
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
            onChange={e => setSearchTerm(e.target.value)}
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
          {/* 여기에 검색 결과를 표시합니다. */}
        </div>
      </Box>
    </Modal>
  );
};

export default SearchModal;
