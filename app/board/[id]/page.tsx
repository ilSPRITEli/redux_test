import { BoardView } from "@/components/board/board-view"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function BoardPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <BoardView boardId={params.id} />
    </DashboardShell>
  )
}
