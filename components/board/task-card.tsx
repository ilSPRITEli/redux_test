"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskDialog } from "@/components/board/task-dialog"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    tags: string[]
    assignedTo: string | null
  }
  onEdit: (updatedTask: any) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
}

export function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    onDragStart()
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd()
  }

  return (
    <>
      <div
        className={cn("bg-card rounded-md p-3 shadow-sm cursor-pointer", isDragging && "task-dragging")}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
                <span className="sr-only">Task actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDialogOpen(true)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {task.assignedTo && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            {task.assignedTo}
          </div>
        )}
      </div>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} task={task} onSave={onEdit} />
    </>
  )
}
