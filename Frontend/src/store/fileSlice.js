import { createSlice } from '@reduxjs/toolkit';

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    fileName: null, // Store only metadata or file name
  },
  reducers: {
    setFile: (state, action) => {
      state.fileName = action.payload.fileName;
    },
  },
});

export const { setFile } = fileSlice.actions;

export default fileSlice.reducer;
