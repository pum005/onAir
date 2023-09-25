import React from "react";
import styles from "../Common/RadioScript.module.css";

type LiveScriptRadioProps = {
  script: string;
};

export const LiveScriptRadio = ({ script }: LiveScriptRadioProps) => {
  return (
    <div className={styles.container}>
      <hr className={styles.hrStyle} />
      <p>{script}</p>
    </div>
  );
};
