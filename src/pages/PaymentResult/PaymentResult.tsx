import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import routes from "@/routes/routes.const";
import { useQueryClient } from "@tanstack/react-query";

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const isSuccess = vnp_ResponseCode === "00";

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["cart", "me"] });
            queryClient.invalidateQueries({ queryKey: ["my-courses", "me"] });
        }
    }, [isSuccess, queryClient]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-8 text-center">
                    {isSuccess ? (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Thanh toán thành công!
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ.
                            </p>
                            <Button
                                asChild
                                className="bg-primary-color hover:bg-hover-primary-color"
                            >
                                <Link to={routes.MY_COURSES}>Về trang khóa học của tôi</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Thanh toán thất bại
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
                            </p>
                            <Button
                                asChild
                                className="bg-primary-color hover:bg-hover-primary-color"
                            >
                                <Link to={routes.CART}>Quay lại giỏ hàng</Link>
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}