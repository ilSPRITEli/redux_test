"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus, MoreHorizontal, UserPlus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BoardColumn } from "@/components/board/board-column"
import { TaskDialog } from "@/components/board/task-dialog"
import { InviteMemberDialog } from "@/components/board/invite-member-dialog"

// Mock data for the board
const mockBoardData = {
  "1": {
    id: "1",
    title: "Product Development",
    description: "Track product features and bugs",
  },
  "2": {
    id: "2",
    title: "Marketing Campaign",
    description: "Q2 marketing initiatives",
  },
  "3": {
    id: "3",
    title: "Website Redesign",
    description: "Redesign company website",
  },
}

// Mock columns data
const initialColumns = [
  {
    id: "col-1",
    title: "To Do",
    tasks: [
      {
        id: "task-1",
        title: "Research competitors",
        description: "Analyze top 5 competitors in the market",
        tags: ["research", "marketing"],
        assignedTo: "John Doe",
      },
      {
        id: "task-2",
        title: "Design homepage mockup",
        description: "Create initial designs for the new homepage",
        tags: ["design", "ui"],
        assignedTo: null,
      },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    tasks: [
      {
        id: "task-3",
        title: "Implement authentication",
        description: "Set up user authentication system with JWT",
        tags: ["development", "backend"],
        assignedTo: "Jane Smith",
      },
    ],
  },
  {
    id: "col-3",
    title: "Review",
    tasks: [
      {
        id: "task-4",
        title: "API documentation",
        description: "Document all API endpoints for the frontend team",
        tags: ["documentation", "api"],
        assignedTo: "John Doe",
      },
    ],
  },
  {
    id: "col-4",
    title: "Done",
    tasks: [
      {
        id: "task-5",
        title: "Project setup",
        description: "Initialize repository and set up project structure",
        tags: ["setup", "development"],
        assignedTo: "Jane Smith",
      },
      {
        id: "task-6",
        title: "Requirements gathering",
        description: "Collect and document project requirements",
        tags: ["planning", "documentation"],
        assignedTo: "John Doe",
      },
    ],
  },
]

interface BoardViewProps {
  boardId: string
}

export function BoardView({ boardId }: BoardViewProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [boardTitle, setBoardTitle] = useState(mockBoardData[boardId as keyof typeof mockBoardData]?.title || "Board")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<any | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const handleTitleClick = () => {
    setIsEditingTitle(true)
    setTimeout(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }, 0)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false)
    }
  }

  const handleAddColumn = () => {
    const newColumn = {
      id: `col-${Date.now()}`,
      title: "New Column",
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const handleColumnTitleChange = (columnId: string, newTitle: string) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)))
  }

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId))
  }

  const handleAddTask = (columnId: string, task: any) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, { ...task, id: `task-${Date.now()}` }] } : col,
      ),
    )
  }

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
      })),
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      })),
    )
  }

  const handleDragStart = (task: any, columnId: string) => {
    setDraggedTask({ task, sourceColumnId: columnId })
  }

  const handleDragOver = (columnId: string) => {
    setActiveColumn(columnId)
  }

  const handleDrop = (columnId: string) => {
    if (!draggedTask) return

    // Remove task from source column
    const sourceColumn = columns.find((col) => col.id === draggedTask.sourceColumnId)
    if (!sourceColumn) return

    // Add task to target column
    setColumns(
      columns.map((col) => {
        if (col.id === draggedTask.sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id),
          }
        }
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, draggedTask.task],
          }
        }
        return col
      }),
    )

    setDraggedTask(null)
    setActiveColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setActiveColumn(null)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-2xl font-bold h-auto py-1 max-w-[300px]"
            />
          ) : (
            <h1
              className="text-2xl font-bold cursor-pointer hover:bg-muted/50 px-2 py-1 rounded"
              onClick={handleTitleClick}
            >
              {boardTitle}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Board settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onTitleChange={handleColumnTitleChange}
              onDeleteColumn={handleDeleteColumn}
              onAddTask={() => {
                setActiveColumn(column.id)
                setIsTaskDialogOpen(true)
              }}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
              onDragOver={() => handleDragOver(column.id)}
              onDrop={() => handleDrop(column.id)}
              onDragEnd={handleDragEnd}
              isDropTarget={activeColumn === column.id}
            />
          ))}
          <div className="shrink-0">
            <Button variant="outline" className="border-dashed h-12 border-2" onClick={handleAddColumn}>
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSave={(task) => {
          if (activeColumn) {
            handleAddTask(activeColumn, task)
          }
        }}
      />

      <InviteMemberDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
    </div>
  )
}
