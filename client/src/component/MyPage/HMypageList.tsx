import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RadioCard from "./RadioCard";
import RecipeReviewCard from "./RadioCard";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const cardData = [
  {
    title: "9월 5일(화) 14:27",
    subheader: "비 오는 날이 싫어요",
    image: "/images/lp.png",
    feeling: "JOYFULL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "놀러가기 좋은 날!",
    image: "/images/lp.png",
    feeling: "CHILL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "특화 얼른 마쳤으면",
    image: "/images/lp.png",
    feeling: "JOYFULL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "겁나 놀아야지",
    image: "/images/lp.png",
    feeling: "CHILL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "올해 안에 취업 성공 가보자",
    image: "/images/lp.png",
    feeling: "JOYFULL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "역시 우리팀 2ㅣ존",
    image: "/images/lp.png",
    feeling: "CHILL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "아오 용재시치",
    image: "/images/lp.png",
    feeling: "JOYFULL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
  {
    title: "9월 5일(화) 14:27",
    subheader: "배고프다",
    image: "/images/lp.png",
    feeling: "CHILL",
    songs: [
      {
        songTitle: "사라지나요",
        artist: "PATEKO",
        duration: "3:25",
        albumCover: "./images/사라지나요.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "결을",
        artist: "Cloudybay",
        duration: "4:05",
        albumCover: "./images/결을.jpg", // 더미 이미지 경로
      },
      {
        songTitle: "Someday",
        artist: "리쌍 Feat.윤도현",
        duration: "4:05",
        albumCover: "./images/someday.jpg", // 더미 이미지 경로
      },
    ],
  },
];

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            paddingLeft: "70px",
            ".Mui-selected": {
              // 활성 Tab 스타일
              color: "#000",
              borderBottom: "2px solid blue",
            },
            ".MuiTab-root": {
              // 비활성 Tab 스타일 및 간격 설정
              color: "#888",
              marginRight: "20px",
            },
          }}
        >
          <Tab
            label="라디오"
            style={{ fontSize: "large", font: "bolder" }}
            {...a11yProps(0)}
          />
          <Tab
            label="음악 보관함"
            style={{ fontSize: "large", font: "bolder" }}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflowY: "auto",
            maxHeight: "500px",
          }}
        >
          {cardData.map((data, idx) => (
            <div
              key={idx}
              style={{ margin: "10px", width: "calc(25% - 20px)" }}
            >
              <RecipeReviewCard {...data} />
            </div>
          ))}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
    </Box>
  );
}
