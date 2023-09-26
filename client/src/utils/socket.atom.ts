import SocketManager from "./socket";
import { addChatMessage, setMusicInfo } from "../store";
import { useDispatch } from "react-redux";

let socketManager = SocketManager.getInstance();

export type MusicData = {
  type: string;
  operation: string;
  data: {
    type: string;
    typePlayedTime: number;
    path: string;
    startTime: number;
    playedTime: number;
    length: number;
    title: string;
    artist: string;
    image: string;
    script: string;
  };
};

// socket.atom.ts

export const socketConnection = async (
  onDataReceived: (data: MusicData) => void
) => {
  let stompClient = socketManager.connect();

  stompClient.onConnect = () => {
    stompClient.subscribe("/topic", message => {
      let receivedData = JSON.parse(message.body);
      onDataReceived(receivedData);
    });

    stompClient.subscribe("/user/queue", message => {
      let receivedData = JSON.parse(message.body);
      onDataReceived(receivedData);
    });

    stompClient.publish({ destination: "/app/subscribe", body: "" });
  };
};

// 데이터 전송
export const sendData = async (api: string, data: object) => {
  let stompClient = socketManager.connect();
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: api, body: JSON.stringify(data) });
  } else {
    console.error("소켓이 연결되지 않았습니다.");
  }
};
