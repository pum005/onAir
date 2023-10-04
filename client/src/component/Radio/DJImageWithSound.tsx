// DJImageWithSound.tsx
import React, { useState } from "react";
import { DJImageMapping, DJSoundMapping } from "./DJMapping";

type DJImageWithSoundProps = {
  DJName: string;
};
// const [selectedDJ, setSelectedDJ] = useState<boolean | null>(null);

export const DJImageWithSound: React.FC<DJImageWithSoundProps> = ({
  DJName,
}) => {
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const handlePlaySound = () => {
    const soundSrc = DJSoundMapping[DJName];
    if (selectedDJ === DJName) {
      setSelectedDJ(null); // DJ를 선택 해제
    } else {
      setSelectedDJ(DJName); // 새 DJ를 선택
      const audio = new Audio(soundSrc);
      audio.play(); // 선택한 DJ의 소리만 재생
    }
  };

  return (
    <img
      src={DJImageMapping[DJName]}
      alt={DJName}
      onClick={handlePlaySound}
      style={{
        cursor: "pointer",
        width: "100px",
        height: "100px",
        borderRadius: "100px",
        border: selectedDJ === DJName ? "2px solid red" : "2px solid black",
      }} // 마우스를 올렸을 때 클릭 가능한 것처럼 보이게 합니다.
    />
  );
};
