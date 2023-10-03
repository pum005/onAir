import React from "react";
import styles from "../Common/RadioScript.module.css";

type LiveScriptRadioProps = {
  script: string;
  djName: string;
};

export const LiveScriptRadio = ({ script, djName }: LiveScriptRadioProps) => {
  return (
    <div className={styles.container}>
      <h2>{djName}</h2>
      <hr className={styles.hrStyle} />
      <p>{script}</p>
    </div>
  );
};
