// store/index.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist'
import userReducer from './userReducer'; // Assuming userReducer is your user reducer
// ... your other imports

const persistConfig = {
  key: 'user', // key could be whatever you want
  storage,
  whitelist: ['nickname', 'profileImage', 'userId'] // only these keys will be persisted
};

const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer), // wrap userReducer inside persistReducer
  // ... your other reducers
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store); // create persistor object

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
