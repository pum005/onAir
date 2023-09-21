import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./RadioScript.module.css";

export const RadioScripts = () => {
  // Redux에서 스크립트 데이터를 가져옵니다.
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const currentScript = [
    `script_one`,
    `script_two`,
    `script_three`,
    `script_four`,
  ][radioDummyData.currentTTSIndex];

  return (
    <div className={styles.container}>
      <h2>{radioDummyData.djName}</h2>
      <hr className={styles.hrStyle} />
      <p>{radioDummyData[currentScript]}</p>
    </div>
  );
};
