import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Bookmark,
  Users,
  FileText,
  Clock,
  CreditCard,
  Loader2,
  PlayCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import type { Course } from "@/types/course.type";
import { AppUtils } from "@/utils/appUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartApi } from "@/api/cart.api";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import useAuth from "@/context/AuthContext";
import routes from "@/routes/routes.const";
import { Badge } from "../ui/badge";


function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);



  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
      ))}
      {halfStar && <Star size={14} className="text-amber-500 fill-amber-300" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={i} size={14} className="text-gray-300" />
      ))}
    </div>
  );
}

interface CourseItemProps {
  course: Course;
  viewMode?: "grid" | "list";
  isEnrolled?: boolean;
}

export default function CourseItem({ course, viewMode = "grid", isEnrolled = false }: CourseItemProps) {
  const rating = course.averageRating ?? 0;
  const ratingCount = course.ratingCount ?? 0;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    state: { isAuthenticated },
  } = useAuth();

  const addToCartMutation = useMutation({
    mutationFn: (courseId: number) => CartApi.addToCart({ courseId }),
    onSuccess: () => {
      toast.success("Đã thêm vào giỏ hàng!");
      queryClient.invalidateQueries({ queryKey: ["cart", "me"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data?.status === 40009) {
        toast.info("Khóa học này đã có trong giỏ hàng!");
        navigate(routes.CART);
      } else {
        toast.error(error.response?.data?.message || "Thêm thất bại");
      }
    },
  });


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate(routes.SIGN_IN);
      return;
    }

    addToCartMutation.mutate(course.id);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để mua khóa học");
      navigate(routes.SIGN_IN);
      return;
    }

    navigate("/checkout", { state: { courseIds: [course.id] } });
  };

  const handleStartLearning = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/courses/${course.id}/video-lessons/${course.firstLessonId}`);
  };

  const renderActions = () => {
    if (isEnrolled) {
      return (
        <Button
          size="sm"
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
          onClick={handleStartLearning}
        >
          <PlayCircle size={16} className="mr-2" />
          Vào học ngay
        </Button>
      );
    }

    return (
      <div className="flex gap-2 sm:flex-row flex-col w-full sm:w-auto">
        <Button
          size="sm"
          className="bg-primary-color text-white font-medium px-3 py-1 rounded-lg shadow hover:bg-hover-primary-color w-full sm:w-auto"
          onClick={handleBuyNow}
        >
          <CreditCard size={14} className="mr-1" />
          Mua ngay
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-50 w-full sm:w-auto"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
        >
          {addToCartMutation.isPending ? (
            <Loader2 size={14} className="mr-1 animate-spin" />
          ) : (
            <ShoppingCart size={14} className="mr-1" />
          )}
          Giỏ hàng
        </Button>
      </div>
    );
  };

  if (viewMode === "list") {
    return (
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row h-full">
        <div className="relative w-full sm:w-56 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
          <Link to={`/courses/${course.id}`}>
            <img
              src={course.thumbnailUrl || "/placeholder.svg"}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
            {ratingCount > 1 ? (
              <>
                {renderStars(rating)}
                <span className="text-sm font-semibold text-gray-900">
                  {parseFloat(rating.toFixed(1))}
                </span>
                <span className="text-xs text-gray-600">({ratingCount})</span>
              </>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 text-xs font-semibold">Mới</Badge>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={course.teacher?.avatarUrl || "/images/student.png"}
                alt={course.teacher?.fullName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white shadow-sm"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src.endsWith("/images/student.png")) return;
                  img.onerror = null;
                  img.src = "/images/student.png";
                }}
              />
              <div className="text-xs text-primary-color font-medium">
                {course.teacher?.fullName}
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-900 line-clamp-2 min-w-0">
              <Link
                to={`/courses/${course.id}`}
                className="hover:text-primary-color"
              >
                {course.title}
              </Link>
            </h3>

            <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap min-w-0">
              <div className="flex items-center gap-2">
                <FileText size={12} className="text-blue-500" />
                <span>{course.numberOfLessons} bài học</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={12} className="text-purple-500" />
                <span>{245} học viên</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-gray-400" />
                <span>{AppUtils.formatTime(course.duration)}</span>
              </div>
            </div>

            <div className="mt-2 pt-2">
              {renderActions()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Link to={`/courses/${course.id}`}>
          <img
            src={course.thumbnailUrl || "/placeholder.svg"}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        </Link>
        <div className="absolute left-4 top-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
          {ratingCount > 0 ? (
            <>
              {renderStars(rating)}
              <span className="text-sm font-semibold text-gray-900">
                {parseFloat(rating.toFixed(1))}
              </span>
              <span className="text-xs text-gray-600">({ratingCount})</span>
            </>
          ) : (
            <Badge className="bg-blue-100 text-blue-800 text-xs font-semibold">Mới</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/90 shadow text-gray-700 hover:bg-primary-color hover:text-white transition-colors"
        >
          <Bookmark size={18} />
        </Button>
      </div>

      <div className="p-5 space-y-3 flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <img
            src={course.teacher?.avatarUrl || "/images/student.png"}
            alt={course.teacher?.fullName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.endsWith("/images/student.png")) return;
              img.onerror = null;
              img.src = "/images/student.png";
            }}
          />
          <div>
            <div className="text-sm text-primary-color font-bold">
              {course.teacher?.fullName}
            </div>
            <div className="text-xs text-gray-500">Chuyên gia</div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-w-0">
          <Link
            to={`/courses/${course.id}`}
            className="hover:text-primary-color"
          >
            {course.title}
          </Link>
        </h3>

        {/* === Info section reordered === */}
        <div className="flex items-center gap-3 text-sm text-gray-600 min-w-0 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-500" />
            <span>{course.numberOfLessons} bài học</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-purple-500" />
            <span>{245} học viên</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span>Thời lượng: {AppUtils.formatTime(course.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-3 flex-wrap">
          {!isEnrolled && (
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-xl font-extrabold text-gray-900">
                {course.discountPrice?.toLocaleString()}đ
              </span>
              <span className="text-sm text-gray-400 line-through">
                {course.price?.toLocaleString()}đ
              </span>
            </div>
          )}

          {isEnrolled && (
            <div className="text-sm text-green-600 font-medium flex-1">
              Đã sở hữu
            </div>
          )}

          <div className={isEnrolled ? "w-full" : ""}>
            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  );
}
