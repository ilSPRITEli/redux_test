import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const boardId = params.id

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
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
            },
          },
        },
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    return NextResponse.json({ board }, { status: 200 })
  } catch (error) {
    console.error("Error fetching board:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const boardId = params.id
    const body = await request.json()
    const { title, description } = body

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title,
        description,
      },
    })

    return NextResponse.json({ board: updatedBoard }, { status: 200 })
  } catch (error) {
    console.error("Error updating board:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const boardId = params.id

    await prisma.board.delete({
      where: { id: boardId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting board:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
