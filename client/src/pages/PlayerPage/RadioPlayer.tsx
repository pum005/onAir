import React from "react";
import NavBar from "../../component/Common/Navbar";
import { Radio } from "../../component/PlayerPage/Radio";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

type RadioPlayerProps = {};

export const RadioPlayer = () => {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#000104",
        height: "100vh",
        color: "white",
      }}
    >
      <NavBar />
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <QueueMusicIcon style={{ fontSize: "2.5rem", color: "white" }} />
      </div>
      <Radio />
    </div>
  );
};
