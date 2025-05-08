import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import boardsReducer from "./slices/boardsSlice"
import notificationsReducer from "./slices/notificationsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
