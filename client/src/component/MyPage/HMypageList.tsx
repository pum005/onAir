import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RecipeReviewCard from "./RadioCard";
import MusicCard from "./MusicCard";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import SearchIcon from "@mui/icons-material/Search";
import SearchModal from "../Common/SearchMusicModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
type OncastType = {
  oncastId: number;
  createTime: string;
  title: string;
  shareCheck: boolean;
  selectCheck: boolean;
  musicList: {
    musicId: number;
    albumCoverUrl: string;
    title: string;
    artist: string;
    duration: number;
  }[];
}[];

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
        <Box sx={{ p: 0 }}>
          <Typography component="div">{children}</Typography>
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

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [oncasts, setOncasts] = React.useState<OncastType>([]);
  const [message, setMessage] = React.useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = React.useState(false);

  const [refreshKey, setRefreshKey] = React.useState(false);

  const refresh = () => {
    setRefreshKey((prevKey) => !prevKey);
  };

  //라디오 list axios
  React.useEffect(() => {
    requestWithTokenRefresh(() => {
      return axios.get("http://localhost:8080/api/oncast", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });
    })
      .then((response) => {
        if (response.data.message) {
          setMessage(response.data.message);
        } else {
          setOncasts(response.data.oncasts);
        }
      })
      .catch((error) => {
        console.error("통신에러 발생", error);
      });
  }, [refreshKey]);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false); // 모달의 열림/닫힘 상태를 관리하는 상태 변수

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex", // flexbox 레이아웃 설정
          justifyContent: "space-between", // 컨텐츠 사이의 공간을 균등하게 분배
          alignItems: "center", // 컨텐츠를 세로 중앙 정렬
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            paddingLeft: "220px",
            ".Mui-selected": {
              // 활성 Tab 스타일
              color: "#000",
              fontWeight: "bold", // 굵은 글씨체 효과 추가
              backgroundColor: "#646464",
              borderTopLeftRadius: "15px", // 상단 왼쪽 둥글게
              borderTopRightRadius: "15px", // 상단 오른쪽 둥글게
              margin: "0 10px", // 좌우 여백 추가
            },
            ".MuiTab-root": {
              // 비활성 Tab 스타일 및 간격 설정
              color: "#888",
              marginRight: "20px",
            },
          }}
        >
          <Tab
            label="온캐스트"
            style={{ fontSize: "larger", font: "bolder", color: "white" }}
            {...a11yProps(0)}
          />
          <Tab
            label="음악 보관함"
            style={{ fontSize: "larger", font: "bolder", color: "white" }}
            {...a11yProps(1)}
          />
        </Tabs>
        {/* "+" 아이콘 추가 */}
        {value === 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "15%",
              cursor: "pointer",
            }}
            onClick={handleSearchModalOpen}
          >
            <SearchIcon />
            <Typography style={{ marginLeft: "5px" }}>음악검색</Typography>
          </div>
        )}
      </Box>
      <CustomTabPanel value={value} index={0}>
        {message ? (
          <div>생성된 라디오가 없습니다.</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              overflowY: "auto",
              maxHeight: "500px",
            }}
          >
            {oncasts.map((data, idx) => (
              <div
                key={idx}
                style={{ margin: "10px", width: "calc(25% - 20px)" }}
              >
                <RecipeReviewCard
                  oncastId={data.oncastId}
                  title={data.createTime}
                  subheader={data.title}
                  shareCheck={data.shareCheck}
                  selectCheck={data.selectCheck}
                  refreshkey={refresh}
                  songs={data.musicList.map((song) => ({
                    musicId: song.musicId,
                    songTitle: song.title,
                    artist: song.artist,
                    duration: new Date(song.duration)
                      .toISOString()
                      .substr(14, 5),
                    albumCover: song.albumCoverUrl,
                  }))}
                />
              </div>
            ))}
          </div>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MusicCard refreshFlag={refreshFlag} />
      </CustomTabPanel>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => {
          handleSearchModalClose();
          setRefreshFlag((prev) => !prev);
        }}
      />
    </Box>
  );
}
