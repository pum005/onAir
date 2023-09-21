// 필요한 React 및 Material-UI 컴포넌트를 가져옵니다.
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import RadioIcon from "@mui/icons-material/Radio";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LoginModal from "./LoginModal";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginAlertModal from "./NoLoginModal";
import LogoutAlertModal from "./LogoutModal";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

// 내비게이션 및 사용자 메뉴 항목에 대한 정적 데이터
const pages = ["Products", "Pricing"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

// 주요 컴포넌트: ResponsiveAppBar
function ResponsiveAppBar() {
  const navigate = useNavigate();
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

  // 로그인 알림 모달 상태 및 핸들러
  const [loginAlertModalOpen, setLoginAlertModalOpen] = React.useState(false);
  const handleLoginAlertModalOpen = () => setLoginAlertModalOpen(true);
  const handleLoginAlertModalClose = () => setLoginAlertModalOpen(false);

  const [logoutAlertOpen, setLogoutAlertOpen] = React.useState(false);
  const handleLogoutAlertOpen = () => setLogoutAlertOpen(true);
  const handleLogoutAlertClose = () => setLogoutAlertOpen(false);

  const handleConfirmLogout = () => {
    const token = localStorage.getItem("accessToken");

    axios
      .post(
        "http://localhost:8080/api/oauth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLogoutAlertOpen(false);
        navigate("/");
      })
      .catch((error) => {
        // 로그아웃 실패 시 에러 처리
        console.error("로그아웃 실패:", error);
      });
  };

  // 로그인이 필요한 기능을 사용하려고 할 때의 핸들러
  const handleProtectedFeatureClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!isLoggedIn) {
      event.preventDefault(); // 기본 동작 중지
      handleLoginAlertModalOpen();
    }
  };

  const handleImageClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isLoggedIn) {
      event.preventDefault();
      handleLoginAlertModalOpen();
      return;
    }

    Swal.fire({
      title: "라이브에 참여하시겠습니까?",
      text: "흥앵홍?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/LivePlayer"); // 사용자가 승인을 선택하면 페이지 이동
      } else {
        navigate("/");
      }
    });
  };

  // 로그인 여부를 확인
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  // 컴포넌트의 JSX
  return (
    <>
      <AppBar
        position="static"
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* 왼쪽 아이콘 및 로고 */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
              component={Link}
              to="/"
            >
              <AdbIcon sx={{ mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                LOGO
              </Typography>
            </Box>

            {/* 중앙의 내비게이션 버튼들 */}
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <Button onClick={handleImageClick}>
                <img
                  src="images/unlive.png"
                  alt="unlive"
                  style={{ height: "30px", width: "auto" }}
                />
              </Button>
              <Button
                component={Link}
                to="/CreateRadio"
                onClick={(event) => handleProtectedFeatureClick(event)} // 여기를 수정
              >
                <RadioIcon style={{ fontSize: 35, color: "white" }} />
              </Button>
            </Box>

            {/* 오른쪽의 사용자 메뉴 및 아바타 */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button>
                <VolumeUpIcon style={{ fontSize: 35, color: "white" }} />
              </Button>
              <Button
                component={Link}
                to="/MyPage"
                onClick={(event) => handleProtectedFeatureClick(event)} // 여기를 수정
              >
                <AccountCircleIcon style={{ fontSize: 35, color: "white" }} />
              </Button>

              {isLoggedIn ? (
                <Button onClick={handleLogoutAlertOpen}>
                  {" "}
                  <LogoutIcon style={{ fontSize: 35, color: "white" }} />
                </Button>
              ) : (
                <>
                  <Button onClick={handleLoginModalOpen}>
                    <LoginIcon style={{ fontSize: 35, color: "white" }} />
                  </Button>
                  <LoginModal
                    open={loginModalOpen}
                    handleOpen={handleLoginModalOpen}
                    handleClose={handleLoginModalClose}
                  />
                </>
              )}
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
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginAlertModal
        open={loginAlertModalOpen}
        handleClose={handleLoginAlertModalClose}
      />
      <LogoutAlertModal
        open={logoutAlertOpen}
        handleClose={handleLogoutAlertClose}
        handleConfirmLogout={handleConfirmLogout}
      />
    </>
  );
}
export default ResponsiveAppBar;
