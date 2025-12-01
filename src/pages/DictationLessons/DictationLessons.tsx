import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Loader2 } from "lucide-react";
import DictationLessonCard from "@/components/DictationLessonCard";
import { useQuery } from "@tanstack/react-query";
import { DictationApi } from "@/api/dictation.api";
import type { DictationLesson } from "@/types/dictation.type";


const groupLessons = (lessons: DictationLesson[]) => {
  const groups: Record<string, DictationLesson[]> = {};

  lessons.forEach(lesson => {
    const groupName = lesson.subtitle || "Danh sách bài học";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(lesson);
  });

  return Object.entries(groups).map(([title, lessons]) => ({
    id: title,
    title,
    lessonCount: lessons.length,
    lessons
  }));
};

export default function DictationLessons() {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All levels");

  // 1. Lấy thông tin chủ đề
  const { data: topicData, isLoading: loadingTopic } = useQuery({
    queryKey: ["dictation-topic", id],
    queryFn: () => DictationApi.getTopicById(id!),
    enabled: !!id,
  });

  // 2. Lấy danh sách bài học
  const { data: lessonsData, isLoading: loadingLessons } = useQuery({
    queryKey: ["dictation-lessons", id],
    queryFn: () => DictationApi.getLessonsByTopic(id!),
    enabled: !!id,
  });

  const topic = topicData?.data;
  const allLessons = lessonsData?.data ?? [];

  // Xử lý lọc và nhóm dữ liệu
  const groupedData = useMemo(() => {
    // Bước 1: Lọc bài học
    const filtered = allLessons.filter((lesson) => {
      const matchesSearch =
        searchTerm === "" ||
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lesson.subtitle && lesson.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLevel =
        selectedLevel === "All levels" || lesson.vocabLevel === selectedLevel;

      return matchesSearch && matchesLevel;
    });

    // Bước 2: Nhóm bài học (để hiển thị Accordion)
    return groupLessons(filtered);
  }, [allLessons, searchTerm, selectedLevel]);


  if (loadingTopic || loadingLessons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy chủ đề.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r bg-primary-color text-white py-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative main-layout">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              {topic.title}
            </h1>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/95 backdrop-blur-sm text-gray-900 border-0 rounded-lg shadow-lg"
              />
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-40 bg-white/95 backdrop-blur-sm text-gray-900 border-0 rounded-lg shadow-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All levels">Tất cả trình độ</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Practice Tests (Grouped Lessons) */}
      <div className="relative main-layout py-8">
        {groupedData.length > 0 ? (
          <Accordion type="multiple" className="space-y-4" defaultValue={[groupedData[0]?.id]}>
            {groupedData.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className="glass-effect border-white/20 shadow-lg rounded-lg overflow-hidden bg-white/60 backdrop-blur-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/50 transition-colors">
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-lg font-semibold text-gray-900">
                      {group.title}
                    </span>
                    <span className="text-sm text-gray-600 font-normal">
                      ({group.lessonCount} bài)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {group.lessons.map((lesson) => (
                      <Link to={`/dictation/lesson/${lesson.id}`} key={lesson.id}>
                        <DictationLessonCard lesson={lesson} />
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Không tìm thấy bài học nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
}