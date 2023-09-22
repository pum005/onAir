// InfoModify.tsx

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import ImgModal from "./ImgModal";
import NickNameModal from "./NicknameModal";
import { setNickName } from "../../store";
import { setImage } from "../../store";
import axios from "axios";

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

  return (
    <div>
      <img
        src={userData.profileImage}
        alt="프로필 이미지"
        onClick={imgModalOpen}
        style={{
          cursor: "pointer",
          width: "180px",
          height: "180px",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <h3 style={{ marginRight: "15px" }}>{userData.nickname}</h3>
        <h5 onClick={nickNameModalOpen} style={{ cursor: "pointer" }}>
          변경
        </h5>
      </div>

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
