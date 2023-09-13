import { useSelector } from "react-redux";
import { RootState } from "../../store";

function MusicList() {
  /**State*/
  const userData = useSelector((state: RootState) => state.user); //사용자 정보를 Redux store에서 가져옵니다.

  return (
    <div>
      <div>뮤직리스트</div>
    </div>
  );
}
export default MusicList;
