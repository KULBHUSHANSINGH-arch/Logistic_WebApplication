import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage

import userReducer from '../feauters/user.slice.js';
import singleVehicleReducer from '../feauters/data.slice.js';
import themeReducer from '../feauters/theme.slice.js'

// Persist Configuration for userSlice
const persistConfig = {
  key: 'user',
  storage,
};
const persistConfigVehicle = {
  key: 'vehicle',
  storage,
};
const persistConfigTheme = {
  key: 'theme',
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedSingleVehicleReducer = persistReducer(persistConfigVehicle, singleVehicleReducer);
const persistedThemeReducer = persistReducer(persistConfigTheme, themeReducer);

// Configure Store
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    singleVehicle: persistedSingleVehicleReducer,
    persistedThemeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

export const persistor = persistStore(store);
