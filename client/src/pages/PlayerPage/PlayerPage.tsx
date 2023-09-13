import NavBar from "../../component/Common/Navbar";
import { Radio } from "../../component/PlayerPage/Radio";

type PlayerProps = {};

export const Player = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <Radio />
    </div>
  );
};
// 일단 지금은 여기 안 씀
