// import NavBar from "../../component/Common/Navbar";
import PlayListModal from "../../component/PlayerPage/PlayListModal";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import React, { useEffect, useState } from "react";
import { socketConnection, MusicData } from "../../utils/socket.atom";
import SocketManager from "../../utils/socket";
import { Radio } from "../../component/PlayerPage/LiveRadio";
import { LiveMusic } from "../../component/PlayerPage/LiveMusic";
import ChatIcon from "@mui/icons-material/Chat";
import ChatModal from "../../component/PlayerPage/ChatModal";
import { useDispatch } from "react-redux";
import { addChatMessage } from "../../store";

type LivePlayerProps = {};

export const LivePlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicData | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // 채팅 모달의 상태

  let socketManager = SocketManager.getInstance();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("라이브 페이지 들어옴");

    socketConnection(
      // 첫 번째 콜백: 음악 데이터를 처리합니다.
      (data: MusicData) => {
        console.log("소켓 연결 후 서버에서 데이터 받아옴");
        console.log("Received Data:", data);
        if (data && typeof data === "object" && "data" in data) {
          setMusicData(data);
        } else {
          console.error("Invalid data received:", data);
        }
      },
      // 두 번째 콜백: 채팅 데이터를 처리합니다.
      (chatData) => {
        dispatch(
          addChatMessage({
            content: chatData.content,
            sender: chatData.sender,
            senderImage: chatData.senderImage || "",
          })
        );
      }
    );

    // 컴포넌트가 언마운트될 때 웹소켓 연결 종료
    return () => {
      socketManager.disconnect();
    };
  }, []); // 빈 배열을 dependency로 전달하여 한 번만 실행되도록 함

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      {/* <NavBar /> */}
      <div style={{ position: "absolute", top: "125px", right: "150px" }}>
        <ChatIcon
          style={{ fontSize: "2.3rem", color: "white", cursor: "pointer" }}
          onClick={() => setIsChatModalOpen(true)}
        />
      </div>
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <QueueMusicIcon
          style={{ fontSize: "2.5rem", color: "white", cursor: "pointer" }}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      {musicData?.data.type === "youtube" && (
        <LiveMusic
          musicFiles={[musicData.data]}
          playedTime={musicData.data.playedTime / 1000}
        />
      )}
      {musicData?.data.type === "tts" && (
        <Radio
          ttsFile={musicData.data.path}
          script={musicData.data.script}
          playedTime={musicData.data.playedTime}
        />
      )}
      <PlayListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};
