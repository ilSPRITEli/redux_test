import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id
    const body = await request.json()
    const { title, description, columnId, assigneeId, tags } = body

    // Get current task data for comparison
    const currentTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { tags: true },
    })

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        ...(columnId && {
          column: {
            connect: { id: columnId },
          },
        }),
        ...(assigneeId !== undefined && {
          assignee: assigneeId ? { connect: { id: assigneeId } } : { disconnect: true },
        }),
        ...(tags && {
          tags: {
            set: [], // Remove all existing tags
            connectOrCreate: tags.map((tagName: string) => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        }),
      },
      include: {
        tags: true,
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // If assignee changed, create a notification
    if (assigneeId && assigneeId !== currentTask.assigneeId) {
      const column = await prisma.column.findUnique({
        where: { id: columnId || currentTask.columnId },
        include: { board: true },
      })

      if (column) {
        await prisma.notification.create({
          data: {
            title: "Task Assigned",
            description: `You've been assigned to "${title}" in board "${column.board.title}"`,
            userId: assigneeId,
          },
        })
      }
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id

    await prisma.task.delete({
      where: { id: taskId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
