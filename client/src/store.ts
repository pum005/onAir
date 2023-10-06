import {
  combineReducers,
  configureStore,
  createAction,
  createReducer,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

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

// 채팅 메시지를 추가하는 액션 생성자
export const addChatMessage = createAction<{
  content: string;
  sender: string;
  senderImage: string;
}>("ADD_CHAT_MESSAGE");

// 채팅 메시지를 초기화하는 액션 생성자
export const resetChatMessages = createAction("RESET_CHAT_MESSAGES");
export const incrementTTSIndex = createAction("INCREMENT_TTS_INDEX");
export const incrementMusicIndex = createAction("INCREMENT_MUSIC_INDEX");
export const resetIndices = createAction("RESET_INDICES");
//마이 음악 페이지에서 노래를 눌렀을 때 바로 하단 바가 나오도록
export const togglePlayerVisibility = createAction("TOGGLE_PLAYER_VISIBILITY");

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

// liveDummyState
const initialLiveRadioDummyState: RadioDummyData[] = [];

// 리듀서를 정의합니다. 리듀서는 액션에 따라 상태를 변경하는 함수입니다.
const userReducer = createReducer(initialState, (builder) => {
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

// 초기 상태값 설정
const initialPlayerVisibilityState: boolean = false;

// 리듀서 정의
const playerVisibilityReducer = createReducer(
  initialPlayerVisibilityState,
  (builder) => {
    builder.addCase(togglePlayerVisibility, (state) => {
      return !state; // 현재 상태를 반전시킵니다.
    });
  }
);

const liveRadioDummyReducer = createReducer(
  initialLiveRadioDummyState,
  (builder) => {
    builder
      .addCase(incrementTTSIndex, (state) => {
        // 마지막 원소의 TTS 인덱스 증가 (또는 원하는 인덱스의 TTS 인덱스 증가)
        const lastItem = state[state.length - 1];
        lastItem.currentTTSIndex++;
      })
      .addCase(incrementMusicIndex, (state) => {
        // 마지막 원소의 음악 인덱스 증가 (또는 원하는 인덱스의 음악 인덱스 증가)
        const lastItem = state[state.length - 1];
        lastItem.currentMusicIndex++;
      })
      .addCase(resetIndices, (state) => {
        // 마지막 원소의 인덱스 리셋 (또는 원하는 인덱스의 인덱스 리셋)
        const lastItem = state[state.length - 1];
        lastItem.currentTTSIndex = 0;
        lastItem.currentMusicIndex = 0;
      });
  }
);

// 채팅 메시지 타입 정의
export type ChatMessage = {
  content: string;
  sender: string;
  senderImage: string;
};

// 초기 상태값 설정
const initialChatState: ChatMessage[] = [];

// 리듀서 정의
const chatReducer = createReducer(initialChatState, (builder) => {
  builder
    .addCase(addChatMessage, (state, action) => {
      console.log("State before push:", action.payload);
      console.log("State:", state);
      console.log("Is state an array?", Array.isArray(state));
      state.push(action.payload); // state.push 대신 spread 연산자를 사용하여 배열에 추가
    })
    .addCase(resetChatMessages, (state) => {
      // 채팅 메시지 초기화
      return initialChatState;
    });
});

// RootState 타입을 정의합니다. 이 타입은 스토어의 전체 상태의 타입을 나타냅니다.
export type RootState = ReturnType<typeof store.getState>;

//config 설정
const persistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

/** MusicPlayer */
//MusicType
export type MusicInfo = {
  musicId: number;
  title: string;
  artist: string;
  duration: number;
  albumCoverUrl: string;
  youtubeVideoId: string;
};

type MusicState = MusicInfo[];

// 초기값 initialMusicState 정의
const initialMusicState: MusicState = [];

// 액션 생성자 정의
export const setMusicDataTemp = createAction<MusicState>("SET_MUSIC_DATA");

const musicReducer = createReducer(initialMusicState, (builder) => {
  builder.addCase(
    setMusicDataTemp,
    (state, action: PayloadAction<MusicState>) => {
      return action.payload;
    }
  );
});

const musicPersistConfig = {
  key: "music",
  storage,
};

const persistedMusicReducer = persistReducer(musicPersistConfig, musicReducer);

/** Music 상태 타입 (현재 어떤 인덱스의 노래를 듣는지)*/
export type SelectedMusicIndexState = number;
//초기 상태값
const initialSelectedMusicIndexState: SelectedMusicIndexState = 0;

//액션 생성자 정의
export const setSelectedMusicIndex = createAction<number>(
  "SET_SELECTED_MUSIC_INDEX"
);

//리듀서 정의
const selectedMusicIndexReducer = createReducer(
  initialSelectedMusicIndexState,
  (builder) => {
    builder.addCase(setSelectedMusicIndex, (state, action) => {
      return action.payload; // 선택된 노래의 인덱스를 상태에 설정합니다.
    });
  }
);

/** 플레이리스트 주소 이동 */
export const setPlaylistMetaId = createAction<number>("SET_PLAYLIST_META_ID");

const initialPlaylistMetaIdState: number = 0;

const playlistMetaIdReducer = createReducer(
  initialPlaylistMetaIdState,
  (builder) => {
    builder.addCase(setPlaylistMetaId, (state, action) => {
      return action.payload;
    });
  }
);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    chat: chatReducer,
    music: persistedMusicReducer,
    selectedMusicIndex: selectedMusicIndexReducer,
    isPlayerVisible: playerVisibilityReducer,
    playlistMetaId: playlistMetaIdReducer,
  },
});

export const persistor = persistStore(store);

//persist

export default store;
