import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const boardId = params.id
    const body = await request.json()
    const { email, role } = body

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is already a member
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          where: { id: user.id },
        },
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    if (board.members.length > 0) {
      return NextResponse.json({ error: "User is already a member of this board" }, { status: 400 })
    }

    // Add user to board members
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        members: {
          connect: { id: user.id },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // Create notification for the user
    await prisma.notification.create({
      data: {
        title: "Board Invitation",
        description: `You've been invited to collaborate on board "${board.title}"`,
        userId: user.id,
      },
    })

    return NextResponse.json({ board: updatedBoard }, { status: 200 })
  } catch (error) {
    console.error("Error adding member:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const boardId = params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Remove user from board members
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    })

    return NextResponse.json({ board: updatedBoard }, { status: 200 })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
