import NavBar from "../../component/Common/Navbar";

type LoadingrProps = {};

export const Loading = () => {
  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      <h2>로딩창 페이지</h2>
    </div>
  );
};
