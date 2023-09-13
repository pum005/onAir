type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

const styles: {
  overlay: React.CSSProperties;
  modal: React.CSSProperties;
} = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default Modal;
