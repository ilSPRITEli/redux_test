import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const columnId = params.id
    const body = await request.json()
    const { title } = body

    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: { title },
    })

    return NextResponse.json({ column: updatedColumn }, { status: 200 })
  } catch (error) {
    console.error("Error updating column:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const columnId = params.id

    // Delete the column and all its tasks
    await prisma.column.delete({
      where: { id: columnId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting column:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
