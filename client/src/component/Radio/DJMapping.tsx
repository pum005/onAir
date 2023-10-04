// DJMapping.ts
import dj1 from "../../resources/ncs1.gif";
import dj2 from "../../resources/ncs2.gif";
import dj3 from "../../resources/ncs3.gif";
import dj4 from "../../resources/ncs4.gif";
import dj5 from "../../resources/ncs5.gif";
// 추가적인 이미지들도 import 해주세요

export const DJImageMapping: Record<string, string> = {
  아라: dj1,
  이안: dj2,
  고은: dj3,
  규원: dj2,
  기효: dj5,
  나오미: dj3,
  정영화: dj4,
  상도: dj1,
  안나: dj4,
  원탁: dj5,

  // ... (다른 DJ들도 맵핑)
};

export const DJSoundMapping: Record<string, string> = {
  아라: "/preview/아라.mp3",
  이안: "/preview/이안.mp3",
  고은: "/preview/고은.mp3",
  규원: "/preview/규원.mp3",
  기효: "/preview/기효.mp3",
  나오미: "/preview/나오미.mp3",
  정영화: "/preview/정영화.mp3",
  상도: "/preview/상도.mp3",
  안나: "/preview/안나.mp3",
  원탁: "/preview/원탁.mp3",
  // ... (다른 DJ들의 사운드도 맵핑)
};

export const DJNameMapping = {
  vara: "아라",
  nian: "이안",
  ngoeun: "고은",
  nkyuwon: "규원",
  nes_c_kihyo: "기효",
  nnaomi: "나오미",
  nyounghwa: "정영화",
  nsangdo: "상도",
  danna: "안나",
  nwontak: "원탁",
};
