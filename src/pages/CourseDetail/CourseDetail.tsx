import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CoursePreviewModal from "@/components/CoursePreviewModal";
import routes from "@/routes/routes.const";
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Globe,
  Play,
  Lock,
  StarHalf,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Course } from "@/types/course.type";
import { CourseApi } from "@/api/course.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dayjs from "dayjs";
import type { Chapter } from "@/types/chapter.type";
import { AppUtils } from "@/utils/appUtils";
import type { Lesson } from "@/types/lesson.type";
import type { Rating, RatingRequest } from "@/types/rating.type";
import { RatingApi } from "@/api/ratingcourse.api";
import { CartApi } from "@/api/cart.api";
import { PaymentApi } from "@/api/payment.api";
import useAuth from "@/context/AuthContext";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



const reviewFormSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung không được để trống")
    .max(500, "Nội dung không được vượt quá 500 ký tự"),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    message: "Vui lòng chọn số sao",
  }),
});

export default function CourseDetail() {
  const { slug } = useParams();
  const [isOpenModalPreview, setOpenModalPreview] = useState<boolean>(false);
  const [preview, setPreview] = useState<{
    title?: string;
    videoSrc?: string;
    poster?: string;
  } | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    state: { isAuthenticated },
  } = useAuth();

  const { data: courseData } = useQuery<Course | null>({
    queryKey: ["courses", "details", slug],
    queryFn: async () => {
      if (!slug) return null;
      return await CourseApi.getDetails(String(slug));
    },
    enabled: !!slug,
  });

  const courseId = courseData?.id;

  const averageRating = courseData?.averageRating ?? 0;
  const ratingCount = courseData?.ratingCount ?? 0;

  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["ratings", courseId],
    queryFn: () => {
      if (!courseId) return null;
      return RatingApi.getRatingsByCourse(courseId, 1, 10);
    },
    enabled: !!courseId,
  });
  const reviews = reviewsData?.data.items ?? [];

  const buyNowMutation = useMutation({
    mutationFn: (courseId: number) => PaymentApi.createPayment({ courseId }),
    onSuccess: (response) => {
      // Chuyển hướng người dùng đến cổng VNPAY
      window.location.href = response.data.paymentUrl;
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Tạo thanh toán thất bại");
    },
  });

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Thêm kiểm tra đăng nhập
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để mua khóa học");
      navigate(routes.SIGN_IN);
      return;
    }

    buyNowMutation.mutate(courseId);
  };



  const addToCartMutation = useMutation({
    mutationFn: (courseId: number) => CartApi.addToCart({ courseId }),
    onSuccess: () => {
      toast.success("Đã thêm vào giỏ hàng!");
      queryClient.invalidateQueries({ queryKey: ["cart", "me"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      let errorMessage = error.response?.data?.message || "Thêm thất bại";

      if (error.response?.data?.status === 40009) {
        errorMessage = "Khóa học này đã có trong giỏ hàng của bạn!";
        toast.info(errorMessage);

        navigate(routes.CART);
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (data: RatingRequest) => RatingApi.createOrUpdateRating(data),
    onSuccess: () => {
      toast.success("Gửi đánh giá thành công!");
      reviewForm.reset();
      queryClient.invalidateQueries({ queryKey: ["ratings", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses", "details", slug] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!courseId) return;

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate(routes.SIGN_IN);
      return;
    }

    addToCartMutation.mutate(courseId);
  };

  const reviewForm = useForm<z.infer<typeof reviewFormSchema>>({
    defaultValues: {
      content: "",
      rating: "5",
    },
    resolver: zodResolver(reviewFormSchema),
  });

  const handleSubmitReviewForm = (data: z.infer<typeof reviewFormSchema>) => {
    if (!courseId) return;

    const requestData: RatingRequest = {
      courseId: courseId,
      rating: parseInt(data.rating, 10),
      message: data.content,
    };
    reviewMutation.mutate(requestData);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => {
        if (index < Math.floor(rating))
          return (
            <>
              <Star
                key={index}
                className="h-4 w-4 text-yellow-400 fill-yellow-400"
              />
            </>
          );
        else if (index === Math.floor(rating)) {
          if (rating - Math.floor(rating) > 0) {
            return (
              <>
                <StarHalf
                  key={index}
                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                />
              </>
            );
          } else return <Star key={index} className="h-4 w-4 text-gray-300" />;
        } else return <Star key={index} className="h-4 w-4 text-gray-300" />;
      });
  };

  const handlePreviewLecture = (lecture?: Lesson) => {
    const videoSrc = lecture?.videoUrl ?? "";
    const poster = courseData?.thumbnailUrl ?? undefined;
    setPreview({ title: lecture?.title, videoSrc, poster });
    setOpenModalPreview(true);
  };

  const getDiscountPercent = () => {
    if (!courseData || !courseData.price || courseData.price === 0) {
      return 0;
    }
    const percent =
      100 - (courseData.discountPrice / courseData.price) * 100;
    return percent.toFixed(0);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="main-layout py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge className="bg-yellow-500 text-black mb-2">
                  Bestseller
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {courseData?.title ?? ""}
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  {courseData?.shortDescription ?? ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(averageRating)}</div>
                  <span className="font-semibold">{parseFloat(averageRating.toFixed(1))}</span>
                  <span className="text-gray-300">({ratingCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>100 học viên</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span>Được tạo bởi</span>
                <a
                  href="#"
                  className="text-blue-400 hover:underline font-semibold"
                >
                  {courseData?.teacher.fullName}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{"—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Cập nhật lần cuối{" "}
                    {dayjs(courseData?.updatedAt).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Preview Card - Mobile */}
            <div className="lg:hidden">
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={courseData?.thumbnailUrl ?? "/placeholder.svg"}
                      alt={courseData?.title ?? ""}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-3xl font-bold">
                          {(courseData?.discountPrice ?? 0).toLocaleString()}đ
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {(courseData?.price ?? 0).toLocaleString()}đ
                        </span>
                      </div>
                      <Badge variant="destructive" className="text-sm">
                        Giảm{" "}
                        {(
                          100 -
                          (courseData?.discountPrice / courseData?.price) * 100
                        ).toFixed(0)}
                        %
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-primary-color hover:bg-hover-primary-color cursor-pointer"
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={addToCartMutation.isPending}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent cursor-pointer"
                        size="lg"
                        onClick={handleBuyNow}
                        disabled={buyNowMutation.isPending}
                      >
                        {buyNowMutation.isPending ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <CreditCard size={16} className="mr-2" />
                        )}
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="main-layout py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <Card>
              <CardHeader>
                <CardTitle>Bạn sẽ học được gì</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: courseData?.learningOutcomes ?? "",
                  }}
                />
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Nội dung khóa học</CardTitle>
                <div className="text-sm text-gray-600">
                  {courseData?.chaptersDetails?.length ?? 0} phần •{" "}
                  {courseData?.numberOfLessons ?? 0} bài giảng •{" "}
                  {AppUtils.formatTime(courseData?.duration)} tổng thời lượng
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {(courseData?.chaptersDetails ?? []).map(
                  (chapter: Chapter, index: number) => (
                    <>
                      <Accordion key={index} type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="cursor-pointer hover:bg-slate-100 px-6 border border-primary-color hover:no-underline rounded-none">
                            <div className="">
                              <p className="text-[16px] font-semibold">
                                {chapter.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                {chapter.numberOfLessons} bài giảng •{" "}
                                {AppUtils.formatTime(chapter.duration)}
                              </p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-slate-200">
                              {(chapter.lessonsDetails ?? []).map(
                                (lecture: Lesson, lectureIndex: number) => (
                                  <div
                                    key={lectureIndex}
                                    className="flex items-center justify-between p-4 border-t border-t-gray-300"
                                  >
                                    <div className="flex items-center gap-3">
                                      {lecture.isPreview ? (
                                        <button
                                          onClick={() =>
                                            handlePreviewLecture(lecture)
                                          }
                                          className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
                                        >
                                          <Play className="h-4 w-4 text-blue-500" />
                                          <span className="text-sm">
                                            {lecture.title}
                                          </span>
                                        </button>
                                      ) : (
                                        <>
                                          <Lock className="h-4 w-4 text-gray-400" />
                                          <span className="text-sm">
                                            {lecture.title}
                                          </span>
                                        </>
                                      )}
                                      {lecture?.isPreview && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Xem trước
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      {AppUtils.formatTime(lecture.duration)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </>
                  )
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Yêu cầu</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  dangerouslySetInnerHTML={{
                    __html: courseData?.requirements ?? "",
                  }}
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {courseData?.detailDescription ?? ""}
                </p>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Giảng viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={courseData?.teacher?.avatarUrl}
                      alt="User"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {courseData?.teacher?.fullName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">
                      {courseData?.teacher?.fullName ?? ""}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>1000 học viên</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>1000 khóa học</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Đánh giá của học viên</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex">{renderStars(averageRating)}</div>
                  <div className="text-2xl font-bold">
                    {parseFloat(averageRating.toFixed(1))}
                  </div>
                  <span className="text-gray-600">
                    {ratingCount} đánh giá
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form review */}
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Form {...reviewForm}>
                      <form
                        onSubmit={reviewForm.handleSubmit(handleSubmitReviewForm)}
                        className="space-y-4"
                      >
                        <FormField
                          control={reviewForm.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#295779]">
                                Số sao{" "}
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-red-500 -ml-1.5">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">
                                    1{" "}
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </SelectItem>
                                  <SelectItem value="2">
                                    2{" "}
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </SelectItem>
                                  <SelectItem value="3">
                                    3{" "}
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </SelectItem>
                                  <SelectItem value="4">
                                    4{" "}
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </SelectItem>
                                  <SelectItem value="5">
                                    5{" "}
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={reviewForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Viết đánh giá của bạn..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          variant="outline"
                          className="bg-primary-color text-white hover:bg-hover-primary-color hover:text-white cursor-pointer"
                        >
                          Gửi đánh giá
                        </Button>
                      </form>
                    </Form>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-100 rounded-md">
                    <p>
                      Vui lòng{" "}
                      <Link
                        to={routes.SIGN_IN} // Giả sử bạn có routes
                        className="font-semibold text-primary-color hover:underline"
                      >
                        đăng nhập
                      </Link>{" "}
                      để để lại đánh giá.
                    </p>
                  </div>
                )}

                {isLoadingReviews && <p>Đang tải đánh giá...</p>}

                {!isLoadingReviews && reviews.length === 0 && (
                  <p className="text-gray-500 text-center">Chưa có đánh giá nào cho khóa học này.</p>
                )}

                {/* List reviews */}
                {reviews.map((review: any) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={review.author.avatarUrl}
                        alt="User"
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {review.author.fullName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold">{review.author.fullName}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">
                          {dayjs(review.createdAt).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.message}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  Xem tất cả đánh giá
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="top-8">
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={courseData?.thumbnailUrl || "/placeholder.svg"}
                      alt={courseData?.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-3xl font-bold">
                          {courseData?.discountPrice.toLocaleString()}đ
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {courseData?.price.toLocaleString()}đ
                        </span>
                      </div>
                      <Badge variant="destructive" className="text-sm">
                        Giảm {getDiscountPercent()}%
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      <Button
                        className="w-full bg-primary-color hover:bg-hover-primary-color cursor-pointer"
                        size="lg"
                        onClick={handleAddToCart}
                        disabled={addToCartMutation.isPending}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent cursor-pointer"
                        size="lg"
                        onClick={handleBuyNow}
                        disabled={buyNowMutation.isPending}
                      >
                        {buyNowMutation.isPending ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <CreditCard size={16} className="mr-2" />
                        )}
                        Mua ngay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Preview Modal */}
      <CoursePreviewModal
        isOpen={isOpenModalPreview}
        setOpen={setOpenModalPreview}
        courseTitle={preview?.title ?? courseData?.title}
        videoSrc={preview?.videoSrc ?? ""}
        videoPoster={preview?.poster ?? courseData?.thumbnailUrl}
      />
    </div>
  );
}
