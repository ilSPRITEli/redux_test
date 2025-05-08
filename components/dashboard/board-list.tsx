"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Plus, Trash2, Edit, Users } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateBoardDialog } from "@/components/dashboard/create-board-dialog"
import { fetchBoards, deleteBoard } from "@/lib/redux/slices/boardsSlice"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { useToast } from "@/components/ui/use-toast"

export function BoardList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const { user } = useSelector((state: RootState) => state.auth)
  const { boards, loading, error } = useSelector((state: RootState) => state.boards)

  useEffect(() => {
    if (user) {
      dispatch(fetchBoards(user.id))
    }
  }, [dispatch, user])

  const handleDeleteBoard = async (id: string) => {
    try {
      await dispatch(deleteBoard(id)).unwrap()
      toast({
        title: "Board deleted",
        description: "The board has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Board
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow opacity-50">
              <CardHeader className="pb-2 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
        Error loading boards: {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center p-8 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium mb-2">No boards yet</h3>
          <p className="text-muted-foreground mb-4">Create your first board to get started</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Board
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Card key={board.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{board.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteBoard(board.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{board.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Created on {formatDate(board.createdAt)}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{board.columns.reduce((acc, col) => acc + col.tasks.length, 0)} tasks</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{board.members.length} members</span>
                </div>
              </CardFooter>
              <div className="absolute inset-0 cursor-pointer" onClick={() => router.push(`/board/${board.id}`)} />
            </Card>
          ))}
        </div>
      )}

      <CreateBoardDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
