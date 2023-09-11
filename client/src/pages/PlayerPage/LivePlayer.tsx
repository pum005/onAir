import NavBar from "../../component/Common/Navbar";

type LivePlayerProps = {};

export const LivePlayer = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>라이브 라디오 페이지</h2>
    </div>
  );
};
