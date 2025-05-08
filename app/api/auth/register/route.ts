import { NextResponse } from "next/server"
import { registerSchema, registerUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    // Register user
    const user = await registerUser(result.data)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
