import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import routes from "@/routes/routes.const";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import { CourseApi } from "@/api/course.api";
import { PaymentApi } from "@/api/payment.api";
import { useEffect } from "react";




export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();

    const courseIds = location.state?.courseIds as number[] || [];

    const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
        queryKey: ["courses", "byIds", courseIds],
        queryFn: () => CourseApi.getCoursesByIds(courseIds),
        enabled: courseIds.length > 0,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (courseIds.length === 0) {
            toast.error("Không có khóa học nào để thanh toán");
            navigate(routes.CART);
        }
    }, [courseIds, navigate]);


    const checkoutMutation = useMutation({
        mutationFn: (ids: number[]) => PaymentApi.createPayment({ courseIds: ids }),
        onSuccess: (response) => {
            window.location.href = response.data.paymentUrl;
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data?.message || "Tạo thanh toán thất bại");
        },
    });

    const handleCheckout = () => {
        checkoutMutation.mutate(courseIds);
    };

    const items = coursesData?.data ?? [];
    const total = items.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0);


    if (isLoadingCourses) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="main-layout py-8">
                <h1 className="text-3xl font-bold text-primary-color mb-6">Xác nhận Đặt hàng</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Các khóa học sẽ thanh toán</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-2 border-b">
                                        <img
                                            src={item.thumbnailUrl || "/placeholder.svg"}
                                            alt={item.title}
                                            className="w-24 h-16 object-cover rounded-md flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold line-clamp-2 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{item.teacher?.fullName}</p>
                                        </div>
                                        <div className="font-bold text-primary-color text-lg">
                                            {item.discountPrice?.toLocaleString() ?? item.price.toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Tổng cộng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng cộng</span>
                                    <span className="text-primary-color">{total.toLocaleString()}đ</span>
                                </div>
                                <Button
                                    className="w-full bg-primary-color hover:bg-hover-primary-color"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={checkoutMutation.isPending || items.length === 0}
                                >
                                    {checkoutMutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                    )}
                                    Thanh toán (VNPAY)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}