// InfoModify.tsx

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import ImgModal from "./ImgModal";
import NickNameModal from "./NicknameModal";
import { setNickName } from "../../store";
import { setImage } from "../../store";
import axios from "axios";
import styles from "./InfoModify.module.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";

function InfoModify() {
  const userData = useSelector((state: RootState) => state.user); // 사용자 정보를 Redux store에서 가져옵니다.
  const [userImage, setUserImage] = useState<null | FileList>(null); // 사용자가 업로드한 이미지
  const [isImgModalOpen, setImgModalOpen] = useState<boolean>(false); // 이미지 모달관리 변수
  const [isNickNameModalOpen, setNickNameModalOpen] = useState<boolean>(false); // 닉네임 모달관리 변수
  const dispatch = useDispatch(); // useDispatch를 사용하여 Redux store를 업데이트합니다.

  // 이미지 변경 함수
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUserImage(event.target.files);
    }
  };

  // 이미지 제거 함수
  const onImageRemove = (): void => {
    setUserImage(null);
  };

  // 이미지 모달 열기 함수
  const imgModalOpen = () => {
    setImgModalOpen(true);
  };

  // 이미지 모달 닫기 함수
  const imgModalClose = () => {
    setImgModalOpen(false);
  };

  // 닉네임 변경 모달 열기 함수
  const nickNameModalOpen = () => {
    setNickNameModalOpen(true);
  };

  // 닉네임 변경 모달 닫기 함수
  const nickNameModalClose = () => {
    setNickNameModalOpen(false);
  };

  // 이미지 변경 후 확인 함수
  const handleImageConfirm = () => {
    if (userImage) {
      // userImage가 존재할 때만 실행
      const newProfileImage = URL.createObjectURL(userImage[0]);
      // 프로필 이미지 변경을 위해 setUserData 액션을 디스패치합니다.
      dispatch(
        setImage({
          profileImage: newProfileImage,
        })
      );
      imgModalClose(); // 모달을 닫습니다.
    }
  };

  // 닉네임 업데이트 함수
  const handleUpdateNickName = (newNickName: string) => {
    if (newNickName) {
      dispatch(
        setNickName({
          nickname: newNickName,
        })
      );
      nickNameModalClose(); // 모달을 닫습니다.
    }
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

  return (
    <div className={styles.infoContainer}>
      <img
        src={userData.profileImage}
        alt="프로필 이미지"
        onClick={imgModalOpen}
        className={styles.profileImage}
      />
      <div className={styles.nicknameWrapper}>
        <div className={styles.nickname}>{userData.nickname}</div>
        <h5 onClick={nickNameModalOpen} className={styles.changeNickname}>
          변경
        </h5>
      </div>
      <Button onClick={handleLogoutModalOpen}>
        <Typography variant="body1" style={{ color: "white" }}>
          로그아웃
        </Typography>
      </Button>

      {/* 닉네임 변경 버튼 클릭 시 모달 열기 */}
      <ImgModal
        isOpen={isImgModalOpen}
        onClose={imgModalClose}
        profileImage={userData.profileImage}
        userImage={userImage}
        onImageConfirm={handleImageConfirm}
        onImageChange={onImageChange}
        onImageRemove={onImageRemove}
      />
      <NickNameModal
        isOpen={isNickNameModalOpen}
        onClose={nickNameModalClose}
        currentNickName={userData.nickname}
        onUpdateNickName={handleUpdateNickName}
      />
    </div>
  );
}

export default InfoModify;
