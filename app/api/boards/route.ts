import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get boards where user is owner or member
    const boards = await prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                tags: true,
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
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ boards }, { status: 200 })
  } catch (error) {
    console.error("Error fetching boards:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, userId } = body

    if (!title || !userId) {
      return NextResponse.json({ error: "Title and user ID are required" }, { status: 400 })
    }

    // Create a new board with default columns
    const board = await prisma.board.create({
      data: {
        title,
        description,
        owner: {
          connect: { id: userId },
        },
        members: {
          connect: { id: userId },
        },
        columns: {
          create: [
            { title: "To Do", order: 0 },
            { title: "In Progress", order: 1 },
            { title: "Review", order: 2 },
            { title: "Done", order: 3 },
          ],
        },
      },
      include: {
        columns: true,
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ board }, { status: 201 })
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
