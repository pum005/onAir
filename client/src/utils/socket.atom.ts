import SocketManager from "./socket";
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
    seq: number;
    djName: string;
  };
};

export type ChatData = {
  sender: string;
  senderImage: string;
  content: string;
};

export const socketConnection = (
  onDataReceived: (data: MusicData) => void,
  onChatReceived: (data: ChatData) => void,
  onConnected: () => void // 여기에 콜백 추가
) => {
  let stompClient = socketManager.connect();

  stompClient.onConnect = () => {
    onConnected(); // 연결이 성립되면 콜백 호출

    stompClient.subscribe("/topic", message => {
      let receivedData = JSON.parse(message.body);

      if (receivedData.sender && receivedData.content) {
        onChatReceived(receivedData);
      } else {
        onDataReceived(receivedData);
      }
    });

    stompClient.subscribe("/user/queue", message => {
      let receivedData = JSON.parse(message.body);
      onDataReceived(receivedData);
    });

    stompClient.publish({ destination: "/app/subscribe", body: "" });
  };
};

export const sendData = async (api: string, data: object) => {
  let stompClient = socketManager.connect();
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: api, body: JSON.stringify(data) });
  } else {
    console.error("소켓이 연결되지 않았습니다.");
  }
};
