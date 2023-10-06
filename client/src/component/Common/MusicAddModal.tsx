// MusicAddModal.tsx
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import styles from "./MusicAddModal.module.css";

type MusicAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  //   onAdd: (songName: string) => void; // 노래 추가 시 실행될 함수
};

function MusicAddModal({ isOpen, onClose }: MusicAddModalProps) {
  const [songSearch, setSongSearch] = useState("");

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Typography variant="h6" component="h2">
          음악 추가
        </Typography>
        <input
          value={songSearch}
          onChange={(e) => setSongSearch(e.target.value)}
          placeholder="음악 검색"
        />
        <Button
          onClick={() => {
            // onAdd(songSearch);
            setSongSearch(""); // 입력 초기화
            onClose(); // 모달 닫기
          }}
        >
          추가
        </Button>
        <Button onClick={onClose}>닫기</Button>
      </Box>
    </Modal>
  );
}

export default MusicAddModal;
