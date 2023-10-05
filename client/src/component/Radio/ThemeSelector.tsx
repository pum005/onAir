import React from "react";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import styles from "../../pages/HomePage/CreateRadio.module.css";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeSelect,
}) => {
  const themes = [
    { theme: "JOYFUL", description: "#활기찬 #기쁜" },

    {
      theme: "CHILL",
      description: "#여유로운 #휴식",
    },
    {
      theme: "AGGRESSIVE",
      description: "#강렬한 #도전적인",
    },
    {
      theme: "ROMANTIC",
      description: "#사랑스러운 #감미로운",
    },
    {
      theme: "RETRO",
      description: "#과거의 #빈티지 #회상",
    },
    {
      theme: "DRAMATIC",
      description: "#긴장감 #전율",
    },
    {
      theme: "FUNKY",
      description: "#리듬감 #경쾌한",
    },

    {
      theme: "ACOUSTIC",
      description: "#자연스러운 #깔끔한 #악기위주",
    },
    {
      theme: "NOSTALGIC",
      description: "#추억 #그리운",
    },

    {
      theme: "ENERGETIC",
      description: "#에너제틱 #활동적인",
    },
    {
      theme: "MELANCHOLY",
      description: "#서글픈 #우울한",
    },
    {
      theme: "SAD",
      description: "#슬픈 #감정적인",
    },
  ];

  return (
    <div className={styles.themeSelect}>
      {themes.map(({ theme, description }) => (
        <Tooltip title={description} key={theme}>
          <Button
            onClick={() => onThemeSelect(theme)}
            className={`${styles.theme} ${
              theme === selectedTheme ? styles.selectedTheme : ""
            }`}
          >
            {theme}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ThemeSelector;
