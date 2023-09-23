import * as React from "react";
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
import LoginAlertModal from "./NoLoginModal";

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  const [loginAlertModalOpen, setLoginAlertModalOpen] = React.useState(false);
  const handleLoginAlertModalOpen = () => setLoginAlertModalOpen(true);
  const handleLoginAlertModalClose = () => setLoginAlertModalOpen(false);

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
      const userProfileImageUrl = "/path/to/user/profile/image.jpg";
      return (
        <Button component={Link} to="/MyPage">
          <img 
            src={userProfileImageUrl} 
            alt="User Profile" 
            style={{ borderRadius: '50%', width: '35px', height: '35px' }} 
          />
        </Button>
      );
    } else {
      return (
        <Button component={Link} to="/MyPage">
          <AccountCircleIcon style={{ fontSize: 35, color: "white" }} />
        </Button>
      );
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
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
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {renderUserIcon()}

              {!isLoggedIn && (
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginAlertModal
        open={loginAlertModalOpen}
        handleClose={handleLoginAlertModalClose}
      />
    </>
  );
}

export default ResponsiveAppBar;
