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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Grid container spacing={2}>
        <Button variant="contained" color="primary" onClick={handlePrev}>
          이전
        </Button>
        {DJData.slice(visibleStartIndex, visibleStartIndex + 5).map(
          (DJ, index) => (
            <Grid item key={index} xs={2}>
              <button onClick={() => onSelect(DJ.name)}>
                <img src={DJ.imgSrc} alt={`DJ${DJ.name}`} width="100%" />
              </button>
              <span>{`DJ ${DJ.name}`}</span>
            </Grid>
          )
        )}
        <Button variant="contained" color="primary" onClick={handleNext}>
          다음
        </Button>
      </Grid>
    </Box>
  );
}

export default DJSelector;
