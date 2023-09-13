import NavBar from "../../component/Common/Navbar";
import { Music } from "../../component/PlayerPage/Music";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

type MusicPlayerProps = {};

export const MusicPlayer = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
      // background : 음악 앨범의 표지가 들어갈거임
    >
      <NavBar />
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        <QueueMusicIcon style={{ fontSize: "2.5rem", color: "white" }} />
      </div>
      <Music />
    </div>
  );
};
