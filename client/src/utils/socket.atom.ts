import SocketManager from "./socket";

const socketManager = SocketManager.getInstance();
let stompClient = socketManager.connect();

// 웹소켓 연결
export const socketConnection = () => {
  stompClient = socketManager.connect();
  console.log(stompClient);
  stompClient.onConnect = frame => {
    console.log("연결 시작");

    stompClient.subscribe("/topic", message => {
      console.log("전체 요청 들어옴!!!");
      console.log(message.body);
    });

    stompClient.subscribe("/user/queue", message => {
      console.log("나 한테만 요청 들어옴!!!");
      console.log(message.body);
    });

    stompClient.publish({ destination: "/app/subscribe", body: "" });
  };
};

// 데이터 전송
export const sendData = async (api: string, data: object) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({ destination: api, body: JSON.stringify(data) });
  } else {
    console.error("소켓이 연결되지 않았습니다.");
  }
};
