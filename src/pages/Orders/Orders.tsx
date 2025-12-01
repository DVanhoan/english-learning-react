"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Package, Calendar, DollarSign, ChevronRight } from "lucide-react";
import routes from "@/routes/routes.const";

interface Order {
  id: string;
  date: string;
  totalAmount: number;
  status: "completed" | "pending" | "cancelled";
  courses: {
    id: string;
    title: string;
    price: number;
    image: string;
  }[];
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    date: "2025-07-20",
    totalAmount: 299000,
    status: "completed",
    courses: [
      {
        id: "tieng-anh-giao-tiep-co-ban",
        title: "Tiếng Anh giao tiếp cho người mới bắt đầu",
        price: 299000,
        image:
          "https://dinoenglish.app/_next/image?url=%2Fassets%2Fblog%2Ftu-tin-giao-tiep-tieng-anh-voi-3000-tu-vung-thong-dung-nhat.png&w=1920&q=75",
      },
    ],
  },
  {
    id: "ORD002",
    date: "2025-07-15",
    totalAmount: 399000,
    status: "completed",
    courses: [
      {
        id: "luyen-thi-toeic-cap-toc",
        title: "Luyện thi TOEIC cấp tốc 2025",
        price: 399000,
        image:
          "https://dinoenglish.app/_next/image?url=%2Fassets%2Fblog%2Ftu-tin-giao-tiep-tieng-anh-voi-3000-tu-vung-thong-dung-nhat.png&w=1920&q=75",
      },
      {
        id: "tu-vung-tieng-anh-nguoi-di-lam",
        title: "Từ vựng tiếng Anh cho người đi làm",
        price: 199000,
        image:
          "https://dinoenglish.app/_next/image?url=%2Fassets%2Fblog%2Ftu-tin-giao-tiep-tieng-anh-voi-3000-tu-vung-thong-dung-nhat.png&w=1920&q=75",
      },
    ],
  },
  {
    id: "ORD003",
    date: "2025-07-10",
    totalAmount: 199000,
    status: "pending",
    courses: [
      {
        id: "ielts-speaking-band-7",
        title: "IELTS Speaking - Chinh phục band 7.0+",
        price: 199000,
        image:
          "https://dinoenglish.app/_next/image?url=%2Fassets%2Fblog%2Ftu-tin-giao-tiep-tieng-anh-voi-3000-tu-vung-thong-dung-nhat.png&w=1920&q=75",
      },
    ],
  },
];

export default function Orders() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Đang chờ";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <h1 className="text-3xl font-bold text-primary-color mb-6">
          Đơn hàng của tôi
        </h1>

        {mockOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-4">
                Bạn chưa có đơn hàng nào.
              </p>
              <Button
                className="bg-primary-color hover:bg-hover-primary-color"
                asChild
              >
                <Link to={routes.COURSES}>Khám phá các khóa học</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Đơn hàng #{order.id}
                  </CardTitle>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Ngày đặt: {order.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        Tổng tiền: {order.totalAmount.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t pt-4">
                    <h3 className="font-semibold text-md">
                      Các khóa học đã mua:
                    </h3>
                    {order.courses.map((course) => (
                      <div key={course.id} className="flex items-center gap-3">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-16 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {course.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {course.price.toLocaleString()}đ
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={routes.COURSE_DETAIL.replace(
                              ":slug",
                              course.id
                            )}
                          >
                            Xem khóa học{" "}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
