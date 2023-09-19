import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RadioCard from "./RadioCard";
import RecipeReviewCard from "./RadioCard";
import cardData from "./cardData";
import MusicList from "./MusicCard";
import AddIcon from "@mui/icons-material/Add";
import SearchModal from "../Common/SearchMusicModal";

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
            style={{ fontSize: "larger", font: "bolder" }}
            {...a11yProps(0)}
          />
          <Tab
            label="음악 보관함"
            style={{ fontSize: "larger", font: "bolder" }}
            {...a11yProps(1)}
          />
        </Tabs>
        {/* "+" 아이콘 추가 */}
        {value === 1 && ( // value가 1일 때만 "+" 버튼을 표시합니다.
          <AddIcon
            style={{ marginRight: "18%", cursor: "pointer" }}
            onClick={handleSearchModalOpen}
          />
        )}
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
        <MusicList />
      </CustomTabPanel>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose} // 모달 바깥쪽을 클릭하면 모달을 닫는다.
      />
    </Box>
  );
}
