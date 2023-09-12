import { Link } from "react-router-dom";
import NavBar from "../../component/Common/Navbar";

type LoadingrProps = {};

export const Loading = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>로딩창 페이지</h2>
      <Link to="/RadioPlayer">
        <button>라디오 들으러 가기</button>
      </Link>
    </div>
  );
};
