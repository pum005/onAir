import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import MusicBoxModal from "../Common/MusicBoxModal";

function MusicList() {
  /**State*/
  const userData = useSelector((state: RootState) => state.user); //사용자 정보를 Redux store에서 가져옵니다.
  const [isMusicBoxModalOpen, setMusicBoxModalOpen] = useState<boolean>(false); //음악 보관함 모달

  /**Action*/
  const MusicBoxModalOpen = () => {
    setMusicBoxModalOpen(true);
  };
  //플레이리스트 모달 닫기 함수
  const MusicBoxModalClose = () => {
    setMusicBoxModalOpen(false);
  };

  return (
    <div>
      <div>뮤직리스트</div>
      <button onClick={MusicBoxModalOpen}>+</button>
      <MusicBoxModal
        isOpen={isMusicBoxModalOpen}
        onClose={MusicBoxModalClose}
      ></MusicBoxModal>
    </div>
  );
}
export default MusicList;
