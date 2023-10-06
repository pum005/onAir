import NavBar from "../../component/Common/Navbar";
import InfoModify from "../../component/MyPage/InfoModify";
// import MyPageList from "../../component/MyPage/MyPageList";
import { useLocation } from "react-router-dom";
import BasicTabs from "../../component/MyPage/oncastMusicBox";

export const MyPage = () => {
  const location = useLocation();
  const tabValue = location.state?.tabValue || 0;
  console.log(tabValue);

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
      {/* <p></p> */}
      <BasicTabs initialValue={tabValue} />
      {/* <MyPageList /> */}
    </div>
  );
};
