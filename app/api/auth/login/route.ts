import { NextResponse } from "next/server"
import { loginSchema, loginUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    // Login user
    const user = await loginUser(result.data)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
