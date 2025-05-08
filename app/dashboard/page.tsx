import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BoardList } from "@/components/dashboard/board-list"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Boards" text="Create and manage your Kanban boards." />
      <BoardList />
    </DashboardShell>
  )
}
