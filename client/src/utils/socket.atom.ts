import SocketManager from "./socket";

console.log("초기화 됨");

let socketManager = SocketManager.getInstance();

// 웹소켓 연결
export const socketConnection = async () => {
  let stompClient = socketManager.connect();
  console.log("socketConnection 들어오!");

  console.log(stompClient);
  console.log(stompClient.onConnect);

  stompClient.onConnect = () => {
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

  console.log("소켓 연결 끝");
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
