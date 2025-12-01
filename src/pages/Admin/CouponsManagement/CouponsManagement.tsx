import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Filter, Edit, Trash2, Tag, Copy } from "lucide-react"
import DynamicPagination from "@/components/DynamicPagination"

const mockCoupons = [
  {
    id: 1,
    code: "WELCOME20",
    description: "Welcome discount for new users",
    type: "Percentage",
    value: 20,
    minAmount: 50,
    maxDiscount: 100,
    usageLimit: 1000,
    usedCount: 245,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
    createdDate: "2024-01-01",
  },
  {
    id: 2,
    code: "SUMMER50",
    description: "Summer sale - $50 off",
    type: "Fixed",
    value: 50,
    minAmount: 200,
    maxDiscount: 50,
    usageLimit: 500,
    usedCount: 123,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "Active",
    createdDate: "2024-05-15",
  },
  {
    id: 3,
    code: "STUDENT15",
    description: "Student discount",
    type: "Percentage",
    value: 15,
    minAmount: 30,
    maxDiscount: 75,
    usageLimit: 2000,
    usedCount: 567,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
    createdDate: "2024-01-01",
  },
  {
    id: 4,
    code: "EXPIRED10",
    description: "Expired promotional code",
    type: "Percentage",
    value: 10,
    minAmount: 25,
    maxDiscount: 50,
    usageLimit: 100,
    usedCount: 89,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    status: "Expired",
    createdDate: "2023-11-15",
  },
]

interface CouponFormData {
  code: string
  description: string
  type: string
  value: number
  minAmount: number
  maxDiscount: number
  usageLimit: number
  startDate: string
  endDate: string
  isActive: boolean
}

export default function CouponsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    type: "Percentage",
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    usageLimit: 100,
    startDate: "",
    endDate: "",
    isActive: true,
  })
  const itemsPerPage = 10

  const filteredCoupons = mockCoupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Expired: "bg-red-100 text-red-800",
      Inactive: "bg-gray-100 text-gray-800",
    }
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      Percentage: "bg-blue-100 text-blue-800",
      Fixed: "bg-purple-100 text-purple-800",
    }
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>
  }

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, code: result }))
  }

  const handleCreateCoupon = () => {
    console.log("Creating coupon:", formData)
    setIsCreateOpen(false)
    setFormData({
      code: "",
      description: "",
      type: "Percentage",
      value: 0,
      minAmount: 0,
      maxDiscount: 0,
      usageLimit: 100,
      startDate: "",
      endDate: "",
      isActive: true,
    })
  }

  const handleEditCoupon = (coupon: any) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isActive: coupon.status === "Active",
    })
    setIsEditOpen(true)
  }

  const handleUpdateCoupon = () => {
    console.log("Updating coupon:", selectedCoupon.id, formData)
    setIsEditOpen(false)
    setSelectedCoupon(null)
    setFormData({
      code: "",
      description: "",
      type: "Percentage",
      value: 0,
      minAmount: 0,
      maxDiscount: 0,
      usageLimit: 100,
      startDate: "",
      endDate: "",
      isActive: true,
    })
  }

  const handleDeleteCoupon = (couponId: number) => {
    console.log("Deleting coupon:", couponId)
  }

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">Manage discount coupons and promotional codes</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#155e94] hover:bg-[#0b4674]">
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>Add a new discount coupon for your courses.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="WELCOME20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={generateCouponCode}>
                    Generate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe the coupon purpose..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage (%)</SelectItem>
                      <SelectItem value="Fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">{formData.type === "Percentage" ? "Percentage" : "Amount ($)"}</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder={formData.type === "Percentage" ? "20" : "50"}
                    value={formData.value || ""}
                    onChange={(e) => setFormData({ ...formData, value: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Minimum Amount ($)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    placeholder="50"
                    value={formData.minAmount || ""}
                    onChange={(e) => setFormData({ ...formData, minAmount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="100"
                    value={formData.maxDiscount || ""}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="100"
                  value={formData.usageLimit || ""}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateCoupon} className="bg-[#155e94] hover:bg-[#0b4674]">
                Create Coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>A list of all discount coupons with their usage statistics and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-mono font-medium">{coupon.code}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {coupon.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(coupon.type)}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {coupon.type === "Percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                      </div>
                      <div className="text-sm text-muted-foreground">Min: ${coupon.minAmount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {coupon.usedCount} / {coupon.usageLimit}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{coupon.startDate}</div>
                        <div className="text-muted-foreground">to {coupon.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                    <TableCell>{coupon.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleCopyCouponCode(coupon.code)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy code
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit coupon
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCoupon(coupon.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete coupon
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <DynamicPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Make changes to the coupon here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Coupon Code</Label>
              <Input
                id="edit-code"
                placeholder="WELCOME20"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Describe the coupon purpose..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Discount Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage (%)</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">{formData.type === "Percentage" ? "Percentage" : "Amount ($)"}</Label>
                <Input
                  id="edit-value"
                  type="number"
                  placeholder={formData.type === "Percentage" ? "20" : "50"}
                  value={formData.value || ""}
                  onChange={(e) => setFormData({ ...formData, value: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minAmount">Minimum Amount ($)</Label>
                <Input
                  id="edit-minAmount"
                  type="number"
                  placeholder="50"
                  value={formData.minAmount || ""}
                  onChange={(e) => setFormData({ ...formData, minAmount: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxDiscount">Max Discount ($)</Label>
                <Input
                  id="edit-maxDiscount"
                  type="number"
                  placeholder="100"
                  value={formData.maxDiscount || ""}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-usageLimit">Usage Limit</Label>
              <Input
                id="edit-usageLimit"
                type="number"
                placeholder="100"
                value={formData.usageLimit || ""}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateCoupon} className="bg-[#155e94] hover:bg-[#0b4674]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
