import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";
import LogoutAlertModal from "./LogoutModal";
import LoginIcon from "@mui/icons-material/Login";
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import { Link, redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import LoginAlertModal from "./NoLoginModal";
import style from "./Navbar.module.css";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  const [loginAlertModalOpen, setLoginAlertModalOpen] = React.useState(false);
  const handleLoginAlertModalOpen = () => setLoginAlertModalOpen(true);
  const handleLoginAlertModalClose = () => setLoginAlertModalOpen(false);

  const userData = useSelector((state: RootState) => state.user); // 사용자 정보를 Redux store에서 가져옵니다.
  const [userImage, setUserImage] = useState<null | FileList>(null); // 사용자가 업로드한 이미지

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); //햄버거 버튼 상태 관리

  //메뉴 버튼 클릭
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //햄버거 버튼 닫기
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const displayNickname =
    userData.nickname.length > 6
      ? userData.nickname.substring(0, 6) + "..."
      : userData.nickname;
  const handleImageClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isLoggedIn) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        title: "로그인 후 이용 가능합니다!",
        confirmButtonColor: "6966FF",
        confirmButtonText: "확인",
        customClass: {
          popup: "my-popup-class",
        },
      }).then(result => {
        if (result.isConfirmed) {
          handleLoginModalOpen();
        }
      });
      // handleLoginAlertModalOpen();
      return;
    }

    Swal.fire({
      title: "라이브에 참여하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#DA0037",
      confirmButtonColor: "#6966FF",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      customClass: {
        popup: "my-popup-class",
      },
    }).then(result => {
      if (result.isConfirmed) {
        navigate("/LivePlayer");
      } else {
        navigate("/");
      }
    });
  };

  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6966FF",
      cancelButtonColor: "#DA0037",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      customClass: {
        // popup: "colored-toast",
      },
    }).then(result => {
      if (result.isConfirmed) {
        handleConfirmLogout(); // 사용자가 '승인'을 클릭하면 로그아웃 처리합니다.
      }
    });
  };

  const handleConfirmLogout = () => {
    requestWithTokenRefresh(() => {
      return axios.post(
        // "https://j9b302.p.ssafy.io/api/oauth/social/logout",
        "https://j9b302.p.ssafy.io/api/oauth/social/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then(response => {
        console.log(response);
        if (response.data.logoutUrl) {
          window.location.href = response.data.logoutUrl;
        } else if (response.data.naver) {
          window.location.href = "https://j9b302.p.ssafy.io"; // 메인 페이지로 리다이렉트
        }
        localStorage.removeItem("accessToken"); // 액세스 토큰 제거
        localStorage.removeItem("firstVisit");
        localStorage.removeItem("isVisible");
        localStorage.removeItem("displayIcon");
        for (let key in localStorage) {
          if (key.startsWith("persist:")) {
            localStorage.removeItem(key);
          }
        }
      })
      .catch(error => {
        console.log("통신에러발생", error);
      });
  };

  const renderUserIcon = () => {
    if (isLoggedIn) {
      return (
        <div className={style.userNickName}>
          <Button onClick={handleMenuClick}>
            <img
              src={userData.profileImage}
              alt="User Profile"
              style={{ borderRadius: "50%", width: "35px", height: "35px" }}
              className={style.userProfileImagerIcon}
            />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                navigate("/MyPage", { state: { tabValue: 0 } });
                handleMenuClose();
              }}
            >
              온캐스트
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/MyPage", { state: { tabValue: 1 } });
                handleMenuClose();
              }}
            >
              음악 보관함
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
            >
              로그아웃
            </MenuItem>
          </Menu>
          <h4 className={style.welcome}>
            환영합니다,
            <br />
            {displayNickname}님!
          </h4>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "50px",
            marginLeft: "70px",
          }}
        >
          <Button onClick={handleMyPageClick}>
            <Link to="#">
              <LoginIcon
                style={{
                  marginTop: "14px",
                  marginBottom: "14px",
                  fontSize: 35,
                  color: "white",
                }}
              />
            </Link>
          </Button>
        </div>
      );
    }
  };

  const handleMyPageClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isLoggedIn) {
      event.preventDefault(); // 기본 링크 이동을 막습니다.
      handleLoginModalOpen(); // 로그인 모달을 띄웁니다.
    }
  };

  return (
    <>
      <AppBar
        className={style.centerAppBar} // 이 부분을 추가합니다.
        position="static"
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters className={style.selectNone}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Link to="/">
                <img
                  src="/onAIr.png"
                  alt="On Air Logo"
                  className={style.logoImage}
                />
              </Link>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button onClick={handleImageClick}>
                <img
                  src="images/LiveLogo.png"
                  alt="unlive"
                  className={style.liveImage}
                />
              </Button>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {renderUserIcon()}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginAlertModal
        open={loginAlertModalOpen}
        handleClose={handleLoginAlertModalClose}
      />
      <LoginModal
        open={loginModalOpen}
        handleClose={handleLoginModalClose}
      ></LoginModal>
    </>
  );
}

export default NavBar;
