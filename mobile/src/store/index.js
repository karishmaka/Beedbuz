import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice
  }
});

export default store;
