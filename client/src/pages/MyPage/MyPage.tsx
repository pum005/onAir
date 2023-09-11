import NavBar from "../../component/Common/Navbar";

type MyPageProps = {};

export const MyPage = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>마이페이지</h2>
    </div>
  );
};
