'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { updateUserRole, deleteUser } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Store, User, Shield } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  isVerified: boolean
  createdAt: Date
  seller?: {
    id: string
    storeName: string
    isVerified: boolean
  } | null
  _count: {
    orders: number
    reviews: number
  }
}

interface UserManagementTableProps {
  users: User[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: 'BUYER' | 'SELLER' | 'ADMIN') => {
    setLoading(userId)
    try {
      await updateUserRole(userId, newRole)
      router.refresh()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Failed to update user role')
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setLoading(userId)
    try {
      await deleteUser(userId)
      router.refresh()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    } finally {
      setLoading(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'SELLER':
        return <Store className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      case 'SELLER':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">User</th>
            <th className="text-left p-4 font-medium">Role</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Activity</th>
            <th className="text-left p-4 font-medium">Joined</th>
            <th className="text-left p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div>
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  {user.seller && (
                    <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <Store className="h-3 w-3" />
                      {user.seller.storeName}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                  {user.seller && (
                    <Badge variant={user.seller.isVerified ? 'default' : 'secondary'}>
                      Store: {user.seller.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  <div>{user._count.orders} orders</div>
                  <div className="text-gray-600">{user._count.reviews} reviews</div>
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value as any)}
                    disabled={loading === user.id}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUYER">Buyer</SelectItem>
                      <SelectItem value="SELLER">Seller</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loading === user.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.firstName} {user.lastName}? 
                          This action cannot be undone and will remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
    </div>
  )
}
