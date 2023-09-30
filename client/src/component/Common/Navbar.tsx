import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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

function NavBar() {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  const [loginAlertModalOpen, setLoginAlertModalOpen] = React.useState(false);
  const handleLoginAlertModalOpen = () => setLoginAlertModalOpen(true);
  const handleLoginAlertModalClose = () => setLoginAlertModalOpen(false);

  const handleLogoutModalOpen = () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6966FF",
      cancelButtonColor: "#DA0037",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      reverseButtons: true,
      customClass: {
        // popup: "colored-toast",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmLogout(); // 사용자가 '승인'을 클릭하면 로그아웃 처리합니다.
      }
    });
  };

  const userData = useSelector((state: RootState) => state.user); // 사용자 정보를 Redux store에서 가져옵니다.
  const [userImage, setUserImage] = useState<null | FileList>(null); // 사용자가 업로드한 이미지

  const displayNickname =
    userData.nickname.length > 6
      ? userData.nickname.substring(0, 6) + "..."
      : userData.nickname;
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
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6966FF",
      cancelButtonColor: "#DA0037",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      reverseButtons: true,
      customClass: {
        popup: "my-popup-class",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/LivePlayer");
      } else {
        navigate("/");
      }
    });
  };

  const handleConfirmLogout = () => {
    requestWithTokenRefresh(() => {
      return axios.post(
        "http://localhost:8080/api/oauth/social/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then((response) => {
        console.log(response);
        if (response.data.logoutUrl) {
          window.location.href = response.data.logoutUrl;
        } else if (response.data.naver) {
          window.location.href = "http://localhost:3000"; // 메인 페이지로 리다이렉트
        }
        localStorage.removeItem("accessToken"); // 액세스 토큰 제거
        for (let key in localStorage) {
          if (key.startsWith("persist:")) {
            localStorage.removeItem(key);
          }
        }
      })
      .catch((error) => {
        console.log("통신에러발생", error);
      });
  };

  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  const renderUserIcon = () => {
    if (isLoggedIn) {
      return (
        <div className={style.userNickName}>
          <Link to="/MyPage">
            <Button>
              <img
                src={userData.profileImage}
                alt="User Profile"
                style={{ borderRadius: "50%", width: "35px", height: "35px" }}
                className={style.userProfileImagerIcon}
              />
            </Button>
          </Link>

          <h4 style={{ width: "135px", userSelect: "none" }}>
            환영합니다,
            <br />
            {displayNickname}님!
          </h4>
          <Button onClick={handleLogoutModalOpen}>
            <Typography variant="body1" style={{ color: "white" }}>
              로그아웃
            </Typography>
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button onClick={handleMyPageClick}>
            <Link
              to="#"
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "145px",
              }}
            >
              <AccountCircleIcon
                style={{
                  marginTop: "17px",
                  marginBottom: "17px",
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
                flexGrow: 1,
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
                display: "flex",

                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button onClick={handleImageClick}>
                <img
                  src="images/unlive.png"
                  alt="unlive"
                  className={style.liveImage}
                />
              </Button>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
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
