import React, { useState } from "react";
// import NavBar from "../../component/Common/Navbar";
import { Radio } from "../../component/PlayerPage/Radio";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PlayListModal from "../../component/Common/PlayListModal";
import Modal from "../../component/PlayerPage/PlayListModal";

type RadioPlayerProps = {};

export const RadioPlayer = () => {
  // 모달의 열림 상태를 관리하는 state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#000104",
        height: "100vh",
        color: "white",
      }}
    >
      {/* <NavBar /> */}
      <div style={{ position: "absolute", top: "120px", right: "100px" }}>
        {/* QueueMusicIcon 클릭 시 모달 열기 */}
      </div>
      {/* <Radio /> */}

      {/* 모달 컴포넌트 추가 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="음악 목록" // 원하는 타이틀로 변경 가능
        content="음악 제목들" // 원하는 내용으로 변경 가능
      />
    </div>
  );
};
