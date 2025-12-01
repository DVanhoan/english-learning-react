import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Loader2 } from "lucide-react";
import CourseItem from "@/components/CourseItem";
import DynamicPagination from "@/components/DynamicPagination";
import { useQuery } from "@tanstack/react-query";
import { EnrollmentApi } from "@/api/enrollment.api";
import useAuth from "@/context/AuthContext";
import { Link } from "react-router-dom";
import routes from "@/routes/routes.const";

export default function MyCourses() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const { state: { isAuthenticated } } = useAuth();

    const { data: enrollmentData, isLoading } = useQuery({
        queryKey: ["my-courses", page, searchTerm],
        queryFn: () => EnrollmentApi.getMyEnrollments({
            pageNumber: page,
            pageSize: pageSize,
            keyword: searchTerm
        }),
        enabled: isAuthenticated,
    });

    console.log("Enrollment Data:", enrollmentData);

    const courses = enrollmentData?.data.items ?? [];
    const totalPages = enrollmentData?.data.totalPages ?? 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Bạn chưa đăng nhập</h2>
                <Button asChild><Link to={routes.SIGN_IN}>Đăng nhập ngay</Link></Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="pt-8">
                <div className="main-layout">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Khóa học của tôi</h1>
                    <p className="text-gray-600">Quản lý và theo dõi tiến độ học tập của bạn</p>
                </div>
            </div>

            <div className="main-layout py-8">
                {/* Search Bar */}
                <div className="flex justify-end ">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm khóa học của bạn..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="pl-10 bg-white"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
                    </div>
                ) : (
                    <>
                        {courses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="animate-fade-in">
                                        <CourseItem course={course} isEnrolled={true} viewMode="grid" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                                <div className="flex justify-center mb-4">
                                    <BookOpen className="h-16 w-16 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">Bạn chưa đăng ký khóa học nào</h3>
                                <p className="text-gray-500 mb-6">Hãy khám phá các khóa học hấp dẫn ngay!</p>
                                <Button asChild className="bg-primary-color hover:bg-hover-primary-color">
                                    <Link to={routes.COURSES}>Khám phá khóa học</Link>
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <DynamicPagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}