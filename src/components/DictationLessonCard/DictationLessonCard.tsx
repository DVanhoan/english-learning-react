import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenText, Gem, Clock } from "lucide-react";
import type { DictationLesson } from "@/types/dictation.type";

interface DictationLessonCardProps {
  lesson: DictationLesson;
  onClick?: (lessonId: string) => void;
}

export default function DictationLessonCard({
  lesson,
  onClick,
}: DictationLessonCardProps) {
  return (
    <Card
      className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white border border-gray-200 h-full"
      onClick={() => onClick?.(String(lesson.id))}
    >
      <CardContent className="p-4 space-y-3 flex flex-col h-full">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 group-hover:text-primary-color transition-colors line-clamp-1" title={lesson.title}>
            {lesson.title}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {lesson.subtitle || lesson.description || "Không có mô tả"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs mt-auto pt-2 border-t border-gray-50">
          <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-normal">
            <BookOpenText className="w-3 h-3" />
            {lesson.sentences ? lesson.sentences.length : 0} câu
          </Badge>

          {lesson.vocabLevel && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-normal">
              <Gem className="w-3 h-3" />
              {lesson.vocabLevel}
            </Badge>
          )}

          {lesson.duration && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}