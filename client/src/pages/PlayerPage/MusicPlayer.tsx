import NavBar from "../../component/Common/Navbar";
import { Music } from "../../component/PlayerPage/Music";

type MusicPlayerProps = {};

export const MusicPlayer = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <Music />
    </div>
  );
};
