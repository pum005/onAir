import React from "react";
import styles from "./PlayListModal.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <hr className={styles.hrStyle} />
        <p>{content}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;
