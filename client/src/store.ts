import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";

// 1. Action 생성

// 액션 타입 정의 및 액션 생성자 함수 정의
export const setUserData = createAction<{
  nickname: string;
  profileImage: string;
  userId: number;
}>("SET_USER_DATA");

// 2. Reducer 생성

// User를 type으로 정의
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

// 리듀서 정의
const userReducer = createReducer(initialState, builder => {
  builder.addCase(setUserData, (state, action) => {
    state.nickname = action.payload.nickname;
    state.profileImage = action.payload.profileImage;
    state.userId = action.payload.userId;
  });
});

// 3. Store 설정

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
