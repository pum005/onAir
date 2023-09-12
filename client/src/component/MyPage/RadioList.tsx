import { useState } from "react";
import PlayListModal from "../Common/PlayListModal";

function RadioList() {
  /** state */
  const [isPlayListModalOpen, setPlayListModalOpen] = useState<boolean>(false); // 플레이리스트 모달관리 변수

  /** action */
  //플레이리스트 모달 오픈 함수
  const playListModalOpen = () => {
    setPlayListModalOpen(true);
  };
  //플레이리스트 모달 닫기 함수
  const playListModalClose = () => {
    setPlayListModalOpen(false);
  };
  return (
    <div>
      <div>대충 라디오 리스트 밑에 쭉</div>
      <button onClick={playListModalOpen}>+</button>{" "}
      <PlayListModal
        isOpen={isPlayListModalOpen}
        onClose={playListModalClose}
      ></PlayListModal>
    </div>
  );
}
export default RadioList;
