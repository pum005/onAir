import NavBar from "../../component/Common/Navbar";
import InfoModify from "../../component/MyPage/InfoModify";
import MyPageList from "../../component/MyPage/MyPageList";
import BasicTabs from "../../component/MyPage/HMypageList";

export const MyPage = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", minHeight: "100vh", color: "white" }}
    >
      <NavBar />
      <InfoModify />
      <p></p>
      <BasicTabs />
      {/* <MyPageList /> */}
    </div>
  );
};
