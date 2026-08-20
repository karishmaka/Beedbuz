import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';
import usersSlice from './slices/usersSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    users: usersSlice
  }
});

export default store;
