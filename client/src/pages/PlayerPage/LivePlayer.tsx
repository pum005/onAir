import NavBar from "../../component/Common/Navbar";
import PlayListModal from "../../component/PlayerPage/PlayListModal";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { LiveRadio } from "../../component/PlayerPage/LiveRadio";
import React, { useEffect, useState } from "react";
import { socketConnection } from "../../utils/socket.atom";

type LivePlayerProps = {};

export const LivePlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("라이브 페이지 들어옴");
    socketConnection(); // 웹소켓 연결 함수 호출

    // 컴포넌트가 언마운트될 때 웹소켓 연결 종료 (선택적)
    return () => {
      // socketManager.disconnect();  // 웹소켓 연결 종료 함수 호출
    };
  }, []); // 빈 배열을 dependency로 전달하여 한 번만 실행되도록 함

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
