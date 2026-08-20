import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    feed: [],
    loading: false,
    error: null
  },
  reducers: {
    setPosts: (state, action) => {
      state.feed = action.payload;
    },
    addPost: (state, action) => {
      state.feed.unshift(action.payload);
    },
    removePost: (state, action) => {
      state.feed = state.feed.filter(post => post.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setPosts, addPost, removePost, setLoading } = postsSlice.actions;
export default postsSlice.reducer;
