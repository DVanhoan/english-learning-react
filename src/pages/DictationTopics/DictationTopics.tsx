import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import TopicDictationCard from "@/components/TopicDictationCard";
import { useQuery } from "@tanstack/react-query"; // Import hook
import { DictationApi } from "@/api/dictation.api"; // Import API
import type { DictationTopic } from "@/types/dictation.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom"; // Thêm Link để bọc Card

export default function DictationTopics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả trình độ");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả độ khó");
  const [showFilters, setShowFilters] = useState(false);

  // --- GỌI API LẤY DANH SÁCH CHỦ ĐỀ ---
  const { data: topicsData, isLoading } = useQuery({
    queryKey: ["dictation-topics"],
    queryFn: DictationApi.getAllTopics,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });

  const topics = topicsData?.data ?? [];

  // --- LỌC DỮ LIỆU Ở CLIENT ---
  const filteredTopics = topics.filter((topic: DictationTopic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Logic filter theo Level (cần khớp với dữ liệu backend trả về)
    // Ví dụ backend trả về levelRange là "A1-B1"
    const matchesLevel =
      selectedLevel === "Tất cả trình độ" ||
      (topic.levelRange && topic.levelRange.includes(selectedLevel));

    // Logic filter theo Difficulty
    // Ví dụ backend trả về difficulty là "Easy"
    // Bạn cần map giá trị tiếng Việt "Dễ" sang "Easy" hoặc ngược lại
    let difficultyValue = selectedDifficulty;
    if (selectedDifficulty === "Dễ") difficultyValue = "Easy";
    if (selectedDifficulty === "Trung bình") difficultyValue = "Medium";
    if (selectedDifficulty === "Khó") difficultyValue = "Hard";

    const matchesDifficulty =
      selectedDifficulty === "Tất cả độ khó" ||
      topic.difficulty === difficultyValue;

    return matchesSearch && matchesLevel && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r bg-primary-color text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative main-layout">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Chủ đề nghe chính tả
              <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                Luyện tập & Cải thiện
              </span>
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-slide-up">
              Hãy chọn trong {topics.length} chủ đề nghe chính tả
              để cải thiện kỹ năng nghe và viết của bạn
            </p>

            {/* Ô tìm kiếm */}
            <div
              className="relative max-w-2xl animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-[16px] bg-white/95 backdrop-blur-sm text-gray-900 border border-gray-300 rounded-xl shadow-md focus:border-primary-color focus:ring-2 focus:ring-primary-color/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="relative main-layout py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80">
            <Card className="sticky top-8 bg-white/80 border border-gray-300 shadow-xl rounded-xl">
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
                    className="lg:hidden hover:bg-gray-100"
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
                  {/* Trình độ */}
                  <div>
                    <h4 className="font-medium mt-7 lg:mt-0 mb-3">Trình độ</h4>
                    <Select
                      value={selectedLevel}
                      onValueChange={setSelectedLevel}
                    >
                      <SelectTrigger className="bg-white/70 border border-gray-300 focus:border-primary-color focus:ring-2 focus:ring-primary-color/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tất cả trình độ">
                          Tất cả trình độ
                        </SelectItem>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="C1">C1</SelectItem>
                        <SelectItem value="C2">C2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Độ khó */}
                  <div>
                    <h4 className="font-medium mb-3">Độ khó</h4>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger className="bg-white/70 border border-gray-300 focus:border-primary-color focus:ring-2 focus:ring-primary-color/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tất cả độ khó">
                          Tất cả độ khó
                        </SelectItem>
                        <SelectItem value="Dễ">Dễ</SelectItem>
                        <SelectItem value="Trung bình">Trung bình</SelectItem>
                        <SelectItem value="Khó">Khó</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Xóa lọc */}
                  <Button
                    variant="outline"
                    className="w-full bg-white/70 border border-gray-300 hover:bg-white/90 transition-all duration-300"
                    onClick={() => {
                      setSelectedLevel("Tất cả trình độ");
                      setSelectedDifficulty("Tất cả độ khó");
                      setSearchTerm("");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danh sách chủ đề */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {filteredTopics.length} chủ đề được tìm thấy
                </h2>
                {searchTerm && (
                  <p className="text-gray-600">
                    Kết quả tìm kiếm cho "{searchTerm}"
                  </p>
                )}
              </div>
            </div>

            {filteredTopics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/dictation/topics/${topic.id}/lessons`}>
                      <TopicDictationCard topic={topic} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Không tìm thấy chủ đề nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Hãy thử thay đổi từ khóa hoặc bộ lọc
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLevel("Tất cả trình độ");
                    setSelectedDifficulty("Tất cả độ khó");
                  }}
                  className="bg-primary-color hover:bg-hover-primary-color"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}