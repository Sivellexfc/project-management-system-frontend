import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    activeItem: "issues", // Varsayılan aktif buton
  },
  reducers: {
    setActiveItem: (state, action) => {
      state.activeItem = action.payload; // Aktif öğeyi güncelle
    },
  },
});

export const { setActiveItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;
