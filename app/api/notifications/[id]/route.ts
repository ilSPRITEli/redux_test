import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id
    const body = await request.json()
    const { read } = body

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read },
    })

    return NextResponse.json({ notification: updatedNotification }, { status: 200 })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id

    await prisma.notification.delete({
      where: { id: notificationId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
