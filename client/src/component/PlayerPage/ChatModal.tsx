import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatModal.module.css";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { sendData, socketConnection } from "../../utils/socket.atom";
import { addChatMessage } from "../../store";
import CloseIcon from "@mui/icons-material/Close";
type ChatMessage = {
  content: string;
  sender: string;
  senderImage: string;
};

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  messages?: ChatMessage[];
};

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch(); // dispatch 함수를 가져옵니다.

  const nickname = useSelector((state: RootState) => state.user.nickname);
  const messages = useSelector((state: RootState) => state.chat);

  console.log(messages);

  const profileImage = useSelector(
    (state: RootState) => state.user.profileImage
  );

  const [message, setMessage] = useState<string>("");

  const clickSubmit = () => {
    if (!message) return;

    sendData("/app/chat", {
      content: message,
      sender: nickname,
      senderImage: profileImage,
    });

    setMessage("");
  };

  const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" }); // 스크롤을 맨 아래로 이동시킵니다.
    }
  }, [messages]);

  return (
    <div className={isOpen ? styles.modal : `${styles.modal} ${styles.closed}`}>
      <CloseIcon className={styles.closeButton} onClick={onClose}></CloseIcon>
      <h2 className={styles.chatHeader}>채팅창</h2>
      <div className={styles.chatMessages}>
        {Array.isArray(messages) &&
          messages.map((msg, index) => {
            const isCurrentUser = msg.sender === nickname;
            return (
              <div
                key={index}
                className={`${styles.chatMessage} ${
                  isCurrentUser ? styles.sent : styles.received
                }`}
              >
                <div className={styles.senderInfo}>
                  {!isCurrentUser && (
                    <img src={msg.senderImage} alt={msg.sender} />
                  )}
                  <span className={styles.username}>{msg.sender}</span>
                  {isCurrentUser && (
                    <img src={msg.senderImage} alt={msg.sender} />
                  )}
                </div>
                <span className={styles.message_content}>{msg.content}</span>
              </div>
            );
          })}
        <div ref={chatMessagesEndRef}></div>
      </div>
      <div className={styles.chatInputContainer}>
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              clickSubmit();
            }
          }}
        />
        <button className={styles.chatButton} onClick={clickSubmit}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
