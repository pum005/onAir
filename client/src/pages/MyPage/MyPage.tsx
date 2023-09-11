import { useSelector } from "react-redux";
import { RootState } from "../../store";
import NavBar from "../../component/Common/Navbar";

type MyPageProps = {};

export const MyPage = () => {
  // 1. useSelector 훅을 사용하여 Redux 스토어에서 유저 정보를 선택합니다.
  const userData = useSelector((state: RootState) => state.user);

  // 2. 선택한 상태를 콘솔에 출력합니다.
  console.log(userData);

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>마이페이지</h2>
    </div>
  );
};
