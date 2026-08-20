import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    feed: [],
    loading: false
  },
  reducers: {
    setPosts: (state, action) => {
      state.feed = action.payload;
    },
    addPost: (state, action) => {
      state.feed.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setPosts, addPost, setLoading } = postsSlice.actions;
export default postsSlice.reducer;
