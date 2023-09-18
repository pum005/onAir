import NavBar from "../../component/Common/Navbar";
import PlayListModal from "../../component/PlayerPage/PlayListModal";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { LiveRadio } from "../../component/PlayerPage/LiveRadio";
import { useState } from "react";

type LivePlayerProps = {};

export const LivePlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>라이브 라디오 페이지</h2>
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <QueueMusicIcon
          style={{ fontSize: "2.5rem", color: "white", cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <LiveRadio />
      <PlayListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
