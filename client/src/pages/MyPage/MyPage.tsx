import NavBar from "../../component/Common/Navbar";
import InfoModify from "../../component/MyPage/InfoModify";
// import MyPageList from "../../component/MyPage/MyPageList";
import BasicTabs from "../../component/MyPage/oncastMusicBox";

export const MyPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#000104",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <NavBar /> */}
      <InfoModify />
      <p></p>
      <BasicTabs />
      {/* <MyPageList /> */}
    </div>
  );
};
