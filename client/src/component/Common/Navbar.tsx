// 필요한 React 및 Material-UI 컴포넌트를 가져옵니다.
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import RadioIcon from "@mui/icons-material/Radio";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LoginModal from "./LoginModal";

// 내비게이션 및 사용자 메뉴 항목에 대한 정적 데이터
const pages = ["Products", "Pricing"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

// 주요 컴포넌트: ResponsiveAppBar
function ResponsiveAppBar() {
  // 내비게이션 메뉴 및 사용자 메뉴의 앵커 요소를 관리하기 위한 상태
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  // 내비게이션 메뉴를 여는 핸들러
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  // 사용자 메뉴를 여는 핸들러
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // 내비게이션 메뉴를 닫는 핸들러
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // 사용자 메뉴를 닫는 핸들러
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // 로그인 모달을 위한 상태 및 핸들러
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  // 컴포넌트의 JSX
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* 왼쪽 아이콘 및 로고 */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <AdbIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
          </Box>

          {/* 중앙의 내비게이션 버튼들 */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Button onClick={handleCloseNavMenu}>
              <img
                src="images/unlive.png"
                alt="unlive"
                style={{ height: "30px", width: "auto" }}
              />
            </Button>
            <Button component={Link} to="/CreateRadio">
              <RadioIcon style={{ fontSize: 35, color: "white" }} />
            </Button>
          </Box>

          {/* 오른쪽의 사용자 메뉴 및 아바타 */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button>
              <VolumeUpIcon style={{ fontSize: 35, color: "white" }} />
            </Button>
            <Button component={Link} to="/MyPage">
              <AccountCircleIcon style={{ fontSize: 35, color: "white" }} />
            </Button>
            <Button onClick={handleLoginModalOpen}>
              <LoginIcon style={{ fontSize: 35, color: "white" }} />
            </Button>
            <LoginModal
              open={loginModalOpen}
              handleOpen={handleLoginModalOpen}
              handleClose={handleLoginModalClose}
            />
            {/* 사용자 설정을 위한 드롭다운 메뉴 */}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(setting => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
