import NavBar from "../../component/Common/Navbar";
import PlayListModal from "../../component/PlayerPage/PlayListModal";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import React, { useEffect, useState } from "react";
import { socketConnection, MusicData } from "../../utils/socket.atom";
import SocketManager from "../../utils/socket";
import { Radio } from "../../component/PlayerPage/LiveRadio";
import { LiveMusic } from "../../component/PlayerPage/LiveMusic";

type LivePlayerProps = {};

export const LivePlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicData | null>(null);

  let socketManager = SocketManager.getInstance();

  useEffect(() => {
    console.log("라이브 페이지 들어옴");

    socketConnection((data: MusicData) => {
      console.log("소켓 연결 후 서버에서 데이터 받아옴"); // 데이터 출력
      console.log("Received Data:", data); // 데이터 출력
      setMusicData(data); // 데이터를 상태에 저장합니다.
    });

    // 컴포넌트가 언마운트될 때 웹소켓 연결 종료
    return () => {
      socketManager.disconnect();
    };
  }, []); // 빈 배열을 dependency로 전달하여 한 번만 실행되도록 함

  useEffect(() => {
    console.log(musicData?.data.type);
  }, [musicData]);

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <QueueMusicIcon
          style={{ fontSize: "2.5rem", color: "white", cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {musicData?.data.type === "youtube" && (
        <LiveMusic musicFiles={[musicData.data]} />
      )}
      {musicData?.data.type === "tts" && (
        <Radio ttsFile={musicData.data.path} script={musicData.data.title} />
      )}
      <PlayListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
