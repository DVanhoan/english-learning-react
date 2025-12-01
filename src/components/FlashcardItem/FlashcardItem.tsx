import { Link } from "react-router-dom";
import { BookOpen, Users, Play, Bookmark, Star } from "lucide-react";
import { Button } from "../ui/button";
import routes from "@/routes/routes.const";
import type { FlashcardSet } from "@/types/flashcard.type"; // Import type chuẩn

interface FlashcardItemProps {
  flashcard: FlashcardSet; // Sử dụng FlashcardSet thay vì interface tự định nghĩa
  viewMode?: "grid" | "list";
}

export default function FlashcardItem({
  flashcard,
  viewMode = "grid",
}: FlashcardItemProps) {

  // --- VIEW DANH SÁCH (LIST) ---
  if (viewMode === "list") {
    return (
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex">
        {/* Bookmark góc phải */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow transition-colors duration-200 hover:bg-green-700 [&:hover>svg]:text-white z-10">
          <Bookmark
            size={18}
            className="text-gray-600 transition-colors duration-200"
          />
        </button>

        {/* Thumbnail bên trái cho List View */}
        <div className="w-48 h-auto relative overflow-hidden">
          <img
            src={flashcard.thumbnailUrl || "/placeholder.svg"}
            alt={flashcard.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-2 flex flex-col justify-between">
          <div>
            {/* Author */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src={flashcard.author.avatarUrl || "/images/student.png"}
                alt={flashcard.author.fullName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white shadow-sm"
              />
              <div className="text-xs text-primary-color font-medium">
                {flashcard.author.fullName}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 transition-colors duration-300 group-hover:text-primary-color">
              <Link to={`${routes.FLASHCARD_DETAIL.replace(":id", String(flashcard.id))}`}>
                {flashcard.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {flashcard.description}
            </p>
          </div>

          {/* Meta + Học ngay */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <BookOpen size={14} className="text-blue-500" />
                <span>{flashcard.cardCount} thẻ</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} className="text-purple-500" />
                <span>{flashcard.studyCount?.toLocaleString() || 0} học viên</span>
              </div>
            </div>

            <Button
              size="sm"
              className="bg-primary-color text-white font-medium px-3 py-1 rounded-lg shadow hover:bg-hover-primary-color transition-all whitespace-nowrap"
              asChild
            >
              <Link
                to={`${routes.FLASHCARD_DETAIL.replace(":id", String(flashcard.id))}`}
              >
                <Play size={14} className="mr-1" />
                Học ngay
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW LƯỚI (GRID) ---
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
      {/* Bookmark góc phải */}
      <button className="absolute top-3 right-3 p-2 rounded-full bg-white shadow transition-colors duration-200 hover:bg-green-700 [&:hover>svg]:text-white z-10">
        <Bookmark
          size={18}
          className="text-gray-600 transition-colors duration-200"
        />
      </button>

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Link to={`${routes.FLASHCARD_DETAIL.replace(":id", String(flashcard.id))}`}>
          <img
            src={flashcard.thumbnailUrl || "/placeholder.svg"}
            alt={flashcard.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
          {flashcard.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 flex flex-col flex-1">
        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src={flashcard.author.avatarUrl || "/images/student.png"}
            alt={flashcard.author.fullName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow"
          />
          <div className="leading-tight">
            <div className="text-sm text-primary-color font-bold line-clamp-1">
              {flashcard.author.fullName}
            </div>
            <div className="text-xs text-gray-500">Tác giả</div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 transition-colors duration-300 group-hover:text-primary-color min-h-[3.5rem]">
          <Link to={`${routes.FLASHCARD_DETAIL.replace(":id", String(flashcard.id))}`}>
            {flashcard.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1">
          {flashcard.description}
        </p>

        {/* Meta + Học ngay */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Số lượng thẻ">
              <BookOpen size={14} className="text-blue-500" />
              <span className="text-xs font-medium">{flashcard.cardCount}</span>
            </div>
            <div className="flex items-center gap-1" title="Số người học">
              <Users size={14} className="text-purple-500" />
              <span className="text-xs font-medium">{flashcard.studyCount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1" title="Đánh giá">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium">{flashcard.rating?.toFixed(1) || 0.0}</span>
            </div>
          </div>

          <Button
            size="sm"
            className="bg-primary-color text-white font-medium px-3 py-1 rounded-lg shadow hover:bg-hover-primary-color transition-all whitespace-nowrap h-8"
            asChild
          >
            <Link
              to={`${routes.FLASHCARD_DETAIL.replace(":id", String(flashcard.id))}`}
            >
              <Play size={14} className="mr-1" />
              Học
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}