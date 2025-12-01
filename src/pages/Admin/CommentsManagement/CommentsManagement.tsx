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
  Edit,
  Trash2,
  MessageSquare,
  ThumbsUp,
  Flag,
} from "lucide-react";
import DynamicPagination from "@/components/DynamicPagination";

const mockComments = [
  {
    id: 1,
    content:
      "This course is absolutely amazing! I learned so much about React hooks and state management. The instructor explains everything clearly.",
    author: "John Doe",
    authorEmail: "john@example.com",
    authorAvatar: "JD",
    postTitle: "Complete React Development",
    postType: "Course",
    status: "Approved",
    likes: 15,
    replies: 3,
    createdDate: "2024-01-15",
    isReported: false,
  },
  {
    id: 2,
    content:
      "Great article! However, I think there's a small typo in the third paragraph. Could you please check?",
    author: "Jane Smith",
    authorEmail: "jane@example.com",
    authorAvatar: "JS",
    postTitle: "10 Tips for Learning English Grammar",
    postType: "Post",
    status: "Approved",
    likes: 8,
    replies: 1,
    createdDate: "2024-01-14",
    isReported: false,
  },
  {
    id: 3,
    content:
      "This is spam content with promotional links. Please remove this comment.",
    author: "Spam User",
    authorEmail: "spam@example.com",
    authorAvatar: "SU",
    postTitle: "Business English Vocabulary Guide",
    postType: "Post",
    status: "Pending",
    likes: 0,
    replies: 0,
    createdDate: "2024-01-13",
    isReported: true,
  },
  {
    id: 4,
    content:
      "I disagree with the approach mentioned in this lesson. There are better ways to handle this scenario.",
    author: "Mike Johnson",
    authorEmail: "mike@example.com",
    authorAvatar: "MJ",
    postTitle: "Advanced JavaScript Concepts",
    postType: "Course",
    status: "Approved",
    likes: 5,
    replies: 7,
    createdDate: "2024-01-12",
    isReported: false,
  },
  {
    id: 5,
    content: "Inappropriate content that violates community guidelines.",
    author: "Bad User",
    authorEmail: "bad@example.com",
    authorAvatar: "BU",
    postTitle: "UI/UX Design Fundamentals",
    postType: "Course",
    status: "Rejected",
    likes: 0,
    replies: 0,
    createdDate: "2024-01-11",
    isReported: true,
  },
];

export default function CommentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 10;

  const filteredComments = mockComments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || comment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComments = filteredComments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      Approved: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
    );
  };

  const getPostTypeBadge = (type: string) => {
    const colors = {
      Course: "bg-blue-100 text-blue-800",
      Post: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>
    );
  };

  const handleApproveComment = (commentId: number) => {
    console.log("Approving comment:", commentId);
  };

  const handleRejectComment = (commentId: number) => {
    console.log("Rejecting comment:", commentId);
  };

  const handleDeleteComment = (commentId: number) => {
    console.log("Deleting comment:", commentId);
  };

  const handleViewComment = (commentId: number) => {
    console.log("Viewing comment:", commentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
          <p className="text-muted-foreground">
            Manage user comments and reviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
          <CardDescription>
            A list of all user comments with moderation status and engagement
            metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
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
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
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
                  <TableHead>Comment</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                        <div className="max-w-[300px]">
                          <div className="text-sm line-clamp-3">
                            {comment.content}
                          </div>
                          {comment.isReported && (
                            <div className="flex items-center mt-2">
                              <Flag className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-xs text-red-600">
                                Reported
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                          />
                          <AvatarFallback>
                            {comment.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {comment.author}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {comment.authorEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm max-w-[200px] truncate">
                          {comment.postTitle}
                        </div>
                        <div className="mt-1">
                          {getPostTypeBadge(comment.postType)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(comment.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1 text-muted-foreground" />
                          {comment.likes} likes
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1 text-muted-foreground" />
                          {comment.replies} replies
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{comment.createdDate}</TableCell>
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
                            onClick={() => handleViewComment(comment.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View full comment
                          </DropdownMenuItem>
                          {comment.status === "Pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleApproveComment(comment.id)}
                                className="text-green-600"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectComment(comment.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {comment.status === "Approved" && (
                            <DropdownMenuItem
                              onClick={() => handleRejectComment(comment.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete permanently
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
              <DynamicPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockComments.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockComments.filter((c) => c.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Requires moderation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockComments.filter((c) => c.isReported).length}
            </div>
            <p className="text-xs text-muted-foreground">Flagged by users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Comments with likes/replies
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
