import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import searchReducer from './searchSlice'
import postReducer from "./postSlice";
import chatReducer from './chatSlice';
import groupReducer from './groupSlice';
import adminReducer from './adminSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({ 
  auth: authReducer, 
  search: searchReducer ,
  post: postReducer,
  chat: chatReducer,
  group: groupReducer,
  admin: adminReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);