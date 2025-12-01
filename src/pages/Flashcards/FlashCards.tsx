import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import routes from "@/routes/routes.const";
import FlashcardItem from "@/components/FlashcardItem";
import DynamicPagination from "@/components/DynamicPagination";
import { useQuery } from "@tanstack/react-query";
import { FlashcardApi } from "@/api/flashcard.api";
import useAuth from "@/context/AuthContext";

// Danh mục cứng (hoặc gọi API category nếu có)
const categories = ["Tất cả", "TOEIC", "IELTS", "Giao tiếp", "Kinh doanh", "Du lịch", "Công nghệ"];

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "popular", label: "Phổ biến nhất" },
];

export default function Flashcards() {
  const { state: { isAuthenticated } } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const pageSize = 9;

  // --- GỌI API ---
  const { data: flashcardData, isLoading } = useQuery({
    queryKey: ["flashcards", page, searchTerm, selectedCategory, sortBy],
    queryFn: () =>
      FlashcardApi.getAll({
        page,
        size: pageSize,
        keyword: searchTerm,
        category: selectedCategory === "Tất cả" ? undefined : selectedCategory,
        sort: sortBy,
      }),
    staleTime: 1000 * 60 * 2,
  });

  const flashcards = flashcardData?.data.items ?? [];
  const totalPages = flashcardData?.data.totalPages ?? 1;
  const totalElements = flashcardData?.data.numberOfElements ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset trang về 1 khi filter thay đổi
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Animated Background - Giữ nguyên */}
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
              Flashcard từ vựng <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">tiếng Anh</span>
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-slide-up">
              Học từ vựng hiệu quả với phương pháp Spaced Repetition
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm flashcard..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-12 pr-4 py-6 text-base bg-white text-gray-900 border-0 rounded-xl shadow-lg focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative main-layout py-8">
        <div className="flex flex-col gap-8">
          {/* Controls Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Danh sách bộ thẻ</h2>
              <p className="text-gray-500">Tìm thấy {totalElements} kết quả</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {isAuthenticated && (
                <Button asChild className="bg-primary-color hover:bg-hover-primary-color text-white">
                  <Link to={routes.CREATE_FLASHCARD}>
                    <Plus className="h-4 w-4 mr-2" /> Tạo bộ thẻ
                  </Link>
                </Button>
              )}

              <div className="flex items-center bg-white rounded-lg border p-1 shadow-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-primary-color text-white" : "text-gray-500"}
                >
                  <span className="sr-only">Grid</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" /><rect width="7" height="7" x="14" y="3" /><rect width="7" height="7" x="14" y="14" /><rect width="7" height="7" x="3" y="14" /></svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-primary-color text-white" : "text-gray-500"}
                >
                  <span className="sr-only">List</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 text-sm ${selectedCategory === cat ? "bg-primary-color hover:bg-hover-primary-color" : "bg-white hover:bg-gray-100"}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* LOADING STATE */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary-color" />
            </div>
          ) : (
            <>
              {flashcards.length > 0 ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {flashcards.map((flashcard) => (
                    <div key={flashcard.id} className="animate-fade-in">
                      <FlashcardItem flashcard={flashcard} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">Không tìm thấy bộ flashcard nào</h3>
                  <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  <Button variant="link" onClick={() => { setSearchTerm(""); setSelectedCategory("Tất cả") }} className="mt-2 text-primary-color">
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <DynamicPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}