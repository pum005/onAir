import NavBar from "../../component/Common/Navbar";

type MusicPlayerProps = {};

export const MusicPlayer = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>음악 플레이어 페이지</h2>
    </div>
  );
};
