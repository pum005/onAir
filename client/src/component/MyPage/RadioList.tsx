import { useState } from "react";
import PlayListModal from "../Common/PlayListModal";
import ShareModal from "./ShareModal";
import DeleteModal from "./DeleteModal";

function RadioList() {
  /** state */
  const [isPlayListModalOpen, setPlayListModalOpen] = useState<boolean>(false); // 플레이리스트 모달관리 변수
  const [isShareModalOpen, setShareModalOpen] = useState<boolean>(false); //공유 모달관리 변수
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false); //삭제하기 모달관리 변수

  /** Action */
  //플레이리스트 모달 오픈 함수
  const playListModalOpen = () => {
    setPlayListModalOpen(true);
    showAlert();
  };
  //플레이리스트 모달 닫기 함수
  const playListModalClose = () => {
    setPlayListModalOpen(false);
  };

  //공유 모달 오픈 함수
  const shareModalOpen = () => {
    setShareModalOpen(true);
  };

  //공유 모달 닫기 함수
  const shareModalClose = () => {
    setShareModalOpen(false);
  };

  //삭제하기 모달 오픈 함수
  const deleteModalOpen = () => {
    setDeleteModalOpen(true);
  };

  //삭제하기 모달 닫기 함수
  const deleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  /** etc */
  //전체리스트 추가 알람
  const showAlert = () => {
    alert("전체 리스트에 추가되었습니다.");
  };
  return (
    <div>
      <div>대충 라디오 리스트 밑에 쭉</div>
      <button onClick={playListModalOpen}>+</button>{" "}
      <PlayListModal
        isOpen={isPlayListModalOpen}
        onClose={playListModalClose}
      ></PlayListModal>
      <button onClick={shareModalOpen}>공유하기</button>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={shareModalClose}
      ></ShareModal>
      <button onClick={deleteModalOpen}>삭제하기</button>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={deleteModalClose}
      ></DeleteModal>
    </div>
  );
}
export default RadioList;
