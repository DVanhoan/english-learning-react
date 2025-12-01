"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, Loader2 } from "lucide-react";
import routes from "@/routes/routes.const";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartApi } from "@/api/cart.api";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";


export default function Cart() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", "me"],
    queryFn: CartApi.getMyCart,
    staleTime: 1000 * 60 * 3,
  });

  const removeMutation = useMutation({
    mutationFn: (courseId: number) => CartApi.removeFromCart(courseId),
    onSuccess: () => {
      toast.success("Đã xóa khỏi giỏ hàng");
      queryClient.invalidateQueries({ queryKey: ["cart", "me"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    },
  });


  const cartItems = cartData?.data.items ?? [];
  const itemsInSummary = cartItems.filter(item => selectedItems.includes(item.id));
  const totalItems = itemsInSummary.length;
  const subtotal = itemsInSummary.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0);
  const totalOriginalPrice = itemsInSummary.reduce((sum, item) => sum + item.price, 0);
  const discount = totalOriginalPrice - subtotal;
  const finalTotal = subtotal;

  const handleRemoveItem = (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này khỏi giỏ hàng?")) {
      return;
    }

    removeMutation.mutate(id);
  };

  const handleToggleSelect = (courseId: number) => {
    setSelectedItems(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warn("Bạn chưa chọn khóa học nào để thanh toán.");
      return;
    }
    // Chuyển hướng đến trang Checkout, mang theo ID các khóa học đã chọn
    navigate('/checkout', { state: { courseIds: selectedItems } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <h1 className="text-3xl font-bold text-primary-color mb-6">Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
              <Button className="bg-primary-color hover:bg-hover-primary-color" asChild>
                <Link to={routes.COURSES}>Khám phá các khóa học</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleToggleSelect(item.id)}
                      className="mt-1 sm:mt-0 w-5 h-5"
                    />
                    <img
                      src={item.thumbnailUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full sm:w-32 h-24 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.teacher?.fullName ?? "Giảng viên ẩn"}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-color text-lg">
                          {item.discountPrice.toLocaleString()}đ
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {item.price.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 self-end sm:self-center"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Xóa khỏi giỏ hàng</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Tổng phụ ({totalItems} sản phẩm)</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()}đ</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary-color">{finalTotal.toLocaleString()}đ</span>
                  </div>
                  <Button
                    className="w-full bg-primary-color hover:bg-hover-primary-color" size="lg"
                    onClick={handleProceedToCheckout}
                  >
                    Tiến hành thanh toán <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link to={routes.COURSES}>Tiếp tục mua sắm</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
