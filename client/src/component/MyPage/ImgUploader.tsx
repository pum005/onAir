// ImgUploader.tsx

import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import ImgModal from "./ImgModal";
import { setUserData } from "../../store"; // setUserData 액션을 import

function ImgUploader() {
  const userData = useSelector((state: RootState) => state.user);
  const [userImage, setUserImage] = useState<null | FileList>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch(); // useDispatch를 사용하여 액션 디스패치 가능

  const imgUploadInput = useRef<HTMLInputElement>(null);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log("사진 변경");
      setUserImage(event.target.files);
    }
  };

  const onImageRemove = (): void => {
    setUserImage(null);
  };

  const handleUploadButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageConfirm = () => {
    if (userImage) {
      // userImage가 존재할 때만 실행
      const newProfileImage = URL.createObjectURL(userImage[0]);
      // 프로필 이미지 변경을 위해 setUserData 액션을 디스패치
      dispatch(
        setUserData({
          nickname: userData.nickname,
          profileImage: newProfileImage,
          userId: userData.userId,
        })
      );
      closeModal(); // 모달 닫기
    }
  };

  return (
    <div>
      <img
        src={userData.profileImage}
        alt="프로필 이미지"
        onClick={handleUploadButtonClick}
        style={{ cursor: "pointer" }}
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={imgUploadInput}
        onChange={onImageChange}
      />

      <ImgModal
        isOpen={isModalOpen}
        onClose={closeModal}
        profileImage={userData.profileImage}
        userImage={userImage}
        onImageChange={onImageChange}
        onImageRemove={onImageRemove}
        onImageConfirm={handleImageConfirm} // 이미지 확인 버튼 핸들러 추가
      />
    </div>
  );
}

export default ImgUploader;
