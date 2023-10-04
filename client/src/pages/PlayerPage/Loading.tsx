import { Link } from "react-router-dom";
import styles from "./Loading.module.css";

export const Loading = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.loader}>
          <img src={"/gif/loading4.gif"} alt="Loading..." />
        </div>
        <h2 style={{ color: "white" }}>라이브 들어가는 중...</h2>
      </div>
    </div>
  );
};
