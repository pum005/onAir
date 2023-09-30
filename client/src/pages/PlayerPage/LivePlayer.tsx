import NavBar from "../../component/Common/Navbar";
import React, { useEffect, useState } from "react";
import { socketConnection, MusicData } from "../../utils/socket.atom";
import SocketManager from "../../utils/socket";
import { Radio } from "../../component/PlayerPage/LiveRadio";
import { LiveMusic } from "../../component/PlayerPage/LiveMusic";
import ChatIcon from "@mui/icons-material/Chat";
import ChatModal from "../../component/PlayerPage/ChatModal";
import { useDispatch } from "react-redux";
import { addChatMessage } from "../../store";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { LiveListModal } from "../../component/PlayerPage/LiveListModal";

type LivePlayerProps = {};

export const LivePlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicData | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [oncastList, setOncastList] = useState<any[]>([]); // 사연의 순서를 추적하기 위한 상태
  const [storyCount, setStoryCount] = useState<number>(() => {
    // 초기 상태 설정: 로컬 저장소에서 storyCount 읽기
    return Number(localStorage.getItem("storyCount") || 0);
  });
  // 라디오와 음악의 순서를 추적하기 위한 상태
  const [sequenceCount, setSequenceCount] = useState<number>(() => {
    // 초기 상태 설정: 로컬 저장소에서 sequenceCount 읽기
    return Number(localStorage.getItem("sequenceCount") || 0);
  });

  let socketManager = SocketManager.getInstance();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("라이브 페이지 들어옴");

    const fetchOncastList = async () => {
      try {
        const response = await requestWithTokenRefresh(() => {
          return axios.get("http://localhost:8080/api/oncast/livelist", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          });
        });
        setOncastList(response.data.oncast);
        console.log(response.data.oncast);
      } catch (error) {
        console.error("Error fetching oncast data:", error);
      }
    };

    fetchOncastList();

    socketConnection(
      // 첫 번째 콜백: 음악 데이터를 처리합니다.
      (data: MusicData) => {
        console.log("소켓 연결 후 서버에서 데이터 받아옴");
        console.log("Received Data:", data);
        if (data && typeof data === "object" && "data" in data) {
          setMusicData(data);

          // 데이터를 받을 때마다 sequenceCount 증가
          setSequenceCount(prevCount => {
            const newCount = prevCount + 1;

            // sequenceCount가 7이 되면 storyCount 증가 및 sequenceCount 초기화
            if (newCount === 7) {
              setStoryCount(prevStory => prevStory + 1);
              return 0; // sequenceCount 초기화
            }

            return newCount; // 그렇지 않으면 sequenceCount 증가
          });
        } else {
          console.error("Invalid data received:", data);
        }
      },
      // 두 번째 콜백: 채팅 데이터를 처리합니다.
      chatData => {
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
  }, []);

  useEffect(() => {
    // storyCount 상태가 변경될 때마다 로컬 저장소에 저장
    localStorage.setItem("storyCount", String(storyCount));
  }, [storyCount]);

  useEffect(() => {
    // sequenceCount 상태가 변경될 때마다 로컬 저장소에 저장
    localStorage.setItem("sequenceCount", String(sequenceCount));
  }, [sequenceCount]);

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <div style={{ position: "absolute", top: "125px", right: "150px" }}>
        <ChatIcon
          style={{ fontSize: "2.3rem", color: "white", cursor: "pointer" }}
          onClick={() => setIsChatModalOpen(true)}
        />
      </div>
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <FormatListBulletedIcon
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
      {isModalOpen && (
        <LiveListModal
          isOpen={isModalOpen}
          oncastList={oncastList}
          onClose={() => setIsModalOpen(false)}
          currentStory={storyCount} // 현재 재생 중인 사연의 순서를 전달
        />
      )}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};
