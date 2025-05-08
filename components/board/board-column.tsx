"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskCard } from "@/components/board/task-card"
import { cn } from "@/lib/utils"

interface BoardColumnProps {
  column: {
    id: string
    title: string
    tasks: any[]
  }
  onTitleChange: (columnId: string, newTitle: string) => void
  onDeleteColumn: (columnId: string) => void
  onAddTask: () => void
  onEditTask: (taskId: string, updatedTask: any) => void
  onDeleteTask: (taskId: string) => void
  onDragStart: (task: any, columnId: string) => void
  onDragOver: () => void
  onDrop: () => void
  onDragEnd: () => void
  isDropTarget: boolean
}

export function BoardColumn({
  column,
  onTitleChange,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDropTarget,
}: BoardColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    onDragOver()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop()
  }

  return (
    <div
      className={cn("flex flex-col w-72 shrink-0 rounded-lg bg-muted/50 p-2", isDropTarget && "column-drop-active")}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={column.title}
            onChange={(e) => onTitleChange(column.id, e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="h-7 py-1"
          />
        ) : (
          <h3
            className="font-medium text-sm cursor-pointer hover:bg-background/80 px-2 py-1 rounded"
            onClick={handleTitleClick}
          >
            {column.title} ({column.tasks.length})
          </h3>
        )}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Column actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTitleClick()}>Rename</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDeleteColumn(column.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px]">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(updatedTask) => onEditTask(task.id, updatedTask)}
            onDelete={() => onDeleteTask(task.id)}
            onDragStart={() => onDragStart(task, column.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
      <Button variant="ghost" size="sm" className="mt-2 w-full justify-start" onClick={onAddTask}>
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  )
}
