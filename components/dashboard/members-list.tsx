"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Mail, Shield, ShieldAlert, ShieldCheck, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InviteMemberDialog } from "@/components/board/invite-member-dialog"

// Mock members data
const initialMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    avatar: "/placeholder.svg",
    joinedAt: "2023-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Editor",
    avatar: "/placeholder.svg",
    joinedAt: "2023-02-20T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Member",
    avatar: "/placeholder.svg",
    joinedAt: "2023-03-10T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "Viewer",
    avatar: "/placeholder.svg",
    joinedAt: "2023-04-05T00:00:00.000Z",
  },
]

export function MembersList() {
  const [members, setMembers] = useState(initialMembers)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <ShieldAlert className="h-4 w-4 text-destructive" />
      case "Editor":
        return <ShieldCheck className="h-4 w-4 text-primary" />
      case "Member":
        return <Shield className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{member.email}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(member.role)}
                      <span>{member.role}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{formatDate(member.joinedAt)}</td>
                  <td className="p-4 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InviteMemberDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
    </div>
  )
}
