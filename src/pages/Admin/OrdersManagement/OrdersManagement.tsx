"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import DynamicPagination from "@/components/DynamicPagination";

const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    customer: "John Doe",
    customerEmail: "john@example.com",
    customerAvatar: "JD",
    items: [
      { name: "Complete React Development", price: 99.99 },
      { name: "Advanced JavaScript Concepts", price: 79.99 },
    ],
    total: 179.98,
    discount: 20.0,
    finalAmount: 159.98,
    paymentMethod: "Credit Card",
    paymentStatus: "Completed",
    orderStatus: "Completed",
    couponCode: "WELCOME20",
    createdDate: "2024-01-15",
    completedDate: "2024-01-15",
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    customer: "Jane Smith",
    customerEmail: "jane@example.com",
    customerAvatar: "JS",
    items: [{ name: "UI/UX Design Fundamentals", price: 129.99 }],
    total: 129.99,
    discount: 0,
    finalAmount: 129.99,
    paymentMethod: "PayPal",
    paymentStatus: "Completed",
    orderStatus: "Processing",
    couponCode: null,
    createdDate: "2024-01-14",
    completedDate: null,
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    customer: "Mike Johnson",
    customerEmail: "mike@example.com",
    customerAvatar: "MJ",
    items: [
      { name: "Node.js Backend Development", price: 89.99 },
      { name: "Database Design Course", price: 69.99 },
    ],
    total: 159.98,
    discount: 15.0,
    finalAmount: 144.98,
    paymentMethod: "Credit Card",
    paymentStatus: "Failed",
    orderStatus: "Cancelled",
    couponCode: "STUDENT15",
    createdDate: "2024-01-13",
    completedDate: null,
  },
  {
    id: 4,
    orderNumber: "ORD-2024-004",
    customer: "Sarah Wilson",
    customerEmail: "sarah@example.com",
    customerAvatar: "SW",
    items: [{ name: "Python for Data Science", price: 149.99 }],
    total: 149.99,
    discount: 50.0,
    finalAmount: 99.99,
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    couponCode: "SUMMER50",
    createdDate: "2024-01-12",
    completedDate: null,
  },
];

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 10;

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getOrderStatusBadge = (status: string) => {
    const colors = {
      Completed: "bg-green-100 text-green-800",
      Processing: "bg-blue-100 text-blue-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
    );
  };

  const handleViewOrder = (orderId: number) => {
    console.log("Viewing order:", orderId);
  };

  const handleRefundOrder = (orderId: number) => {
    console.log("Processing refund for order:", orderId);
  };

  const handleDownloadInvoice = (orderId: number) => {
    console.log("Downloading invoice for order:", orderId);
  };

  const totalRevenue = mockOrders
    .filter((order) => order.paymentStatus === "Completed")
    .reduce((sum, order) => sum + order.finalAmount, 0);

  const completedOrders = mockOrders.filter(
    (order) => order.orderStatus === "Completed"
  ).length;
  const pendingOrders = mockOrders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage customer orders and transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Orders
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              {((completedOrders / mockOrders.length) * 100).toFixed(1)}%
              completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A list of all customer orders with their status and payment
            information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        {order.couponCode && (
                          <div className="text-sm text-muted-foreground">
                            Coupon: {order.couponCode}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                          />
                          <AvatarFallback>
                            {order.customerAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {order.customer}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.customerEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="truncate">{item.name}</div>
                            <div className="text-muted-foreground">
                              ${item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          ${order.finalAmount.toFixed(2)}
                        </div>
                        {order.discount > 0 && (
                          <div className="text-muted-foreground">
                            <span className="line-through">
                              ${order.total.toFixed(2)}
                            </span>
                            <span className="ml-1 text-green-600">
                              -${order.discount.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{order.paymentMethod}</div>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getOrderStatusBadge(order.orderStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.createdDate}</div>
                        {order.completedDate && (
                          <div className="text-muted-foreground">
                            Completed: {order.completedDate}
                          </div>
                        )}
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadInvoice(order.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download invoice
                          </DropdownMenuItem>
                          {order.orderStatus === "Completed" &&
                            order.paymentStatus === "Completed" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleRefundOrder(order.id)}
                                  className="text-red-600"
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Process refund
                                </DropdownMenuItem>
                              </>
                            )}
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
              <DynamicPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
