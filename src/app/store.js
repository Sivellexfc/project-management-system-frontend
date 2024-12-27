import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./features/sidebarSlice";
import authReducer from "./features/authSlice";

// Diğer dilimler buraya eklenebilir
const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
    // Örnek: kullanıcı dilimi
    // user: userReducer,
  },
});

export default store;
