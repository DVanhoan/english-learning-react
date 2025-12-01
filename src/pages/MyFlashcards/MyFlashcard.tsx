"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import routes from "@/routes/routes.const";

interface Flashcard {
  id: string;
  title: string;
  description: string;
  category: string;
  cardCount: number;
  studyCount: number;
  rating: number;
  ratingCount: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  isPublic: boolean;
  thumbnail: string;
}

const mockMyFlashcards: Flashcard[] = [
  {
    id: "1",
    title: "1000 từ vựng tiếng Anh cơ bản",
    description:
      "Bộ từ vựng cơ bản nhất cho người mới bắt đầu học tiếng Anh, bao gồm các từ thường dùng hàng ngày.",
    category: "Từ vựng cơ bản",
    cardCount: 1000,
    studyCount: 15420,
    rating: 4.8,
    ratingCount: 2341,
    author: "Bạn",
    authorAvatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    createdAt: "2025-07-25",
    isPublic: true,
    thumbnail:
      "https://dinoenglish.app/_next/image?url=%2Fassets%2Fblog%2Ftu-tin-giao-tiep-tieng-anh-voi-3000-tu-vung-thong-dung-nhat.png&w=1920&q=75",
  },
  {
    id: "2",
    title: "Từ vựng TOEIC Part 1-7",
    description:
      "Tổng hợp từ vựng quan trọng cho tất cả các phần trong bài thi TOEIC, giúp bạn đạt điểm cao.",
    category: "TOEIC",
    cardCount: 800,
    studyCount: 8932,
    rating: 4.9,
    ratingCount: 1876,
    author: "Bạn",
    authorAvatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
    createdAt: "2025-07-20",
    isPublic: false,
    thumbnail:
      "https://dinoenglish.app/_next/image?url=%2Fassets%2Fblog%2Ftu-tin-giao-tiep-tieng-anh-voi-3000-tu-vung-thong-dung-nhat.png&w=1920&q=75",
  },
];

const categories = [
  "Tất cả",
  "Từ vựng cơ bản",
  "Từ vựng nâng cao",
  "TOEIC",
  "IELTS",
  "Giao tiếp",
];
const visibilityOptions = [
  { value: "all", label: "Tất cả" },
  { value: "public", label: "Công khai" },
  { value: "private", label: "Riêng tư" },
];
const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "popular", label: "Học nhiều nhất" },
];

export default function MyFlashcards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredFlashcards = mockMyFlashcards.filter((flashcard) => {
    const matchesSearch =
      flashcard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flashcard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || flashcard.category === selectedCategory;
    const matchesVisibility =
      selectedVisibility === "all" ||
      (selectedVisibility === "public" && flashcard.isPublic) ||
      (selectedVisibility === "private" && !flashcard.isPublic);

    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const sortedFlashcards = [...filteredFlashcards].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "popular":
        return b.studyCount - a.studyCount;
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleDeleteFlashcard = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bộ flashcard này?")) {
      console.log("Deleting flashcard:", id);
      // Implement actual delete logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary-color">
            Flashcard của tôi
          </h1>
          <Button
            className="bg-primary-color hover:bg-hover-primary-color"
            asChild
          >
            <Link to={routes.CREATE_FLASHCARD}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo flashcard mới
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm flashcard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn chủ đề" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedVisibility}
            onValueChange={setSelectedVisibility}
          >
            <SelectTrigger>
              <SelectValue placeholder="Hiển thị" />
            </SelectTrigger>
            <SelectContent>
              {visibilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Flashcards List */}
        {sortedFlashcards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 mb-4">
                Bạn chưa tạo bộ flashcard nào.
              </p>
              <Button
                className="bg-primary-color hover:bg-hover-primary-color"
                asChild
              >
                <Link to={routes.CREATE_FLASHCARD}>
                  Tạo bộ flashcard đầu tiên
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFlashcards.map((flashcard) => (
              <Card
                key={flashcard.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link
                  to={`${routes.FLASHCARD_DETAIL.replace(":id", flashcard.id)}`}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={flashcard.thumbnail || "/placeholder.svg"}
                      alt={flashcard.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className="bg-primary-color text-xs">
                      {flashcard.category}
                    </Badge>
                    <Badge
                      variant={flashcard.isPublic ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {flashcard.isPublic ? "Công khai" : "Riêng tư"}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-color">
                    <Link
                      to={`${routes.FLASHCARD_DETAIL.replace(
                        ":id",
                        flashcard.id
                      )}`}
                    >
                      {flashcard.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {flashcard.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={flashcard.authorAvatar || "/placeholder.svg"}
                      alt={flashcard.author}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">
                      {flashcard.author}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{flashcard.cardCount} thẻ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{flashcard.studyCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {renderStars(flashcard.rating)}
                      </div>
                      <span className="text-sm font-medium">
                        {flashcard.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({flashcard.ratingCount})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        asChild
                      >
                        <Link
                          to={`${routes.EDIT_FLASHCARD.replace(
                            ":id",
                            flashcard.id
                          )}`}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteFlashcard(flashcard.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
