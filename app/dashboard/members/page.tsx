import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MembersList } from "@/components/dashboard/members-list"

export default function MembersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Team Members" text="Manage your team members and their permissions." />
      <MembersList />
    </DashboardShell>
  )
}
