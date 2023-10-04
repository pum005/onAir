import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// const URL = "http://localhost:8081/ws";
const URL = "https://j9b302a.p.ssafy.io/ws";

// 소켓 객체 => 싱글톤 패턴
class SocketManager {
  private static instance: SocketManager;
  private stompClient: Client | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(): Client {
    if (this.stompClient === null) {
      const socket = new SockJS(URL);
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str);
        },
      });
      this.stompClient.activate();
    }
    return this.stompClient;
  }

  disconnect(): void {
    console.log("연결 종료");
    this.stompClient?.deactivate();
    this.stompClient = null; // stompClient 객체 삭제
  }
}

export default SocketManager;
