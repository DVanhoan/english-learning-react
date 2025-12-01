import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PayoutApi } from "@/api/payout.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function PayoutsManagement() {
    const queryClient = useQueryClient();

    const { data: payoutData, isLoading } = useQuery({
        queryKey: ["admin-payouts"],
        queryFn: PayoutApi.getAll,
    });

    const payouts = payoutData?.data || [];

    const payMutation = useMutation({
        mutationFn: (teacherId: number) => PayoutApi.pay(teacherId),
        onSuccess: () => {
            toast.success("Xác nhận thanh toán thành công!");
            queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
        },
        onError: () => toast.error("Thanh toán thất bại"),
    });

    const handlePay = (teacherId: number, amount: number) => {
        if (amount <= 0) return;
        if (confirm(`Xác nhận đã chuyển khoản ${amount.toLocaleString()}đ cho giảng viên này?`)) {
            payMutation.mutate(teacherId);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Quản lý Doanh thu Giảng viên</h2>
                <p className="text-muted-foreground">Theo dõi và thanh toán thu nhập cho giảng viên.</p>
            </div>

            <Card>
                <CardHeader><CardTitle>Danh sách Giảng viên</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Giảng viên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Đã thanh toán</TableHead>
                                <TableHead>Chờ thanh toán</TableHead>
                                <TableHead className="text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.map((item) => (
                                <TableRow key={item.teacherId}>
                                    <TableCell className="font-medium">{item.teacherName}</TableCell>
                                    <TableCell>{item.teacherEmail}</TableCell>
                                    <TableCell className="text-green-600 font-semibold">
                                        {item.totalPaid.toLocaleString()}đ
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.totalUnpaid > 0 ? "destructive" : "secondary"} className="text-sm">
                                            {item.totalUnpaid.toLocaleString()}đ
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.totalUnpaid > 0 ? (
                                            <Button
                                                size="sm"
                                                onClick={() => handlePay(item.teacherId, item.totalUnpaid)}
                                                disabled={payMutation.isPending}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <DollarSign className="w-4 h-4 mr-1" /> Xác nhận đã trả
                                            </Button>
                                        ) : (
                                            <span className="text-gray-400 flex items-center justify-end gap-1">
                                                <CheckCircle className="w-4 h-4" /> Hoàn tất
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {payouts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Chưa có dữ liệu doanh thu.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}