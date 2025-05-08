import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id
    const body = await request.json()
    const { columnId } = body

    if (!columnId) {
      return NextResponse.json({ error: "Column ID is required" }, { status: 400 })
    }

    // Move task to new column
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        column: {
          connect: { id: columnId },
        },
      },
      include: {
        column: {
          include: {
            board: true,
          },
        },
        assignee: true,
      },
    })

    // If task has an assignee, create a notification about the move
    if (updatedTask.assignee) {
      await prisma.notification.create({
        data: {
          title: "Task Moved",
          description: `Task "${updatedTask.title}" has been moved to "${updatedTask.column.title}" in board "${updatedTask.column.board.title}"`,
          userId: updatedTask.assignee.id,
        },
      })
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 })
  } catch (error) {
    console.error("Error moving task:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
