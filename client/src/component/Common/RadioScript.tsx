import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./RadioScript.module.css";

type RadioScriptsProps = {
  djName: string;
  script: string;
};

export const RadioScripts = ({ djName, script }: RadioScriptsProps) => {
  return (
    <div className={styles.container}>
      <h2>{djName}</h2> {/* djName을 props에서 가져옴 */}
      <hr className={styles.hrStyle} />
      <p>{script}</p> {/* script를 props에서 가져옴 */}
    </div>
  );
};
