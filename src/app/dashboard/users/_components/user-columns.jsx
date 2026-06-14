"use client"
import { MoreHorizontal } from "lucide-react"
import { deleteUser, updateUserRole } from "@/app/actions/user/user.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popconfirm } from "antd"


export const userColumns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              className="cursor-pointer"
              variant={user.role === "ADMIN" ? "default" : "secondary"}
            >
              {user.role}
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => updateUserRole(user.id, "ADMIN")}
            >
              ADMIN
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => updateUserRole(user.id, "AUTHOR")}
            >
              AUTHOR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
  // ✅ ACTION COLUMN
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const user = row.original

      const handleDelete = async () => {
        await deleteUser(user.id)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Popconfirm
              title="Delete user"
              description="Are you sure you want to delete this user?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                Delete User
              </DropdownMenuItem>
            </Popconfirm>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]