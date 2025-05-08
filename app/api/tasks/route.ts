import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, columnId, assigneeId, tags } = body

    if (!title || !columnId) {
      return NextResponse.json({ error: "Title and column ID are required" }, { status: 400 })
    }

    // Create a new task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        column: {
          connect: { id: columnId },
        },
        ...(assigneeId && {
          assignee: {
            connect: { id: assigneeId },
          },
        }),
        ...(tags &&
          tags.length > 0 && {
            tags: {
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

    // If task is assigned, create a notification
    if (assigneeId) {
      const column = await prisma.column.findUnique({
        where: { id: columnId },
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

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
