import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  Loader2,
  BookOpen,
  Mic
} from "lucide-react";
import { StatisticsApi } from "@/api/statistics.api";
import dayjs from "dayjs";

export default function Dashboard() {

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: StatisticsApi.getDashboardStats,
    refetchInterval: 1000 * 60 * 5,
  });

  const stats = statsData?.data;

  if (isLoading || !stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng doanh thu",
      value: stats.totalRevenue.toLocaleString() + "đ",
      description: "Tổng doanh thu từ trước đến nay",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Học viên",
      value: stats.totalUsers.toLocaleString(),
      description: "Tổng số tài khoản đăng ký",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Lượt mua khóa học",
      value: stats.totalEnrollments.toLocaleString(),
      description: "Tổng số lượt ghi danh thành công",
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      title: "Học viên mới (Hôm nay)",
      value: "+" + stats.newUsersToday,
      description: "Số người đăng ký trong ngày",
      icon: Activity,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Tổng quan tình hình hoạt động của hệ thống.
          </p>
        </div>
        <Button className="bg-[#155e94] hover:bg-[#0b4674]">
          Tải báo cáo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stat.title === "Học viên mới (Hôm nay)" && stats.newUsersToday > 0 && (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                )}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tổng quan nội dung</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-md">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-color">{stats.totalCourses}</div>
                  <div className="text-sm">Khóa học</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{stats.publishedCourses}</div>
                  <div className="text-sm">Đang mở bán</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">{stats.draftCourses}</div>
                  <div className="text-sm">Bản nháp</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-lg font-bold">{stats.totalPosts}</div>
                  <div className="text-xs text-gray-500">Bài viết Blog</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-lg font-bold">{stats.totalFlashcardSets}</div>
                  <div className="text-xs text-gray-500">Bộ Flashcard</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <Mic className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-lg font-bold">{stats.totalDictationLessons}</div>
                  <div className="text-xs text-gray-500">Bài nghe chép</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>5 giao dịch thành công mới nhất.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map((sale, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={sale.userAvatar || "/images/student.png"} alt="Avatar" />
                      <AvatarFallback>{sale.userFullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.userFullName}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {sale.userEmail}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="font-medium">+{sale.amount.toLocaleString()}đ</div>
                      <div className="text-xs text-gray-400">{dayjs(sale.createdAt).format("DD/MM HH:mm")}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Chưa có giao dịch nào.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}