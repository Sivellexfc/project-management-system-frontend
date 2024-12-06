import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./features/sidebarSlice";

// Diğer dilimler buraya eklenebilir
const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    // Örnek: kullanıcı dilimi
    // user: userReducer,
  },
});

export default store;
