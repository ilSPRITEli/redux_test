import { RegisterForm } from "@/components/auth/register-form"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center h-14 px-4 lg:px-6 border-b shrink-0 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Kanban</span>
          <span>Board</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Enter your information to get started</p>
          </div>
          <RegisterForm />
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
