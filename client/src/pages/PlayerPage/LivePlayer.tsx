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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { LiveListModal } from "../../component/PlayerPage/LiveListModal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Loading } from "./Loading";

type LivePlayerProps = {};

export const LivePlayer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicData, setMusicData] = useState<MusicData | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [oncastList, setOncastList] = useState<any[]>([]); // 사연의 순서를 추적하기 위한 상태
  const [currentSeq, setCurrentSeq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  let socketManager = SocketManager.getInstance();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DJNameMappingReverse: { [key: string]: string } = {
    vara: "아라",
    nian: "이안",
    ngoeun: "고은",
    nkyuwon: "규원",
    nes_c_kihyo: "기효",
    nnaomi: "나오미",
    nyounghwa: "정영화",
    nsangdo: "상도",
    danna: "안나",
    nwontak: "원탁",
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchOncastList = async () => {
      try {
        const response = await requestWithTokenRefresh(() => {
          return axios.get("https://j9b302.p.ssafy.io/api/oncast/livelist", {
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
        setIsLoading(false);
        console.log("소켓 연결 후 서버에서 데이터 받아옴");
        console.log("Received Data:", data);
        if (data && typeof data === "object" && "data" in data) {
          setMusicData(data);
          setCurrentSeq(data.data.seq - 1); // seq 값을 저장

          // operation 값이 'END'일 때 경고창 띄우기
          if (data.operation === "END") {
            Swal.fire({
              icon: "error",
              title: "라이브가 마쳤습니다!",
              text: "내일 오전 11시에 만나요!",
              confirmButtonColor: "6966FF",
              confirmButtonText: "확인",
              customClass: {
                popup: "my-popup-class",
              },
            }).then(result => {
              if (result.isConfirmed) {
                navigate("/"); // 홈페이지로 이동
              }
            });
          } else if (data.data.seq == 10 && data.operation === "IDLE") {
            Swal.fire({
              icon: "info",
              title: "라이브가 종료되었습니다!",
              confirmButtonColor: "6966FF",
              confirmButtonText: "확인",
              customClass: {
                popup: "my-popup-class",
              },
            }).then(result => {
              if (result.isConfirmed) {
                navigate("/"); // 홈페이지로 이동
              }
            });
          } else if (data.operation === "BEFORE") {
            Swal.fire({
              icon: "error",
              title: "라이브 시작 전입니다!",
              confirmButtonColor: "6966FF",
              confirmButtonText: "확인",
              customClass: {
                popup: "my-popup-class",
              },
            }).then(result => {
              if (result.isConfirmed) {
                navigate("/"); // 홈페이지로 이동
              }
            });
          }
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
      },
      () => {}
    );

    // 컴포넌트가 언마운트될 때 웹소켓 연결 종료
    return () => {
      socketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 84);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{
            backgroundColor: "#000104",
            height: "100vh",
            color: "white",
          }}
        >
          {/* <NavBar /> */}
          <div style={{ position: "absolute", top: "104px", right: "80px" }}>
            <ChatIcon
              style={{ fontSize: "40px", color: "white", cursor: "pointer" }}
              onClick={() => setIsChatModalOpen(true)}
            />
          </div>
          <div style={{ position: "absolute", top: "100px", right: "20px" }}>
            <FormatListBulletedIcon
              style={{ fontSize: "40px", color: "white", cursor: "pointer" }}
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
              djName={
                DJNameMappingReverse[musicData.data.djName] ||
                musicData.data.djName
              }
            />
          )}
          {isModalOpen && (
            <LiveListModal
              isOpen={isModalOpen}
              oncastList={oncastList}
              currentSeq={currentSeq}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          <ChatModal
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};
