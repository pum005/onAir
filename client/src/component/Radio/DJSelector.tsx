import React, { useState } from "react";
import 여니 from "../../resources/여니.png";
import 영우 from "../../resources/영우.png";
import 흥애 from "../../resources/흥애.png";
import { Button, Grid, Box } from "@mui/material";

type DJSelectorProps = {
  onSelect: (DJ: string) => void;
};

function DJSelector({ onSelect }: DJSelectorProps) {
  const DJData = [
    { name: "여니", imgSrc: 여니 },
    { name: "영우", imgSrc: 영우 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
    { name: "흥애", imgSrc: 흥애 },
  ];

  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const handleNext = () => {
    setVisibleStartIndex((prev) => Math.min(prev + 5, DJData.length - 5));
  };

  const handlePrev = () => {
    setVisibleStartIndex((prev) => Math.max(prev - 5, 0));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2>DJ</h2>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={handlePrev}>이전</button>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {DJData.slice(visibleStartIndex, visibleStartIndex + 5).map(
            (DJ, index) => (
              <div key={index} style={{ margin: "0 10px" }}>
                <button onClick={() => onSelect(DJ.name)}>
                  <img
                    src={DJ.imgSrc}
                    alt={`DJ${DJ.name}`}
                    style={{ height: "10px" }}
                  />
                </button>
                <span>{`DJ ${DJ.name}`}</span>
              </div>
            )
          )}
        </div>
        <button onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}

export default DJSelector;
