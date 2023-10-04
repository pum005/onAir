// PlayListModal.tsx
import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./MusicBoxModal.module.css";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { error } from "console";

type MusicBoxModalProps = {
  isOpen: boolean;
  onClose: () => void;
  addMusicBox: () => void;
  title: string;
  setTitle: (title: string) => void;
};

function MusicBoxModal({
  isOpen,
  onClose,
  addMusicBox,
  title,
  setTitle,
}: MusicBoxModalProps) {
  /**axios */
  React.useEffect(() => {
    if (title) {
      requestWithTokenRefresh(() => {
        return axios.post(
          "https://j9b302.p.ssafy.io/api/playlist",
          { playlistName: title },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.log("통신에러발생", error);
        });
    }
  }, [title]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          보관함 추가
        </Typography>
        <input value={title} onChange={e => setTitle(e.target.value)} />
        <Button onClick={onClose}>닫기</Button>
        <button onClick={addMusicBox}>추가버튼</button>
      </Box>
    </Modal>
  );
}

export default MusicBoxModal;
