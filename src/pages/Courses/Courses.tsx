import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  BookOpen,
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import CourseItem from "@/components/CourseItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CategoriesCourseApi } from "@/api/categoriesCourse.api";
import { useSearchParams } from "react-router-dom";
import { CourseApi } from "@/api/course.api";
import Pagination from "@/components/Pagination/Pagination";
import CourseItemSkeleton from "@/components/Skeleton/CourseItemSkeleton";
import { toast } from "react-toastify";

const sortOptions = [
  { value: "default", label: "Mặc định" },
  { value: "createdAt:desc", label: "Mới nhất" },
  { value: "createdAt:asc", label: "Cũ nhất" },
  { value: "updatedAt:desc", label: "Cập nhật mới" },
  { value: "title:asc", label: "Tên A-Z" },
  { value: "title:desc", label: "Tên Z-A" },
  { value: "price:asc", label: "Giá thấp đến cao" },
  { value: "price:desc", label: "Giá cao đến thấp" },
  { value: "discountPrice:asc", label: "Giảm giá thấp-cao" },
  { value: "discountPrice:desc", label: "Giảm giá cao-thấp" },
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 9;
  const keywordParam = searchParams.get("keyword") || "";
  const categoryParam = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : 0;
  const sortsParam = searchParams.get("sorts") || "";

  const prevPageRef = useRef<number>(pageNumber);
  const prevCategoryRef = useRef<number>(categoryParam || 0);
  const disableEntryAnimation =
    prevPageRef.current !== pageNumber ||
    prevCategoryRef.current !== (categoryParam || 0);

  useEffect(() => {
    prevPageRef.current = pageNumber;
    prevCategoryRef.current = categoryParam || 0;
  }, [pageNumber, categoryParam]);

  useEffect(() => {
    setSearchTerm(keywordParam);
    setSelectedCategory(categoryParam || 0);
    setSortBy(sortsParam || "default");
  }, [keywordParam, categoryParam, sortsParam]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-course"],
    queryFn: () => CategoriesCourseApi.getCategories(1, 1000000, "", ""),
    placeholderData: keepPreviousData,
  });

  const { data: coursesData, isInitialLoading } = useQuery({
    queryKey: [
      "courses-public",
      pageNumber,
      pageSize,
      keywordParam,
      sortsParam,
      categoryParam,
    ],
    queryFn: () =>
      CourseApi.getPublic(
        pageNumber,
        pageSize,
        keywordParam,
        sortsParam || undefined,
        categoryParam || undefined,
        undefined
      ).catch((error) => {
        toast.error("Tải danh sách khóa học thất bại");
        throw error;
      }),
    placeholderData: keepPreviousData,
  });


  const applyFilters = (values: {
    keyword?: string;
    categoryId?: number;
    sorts?: string;
  }) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("pageNumber");
      const kw = (values.keyword ?? searchTerm).trim();
      if (kw) newParams.set("keyword", kw);
      else newParams.delete("keyword");
      if (values.categoryId && values.categoryId > 0)
        newParams.set("categoryId", String(values.categoryId));
      else newParams.delete("categoryId");
      if (values.sorts && values.sorts !== "default")
        newParams.set("sorts", values.sorts);
      else newParams.delete("sorts");
      return newParams;
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>

        {/* Animated shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Geometric patterns */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-blue-200/30 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-purple-200/30 rounded-full animate-spin-reverse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r bg-primary-color text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative main-layout">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Khám phá các khóa học
              <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                tiếng Anh
              </span>
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-slide-up">
              Khám phá các khóa học chất lượng cao từ các giảng viên hàng đầu
            </p>

            {/* Search Bar */}
            <div
              className="relative max-w-2xl animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyFilters({
                    keyword: searchTerm,
                    categoryId: selectedCategory,
                    sorts: sortBy,
                  });
                }}
              >
                <Input
                  type="text"
                  placeholder="Tìm kiếm khóa học, giảng viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-[16px] bg-white/95 backdrop-blur-sm text-gray-900 border-0 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300"
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="relative main-layout py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <Card className="sticky top-8 glass-effect border-white/20 shadow-xl">
              <CardContent className="lg:p-6">
                <div className="flex items-center justify-between lg:mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary-color" />
                    Bộ lọc
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden hover:bg-white/50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                    <ChevronDown
                      className={`h-4 w-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""
                        }`}
                    />
                  </Button>
                </div>

                <div
                  className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"
                    }`}
                >
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium mt-7 lg:mt-0 mb-3">Danh mục</h4>
                    <button
                      key={0}
                      onClick={() => {
                        setSelectedCategory(0);
                        applyFilters({
                          keyword: searchTerm,
                          categoryId: 0,
                          sorts: sortBy,
                        });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === 0
                        ? "bg-primary-color text-white shadow-md"
                        : "hover:bg-white/50 hover:shadow-sm"
                        }`}
                    >
                      Tất cả
                    </button>
                    <div className="space-y-2">
                      {categoriesData?.data.items.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            applyFilters({
                              keyword: searchTerm,
                              categoryId: category.id,
                              sorts: sortBy,
                            });
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === category.id
                            ? "bg-primary-color text-white shadow-md"
                            : "hover:bg-white/50 hover:shadow-sm"
                            }`}
                        >
                          {category.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full bg-white/50 border-white/30 hover:bg-white/70 cursor-pointer transition-all duration-300"
                    onClick={() => {
                      setSelectedCategory(0);
                      setSearchTerm("");
                      setSortBy("default");
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete("keyword");
                        newParams.delete("categoryId");
                        newParams.delete("sorts");
                        newParams.delete("pageNumber");
                        return newParams;
                      });
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 flex-wrap">
              {/* Left side */}
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {coursesData?.data.numberOfElements ?? 0} khóa học
                  </h2>
                </div>
                {keywordParam && (
                  <p className="text-gray-600 mt-1">
                    Kết quả tìm kiếm cho "{keywordParam}"
                  </p>
                )}
              </div>

              {/* Right side */}
              <div className="flex flex-wrap items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center bg-white/70 rounded-lg p-1 shadow-sm flex-shrink-0">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 ${viewMode === "grid"
                      ? "bg-primary-color text-white shadow-sm"
                      : "hover:bg-white/50"
                      }`}
                  >
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 ${viewMode === "list"
                      ? "bg-primary-color text-white shadow-sm"
                      : "hover:bg-white/50"
                      }`}
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>

                {/* Sort (whitelist) */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    Sắp xếp:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => {
                      setSortBy(v);
                      applyFilters({
                        keyword: searchTerm,
                        categoryId: selectedCategory,
                        sorts: v,
                      });
                    }}
                  >
                    <SelectTrigger className="w-48 bg-white/70 border-white/30">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory !== 0 && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 bg-white/70 hover:bg-white/90 transition-colors"
                >
                  {
                    categoriesData?.data.items.find(
                      (c) => c.id === selectedCategory
                    )?.title
                  }
                  <button
                    onClick={() => {
                      setSelectedCategory(0);
                      applyFilters({
                        keyword: searchTerm,
                        categoryId: 0,
                        sorts: sortBy,
                      });
                    }}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {keywordParam && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 bg-white/70 hover:bg-white/90 transition-colors"
                >
                  "{keywordParam}"
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete("keyword");
                        newParams.delete("pageNumber");
                        return newParams;
                      });
                    }}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>

            {/* Course Grid/List */}
            {isInitialLoading ? (
              <div
                className={`transition-all duration-500 ${viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                  }`}
              >
                {Array.from({ length: viewMode === "grid" ? 6 : 3 }).map(
                  (_, i) => (
                    <div key={`skeleton-${i}`}>
                      <CourseItemSkeleton />
                    </div>
                  )
                )}
              </div>
            ) : coursesData?.data.items && coursesData.data.items.length > 0 ? (
              <div
                className={`transition-all duration-500 ${viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                  }`}
              >
                {coursesData.data.items.map((course, index) => (
                  <div
                    key={course.id}
                    className={
                      disableEntryAnimation ? undefined : "animate-fade-in"
                    }
                    style={
                      disableEntryAnimation
                        ? undefined
                        : { animationDelay: `${index * 0.1}s` }
                    }
                  >
                    <CourseItem course={course} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Không tìm thấy khóa học nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(0);
                    setSortBy("default");
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.delete("keyword");
                      newParams.delete("categoryId");
                      newParams.delete("sorts");
                      newParams.delete("pageNumber");
                      return newParams;
                    });
                  }}
                  className="bg-primary-color hover:bg-hover-primary-color"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}

            {/* Pagination */}
            {coursesData?.data && coursesData.data.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  totalPages={coursesData.data.totalPages}
                  pageParamName="pageNumber"
                  maxVisiblePages={5}
                  activeButtonClassName="bg-primary-color text-white hover:bg-hover-primary-color hover:text-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
