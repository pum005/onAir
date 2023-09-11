import NavBar from "../../component/Common/Navbar";

type CreateRadioProps = {};

export const CreateRadio = () => {
  return (
    // 스타일 속성을 추가하여 배경색을 설정합니다.
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>라디오 만드는 페이지</h2>
    </div>
  );
};
