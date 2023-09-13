import NavBar from "../../component/Common/Navbar";
import InfoModify from "../../component/MyPage/InfoModify";
import MyPageList from "../../component/MyPage/MyPageList";

export const MyPage = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>마이페이지</h2>
      <InfoModify />
      <p></p>

      <MyPageList />
    </div>
  );
};
