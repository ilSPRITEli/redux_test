import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface Tag {
  id: string
  name: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Task {
  id: string
  title: string
  description: string | null
  tags: Tag[]
  assignee: User | null
  assigneeId: string | null
}

interface Column {
  id: string
  title: string
  order: number
  tasks: Task[]
}

interface Board {
  id: string
  title: string
  description: string | null
  columns: Column[]
  members: User[]
  createdAt: string
  updatedAt: string
  ownerId: string
}

interface BoardsState {
  boards: Board[]
  currentBoard: Board | null
  loading: boolean
  error: string | null
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
}

// Async thunks for boards
export const fetchBoards = createAsyncThunk("boards/fetchBoards", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/boards?userId=${userId}`)

    const data = await response.json()

    if (!response.ok) {
      return rejectWithValue(data.error || "Failed to fetch boards")
    }

    return data.boards
  } catch (error) {
    return rejectWithValue("An unexpected error occurred")
  }
})

export const fetchBoardById = createAsyncThunk(
  "boards/fetchBoardById",
  async (boardId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`)

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to fetch board")
      }

      return data.board
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (boardData: { title: string; description: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to create board")
      }

      return data.board
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async (
    { boardId, title, description }: { boardId: string; title: string; description: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to update board")
      }

      return data.board
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const deleteBoard = createAsyncThunk("boards/deleteBoard", async (boardId: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/boards/${boardId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const data = await response.json()
      return rejectWithValue(data.error || "Failed to delete board")
    }

    return boardId
  } catch (error) {
    return rejectWithValue("An unexpected error occurred")
  }
})

export const addColumn = createAsyncThunk(
  "boards/addColumn",
  async ({ title, boardId }: { title: string; boardId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, boardId }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to add column")
      }

      return { column: data.column, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const updateColumn = createAsyncThunk(
  "boards/updateColumn",
  async ({ columnId, title, boardId }: { columnId: string; title: string; boardId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/columns/${columnId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to update column")
      }

      return { column: data.column, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const deleteColumn = createAsyncThunk(
  "boards/deleteColumn",
  async ({ columnId, boardId }: { columnId: string; boardId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/columns/${columnId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        return rejectWithValue(data.error || "Failed to delete column")
      }

      return { columnId, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const addTask = createAsyncThunk(
  "boards/addTask",
  async (
    {
      title,
      description,
      columnId,
      boardId,
      assigneeId,
      tags,
    }: {
      title: string
      description: string
      columnId: string
      boardId: string
      assigneeId?: string
      tags?: string[]
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, columnId, assigneeId, tags }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to add task")
      }

      return { task: data.task, columnId, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const updateTask = createAsyncThunk(
  "boards/updateTask",
  async (
    {
      taskId,
      title,
      description,
      columnId,
      boardId,
      assigneeId,
      tags,
    }: {
      taskId: string
      title: string
      description: string
      columnId: string
      boardId: string
      assigneeId?: string
      tags?: string[]
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, columnId, assigneeId, tags }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to update task")
      }

      return { task: data.task, columnId, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const deleteTask = createAsyncThunk(
  "boards/deleteTask",
  async ({ taskId, columnId, boardId }: { taskId: string; columnId: string; boardId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        return rejectWithValue(data.error || "Failed to delete task")
      }

      return { taskId, columnId, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const moveTask = createAsyncThunk(
  "boards/moveTask",
  async (
    {
      taskId,
      sourceColumnId,
      destinationColumnId,
      boardId,
    }: {
      taskId: string
      sourceColumnId: string
      destinationColumnId: string
      boardId: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/move`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ columnId: destinationColumnId }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to move task")
      }

      return { task: data.task, sourceColumnId, destinationColumnId, boardId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const inviteMember = createAsyncThunk(
  "boards/inviteMember",
  async ({ boardId, email, role }: { boardId: string; email: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to invite member")
      }

      return data.board
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const removeMember = createAsyncThunk(
  "boards/removeMember",
  async ({ boardId, userId }: { boardId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${boardId}/members?userId=${userId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to remove member")
      }

      return { boardId, userId }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload
    },
    clearCurrentBoard: (state) => {
      state.currentBoard = null
    },
  },
  extraReducers: (builder) => {
    // Fetch boards
    builder.addCase(fetchBoards.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload
      state.loading = false
    })
    builder.addCase(fetchBoards.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch board by ID
    builder.addCase(fetchBoardById.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchBoardById.fulfilled, (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload
      state.loading = false
    })
    builder.addCase(fetchBoardById.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Create board
    builder.addCase(createBoard.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload)
      state.loading = false
    })
    builder.addCase(createBoard.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Update board
    builder.addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex((board) => board.id === action.payload.id)
      if (index !== -1) {
        state.boards[index] = action.payload
      }
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard = action.payload
      }
    })

    // Delete board
    builder.addCase(deleteBoard.fulfilled, (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((board) => board.id !== action.payload)
      if (state.currentBoard?.id === action.payload) {
        state.currentBoard = null
      }
    })

    // Add column
    builder.addCase(addColumn.fulfilled, (state, action) => {
      const { column, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        board.columns.push({ ...column, tasks: [] })
      }
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.columns.push({ ...column, tasks: [] })
      }
    })

    // Update column
    builder.addCase(updateColumn.fulfilled, (state, action) => {
      const { column, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        const columnIndex = board.columns.findIndex((c) => c.id === column.id)
        if (columnIndex !== -1) {
          board.columns[columnIndex] = { ...board.columns[columnIndex], ...column }
        }
      }
      if (state.currentBoard?.id === boardId) {
        const columnIndex = state.currentBoard.columns.findIndex((c) => c.id === column.id)
        if (columnIndex !== -1) {
          state.currentBoard.columns[columnIndex] = {
            ...state.currentBoard.columns[columnIndex],
            ...column,
          }
        }
      }
    })

    // Delete column
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      const { columnId, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        board.columns = board.columns.filter((c) => c.id !== columnId)
      }
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.columns = state.currentBoard.columns.filter((c) => c.id !== columnId)
      }
    })

    // Add task
    builder.addCase(addTask.fulfilled, (state, action) => {
      const { task, columnId, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        const column = board.columns.find((c) => c.id === columnId)
        if (column) {
          column.tasks.push(task)
        }
      }
      if (state.currentBoard?.id === boardId) {
        const column = state.currentBoard.columns.find((c) => c.id === columnId)
        if (column) {
          column.tasks.push(task)
        }
      }
    })

    // Update task
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const { task, columnId, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        const column = board.columns.find((c) => c.id === columnId)
        if (column) {
          const taskIndex = column.tasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = task
          }
        }
      }
      if (state.currentBoard?.id === boardId) {
        const column = state.currentBoard.columns.find((c) => c.id === columnId)
        if (column) {
          const taskIndex = column.tasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = task
          }
        }
      }
    })

    // Delete task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const { taskId, columnId, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        const column = board.columns.find((c) => c.id === columnId)
        if (column) {
          column.tasks = column.tasks.filter((t) => t.id !== taskId)
        }
      }
      if (state.currentBoard?.id === boardId) {
        const column = state.currentBoard.columns.find((c) => c.id === columnId)
        if (column) {
          column.tasks = column.tasks.filter((t) => t.id !== taskId)
        }
      }
    })

    // Move task
    builder.addCase(moveTask.fulfilled, (state, action) => {
      const { task, sourceColumnId, destinationColumnId, boardId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        const sourceColumn = board.columns.find((c) => c.id === sourceColumnId)
        const destinationColumn = board.columns.find((c) => c.id === destinationColumnId)
        if (sourceColumn && destinationColumn) {
          sourceColumn.tasks = sourceColumn.tasks.filter((t) => t.id !== task.id)
          destinationColumn.tasks.push(task)
        }
      }
      if (state.currentBoard?.id === boardId) {
        const sourceColumn = state.currentBoard.columns.find((c) => c.id === sourceColumnId)
        const destinationColumn = state.currentBoard.columns.find((c) => c.id === destinationColumnId)
        if (sourceColumn && destinationColumn) {
          sourceColumn.tasks = sourceColumn.tasks.filter((t) => t.id !== task.id)
          destinationColumn.tasks.push(task)
        }
      }
    })

    // Invite member
    builder.addCase(inviteMember.fulfilled, (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex((board) => board.id === action.payload.id)
      if (index !== -1) {
        state.boards[index] = action.payload
      }
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard = action.payload
      }
    })

    // Remove member
    builder.addCase(removeMember.fulfilled, (state, action) => {
      const { boardId, userId } = action.payload
      const board = state.boards.find((b) => b.id === boardId)
      if (board) {
        board.members = board.members.filter((m) => m.id !== userId)
      }
      if (state.currentBoard?.id === boardId) {
        state.currentBoard.members = state.currentBoard.members.filter((m) => m.id !== userId)
      }
    })
  },
})

export const { setCurrentBoard, clearCurrentBoard } = boardsSlice.actions

export default boardsSlice.reducer
