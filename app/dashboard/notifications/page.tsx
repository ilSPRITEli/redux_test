import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { NotificationsList } from "@/components/dashboard/notifications-list"

export default function NotificationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Notifications" text="View and manage your notifications." />
      <NotificationsList />
    </DashboardShell>
  )
}
