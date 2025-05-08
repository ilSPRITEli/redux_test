import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, boardId } = body

    if (!title || !boardId) {
      return NextResponse.json({ error: "Title and board ID are required" }, { status: 400 })
    }

    // Get the highest order value in the board
    const highestOrderColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
    })

    const newOrder = highestOrderColumn ? highestOrderColumn.order + 1 : 0

    // Create a new column
    const column = await prisma.column.create({
      data: {
        title,
        order: newOrder,
        board: {
          connect: { id: boardId },
        },
      },
    })

    return NextResponse.json({ column }, { status: 201 })
  } catch (error) {
    console.error("Error creating column:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
