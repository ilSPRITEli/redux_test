import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  title: string
  description: string
  createdAt: string
  read: boolean
  userId: string
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

// Async thunks for notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`)

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to fetch notifications")
      }

      return data.notifications
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to mark notification as read")
      }

      return data.notification
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        return rejectWithValue(data.error || "Failed to mark all notifications as read")
      }

      return userId
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        return rejectWithValue(data.error || "Failed to delete notification")
      }

      return notificationId
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter((n) => !n.read).length
      state.loading = false
    })
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Mark as read
    builder.addCase(markAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload.id)
      if (index !== -1) {
        const wasUnread = !state.notifications[index].read
        state.notifications[index] = action.payload
        if (wasUnread && action.payload.read) {
          state.unreadCount -= 1
        }
      }
    })

    // Mark all as read
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
      state.unreadCount = 0
    })

    // Delete notification
    builder.addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        state.unreadCount -= 1
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    })
  },
})

export default notificationsSlice.reducer
