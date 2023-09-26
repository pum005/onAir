import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginModal from "./LoginModal";
import LoginIcon from "@mui/icons-material/Login";
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import LoginAlertModal from "./NoLoginModal";
import style from "./Navbar.module.css";

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
        navigate("/LivePlayer");
      } else {
        navigate("/");
      }
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
          <h4 style={{ width: "135px" }}>
            환영합니다,
            <br />
            {displayNickname}님!
          </h4>
        </div>
      );
    } else {
      return (
        <Button onClick={handleMyPageClick}>
          <Link
            to={isLoggedIn ? "/MyPage" : "#"}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <AccountCircleIcon style={{ fontSize: 35, color: "white" }} />
          </Link>
        </Button>
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
          <Toolbar disableGutters>
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
