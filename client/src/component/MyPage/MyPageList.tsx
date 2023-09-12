import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import RadioList from "./RadioList";
import MusicList from "./MusicList";

function MyPageList() {
  const userData = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState("radio"); // 현재 선택된 탭 상태를 관리

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleTabChange("radio")}>라디오</button>
        <button onClick={() => handleTabChange("musicList")}>
          음악 보관함
        </button>
      </div>
      <div>
        {activeTab === "radio" && <RadioList />}
        {activeTab === "musicList" && <MusicList />}
      </div>
    </div>
  );
}

export default MyPageList;
