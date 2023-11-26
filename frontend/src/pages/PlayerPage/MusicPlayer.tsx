// import NavBar from "../../component/Common/Navbar";
import { Music } from "../../component/PlayerPage/Music";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import Modal from "../../component/PlayerPage/PlayListModal";
import { useState } from "react";

type MusicPlayerProps = {};

export const MusicPlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ backgroundColor: "#000104", height: "90vh", color: "white" }}>
      {/* <NavBar /> */}
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <QueueMusicIcon
          style={{ fontSize: "2.5rem", color: "white", cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {/* <Music /> */}
      {/* 모달 컴포넌트 추가 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="음악 목록" // 원하는 타이틀로 변경 가능
        content="음악들" // 원하는 내용으로 변경 가능
      />
    </div>
  );
};
