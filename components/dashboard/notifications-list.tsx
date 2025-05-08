"use client"

import { useState } from "react"
import { Check, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock notifications
const initialNotifications = [
  {
    id: "1",
    title: "Task assigned to you",
    description: "You've been assigned to 'Implement authentication'",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "New comment on task",
    description: "Jane commented on 'Design homepage'",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "Board invitation",
    description: "You've been invited to 'Marketing Campaign'",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    title: "Task moved to Done",
    description: "Bob moved 'API documentation' to Done",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    title: "New board created",
    description: "Alice created a new board 'Website Redesign'",
    time: "3 days ago",
    read: true,
  },
]

export function NotificationsList() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </div>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start justify-between p-4 rounded-lg border",
                !notification.read && "bg-muted/50",
              )}
            >
              <div className="space-y-1">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">{notification.description}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsRead(notification.id)}>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-muted-foreground">No notifications</div>
        )}
      </div>
    </div>
  )
}
