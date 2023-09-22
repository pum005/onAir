import { createReducer, createAction } from "@reduxjs/toolkit";

export const setNickName = createAction<{
  nickname: string;
}>("SET_NICKNAME");

export const setImage = createAction<{
  profileImage: string;
}>("SET_IMAGE");

export const setUserData = createAction<{
  nickname: string;
  profileImage: string;
  userId: number;
}>("SET_USER_DATA");

export type User = {
  nickname: string;
  profileImage: string;
  userId: number;
};

const initialState: User = {
  nickname: "",
  profileImage: "",
  userId: 0,
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setNickName, (state, action) => {
    state.nickname = action.payload.nickname;
  });
  builder.addCase(setImage, (state, action) => {
    state.profileImage = action.payload.profileImage;
  });
  builder.addCase(setUserData, (state, action) => {
    state.nickname = action.payload.nickname;
    state.profileImage = action.payload.profileImage;
    state.userId = action.payload.userId;
  });
});

export default userReducer;
