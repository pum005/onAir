import NavBar from "../../component/Common/Navbar";
import { Radio } from "../../component/PlayerPage/Radio";

type RadioPlayerProps = {};

export const RadioPlayer = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <Radio />
    </div>
  );
};
