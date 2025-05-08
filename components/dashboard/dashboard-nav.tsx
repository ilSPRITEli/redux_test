"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, PlusCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 p-4">
      <Link href="/dashboard">
        <Button variant={pathname === "/dashboard" ? "default" : "ghost"} className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </Link>
      <Link href="/dashboard/boards">
        <Button variant={pathname === "/dashboard/boards" ? "default" : "ghost"} className="w-full justify-start">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Boards
        </Button>
      </Link>
      <Link href="/dashboard/members">
        <Button variant={pathname === "/dashboard/members" ? "default" : "ghost"} className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Members
        </Button>
      </Link>
      <Link href="/dashboard/notifications">
        <Button
          variant={pathname === "/dashboard/notifications" ? "default" : "ghost"}
          className="w-full justify-start"
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
      </Link>
      <Link href="/dashboard/settings">
        <Button variant={pathname === "/dashboard/settings" ? "default" : "ghost"} className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </Link>
      <Button className="w-full justify-start mt-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Board
      </Button>
    </nav>
  )
}
