// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import fileSlice from './fileSlice';
const store = configureStore({
  reducer:{
    file:fileSlice
  }
});

export default store;
