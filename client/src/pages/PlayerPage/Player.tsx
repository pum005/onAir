import React, { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../component/Common/Navbar";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Radio } from "../../component/PlayerPage/Radio";
import { Music } from "../../component/PlayerPage/Music";

type OncastDataType = {
  ttsOne: string;
  ttsTwo: string;
  ttsThree: string;
  ttsFour: string;
  scriptOne: string;
  scriptTwo: string;
  scriptThree: string;
  scriptFour: string;
  music: any[];
  djName: string;
};

export const Player = (): ReactElement => {
  // 반환 타입을 ReactElement로 설정
  const [oncasts, setOncasts] = useState<OncastDataType | null>(null); // 타입을 명시
  const oncast_id = 7;

  useEffect(() => {
    requestWithTokenRefresh(() => {
      return axios.get(`http://localhost:8080/api/oncast/play/${oncast_id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });
    })
      .then(response => {
        console.log(response.data);
        setOncasts(response.data.oncast);
      })
      .catch(error => {
        console.error("통신에러1 발생", error);
      });
  }, [oncast_id]);

  if (!oncasts) {
    return <div>Loading...</div>;
  }

  const ttsFiles = [
    oncasts.ttsOne,
    oncasts.ttsTwo,
    oncasts.ttsThree,
    oncasts.ttsFour,
    oncasts.djName,
  ];

  const scriptFiles = [
    oncasts.scriptOne,
    oncasts.scriptTwo,
    oncasts.scriptThree,
    oncasts.scriptFour,
  ];

  const musicFiles = oncasts.music;

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      {/* Radio 컴포넌트에 필요한 데이터를 props로 전달합니다. */}
      {/* <Radio
        ttsFiles={ttsFiles}
        scriptFiles={scriptFiles}
        djName={oncasts.djName} // djName을 추가합니다.
      />
      <Music musicFiles={musicFiles} /> */}
    </div>
  );
};
