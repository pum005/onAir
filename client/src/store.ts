import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";

// 1. Action 생성

// 액션 타입 및 페이로드를 정의하고, 액션 생성자 함수를 만듭니다.
// 이 액션은 사용자 데이터를 설정하기 위한 것입니다.
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

export const setRadioDummyData = createAction<{
  tts_one: string;
  tts_two: string;
  tts_three: string;
  tts_four: string;
  script_one: string;
  script_two: string;
  script_three: string;
  script_four: string;
  oncast_music_one: string;
  oncast_music_two: string;
  oncast_music_three: string;
  djName: string;
}>("SET_RADIO_DUMMY_DATA");

export const setMusicInfo = createAction<{
  musicTitle: string[];
  musicArtist: string[];
  musicLength: number[];
  musicCover: string[];
}>("SET_MUSIC_INFO");

export const incrementTTSIndex = createAction("INCREMENT_TTS_INDEX");
export const incrementMusicIndex = createAction("INCREMENT_MUSIC_INDEX");
export const resetIndices = createAction("RESET_INDICES");

// 2. Reducer 생성

// User를 type으로 정의합니다. Redux에서 사용자 데이터를 관리하기 위한 타입입니다.
export type User = {
  nickname: string;
  profileImage: string;
  userId: number;
};

export type RadioDummyData = {
  djName: string;
  tts_one: string;
  tts_two: string;
  tts_three: string;
  tts_four: string;
  script_one: string;
  script_two: string;
  script_three: string;
  script_four: string;
  oncast_music_one: string;
  oncast_music_two: string;
  oncast_music_three: string;
  currentTTSIndex: number;
  currentMusicIndex: number;
  musicTitle: string[];
  musicArtist: string[];
  musicLength: number[];
  musicCover: string[];
  [key: string]: string | number | string[] | number[];
};

// 초기 상태값을 설정합니다. 애플리케이션 시작 시의 사용자 데이터 상태입니다.
const initialState: User = {
  nickname: "",
  profileImage: "",
  userId: 0,
};

const initialDummyState: RadioDummyData = {
  djName: "",
  tts_one: "",
  tts_two: "",
  tts_three: "",
  tts_four: "",
  script_one: "",
  script_two: "",
  script_three: "",
  script_four: "",
  oncast_music_one: "",
  oncast_music_two: "",
  oncast_music_three: "",
  currentTTSIndex: 0,
  currentMusicIndex: 0,
  musicTitle: [],
  musicArtist: [],
  musicLength: [],
  musicCover: [],
};
// liveDummyState
const initialLiveRadioDummyState: RadioDummyData[] = [];

// 리듀서를 정의합니다. 리듀서는 액션에 따라 상태를 변경하는 함수입니다.
const userReducer = createReducer(initialState, builder => {
  // setUserData 액션이 디스패치될 때 상태를 어떻게 변경할지 정의합니다.
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

const radiodummyReducer = createReducer(initialDummyState, builder => {
  builder
    .addCase(setRadioDummyData, (state, action) => {
      state.tts_one = action.payload.tts_one;
      state.tts_two = action.payload.tts_two;
      state.tts_three = action.payload.tts_three;
      state.tts_four = action.payload.tts_four;
      state.script_one = action.payload.script_one;
      state.script_two = action.payload.script_two;
      state.script_three = action.payload.script_three;
      state.script_four = action.payload.script_four;
      state.oncast_music_one = action.payload.oncast_music_one;
      state.oncast_music_two = action.payload.oncast_music_two;
      state.oncast_music_three = action.payload.oncast_music_three;
      state.djName = action.payload.djName;
    })
    .addCase(setMusicInfo, (state, action) => {
      state.musicTitle = action.payload.musicTitle;
      state.musicArtist = action.payload.musicArtist;

      // 밀리초를 초로 변환하여 저장
      state.musicLength = action.payload.musicLength.map(length =>
        Math.round(length / 1000)
      );

      state.musicCover = action.payload.musicCover;
    })
    .addCase(incrementTTSIndex, state => {
      state.currentTTSIndex++;
    })
    .addCase(incrementMusicIndex, state => {
      state.currentMusicIndex++;
    });
  builder.addCase(resetIndices, state => {
    state.currentTTSIndex = 0;
    state.currentMusicIndex = 0;
  });
});
//수정필요
const liveRadioDummyReducer = createReducer(
  initialLiveRadioDummyState,
  builder => {
    builder
      .addCase(setRadioDummyData, (state, action) => {
        state.push({
          djName: action.payload.djName,
          tts_one: action.payload.tts_one,
          tts_two: action.payload.tts_two,
          tts_three: action.payload.tts_three,
          tts_four: action.payload.tts_four,
          script_one: action.payload.script_one,
          script_two: action.payload.script_two,
          script_three: action.payload.script_three,
          script_four: action.payload.script_four,
          oncast_music_one: action.payload.oncast_music_one,
          oncast_music_two: action.payload.oncast_music_two,
          oncast_music_three: action.payload.oncast_music_three,
          currentTTSIndex: 0,
          currentMusicIndex: 0,
          musicTitle: [],
          musicArtist: [],
          musicLength: [],
          musicCover: [],
        });
      })
      .addCase(setMusicInfo, (state, action) => {
        // 마지막 원소에 대해 데이터 업데이트 (또는 원하는 인덱스에 대해 업데이트)
        const lastItem = state[state.length - 1];
        lastItem.musicTitle = action.payload.musicTitle;
        lastItem.musicArtist = action.payload.musicArtist;
        lastItem.musicLength = action.payload.musicLength.map(length =>
          Math.round(length / 1000)
        );
        lastItem.musicCover = action.payload.musicCover;
      })
      .addCase(incrementTTSIndex, state => {
        // 마지막 원소의 TTS 인덱스 증가 (또는 원하는 인덱스의 TTS 인덱스 증가)
        const lastItem = state[state.length - 1];
        lastItem.currentTTSIndex++;
      })
      .addCase(incrementMusicIndex, state => {
        // 마지막 원소의 음악 인덱스 증가 (또는 원하는 인덱스의 음악 인덱스 증가)
        const lastItem = state[state.length - 1];
        lastItem.currentMusicIndex++;
      })
      .addCase(resetIndices, state => {
        // 마지막 원소의 인덱스 리셋 (또는 원하는 인덱스의 인덱스 리셋)
        const lastItem = state[state.length - 1];
        lastItem.currentTTSIndex = 0;
        lastItem.currentMusicIndex = 0;
      });
  }
);

// 3. Store 설정

// Redux 스토어를 설정합니다. 스토어는 애플리케이션의 상태를 저장하고 관리하는 객체입니다.
const store = configureStore({
  reducer: {
    user: userReducer, // 'user'라는 키로 userReducer를 스토어에 추가합니다.
    radioDummy: radiodummyReducer,
    LiveRadioDummy: liveRadioDummyReducer,
  },
});

// RootState 타입을 정의합니다. 이 타입은 스토어의 전체 상태의 타입을 나타냅니다.
export type RootState = ReturnType<typeof store.getState>;

// 설정된 스토어를 내보냅니다. 이 스토어는 애플리케이션 전체에서 사용됩니다.
export default store;
