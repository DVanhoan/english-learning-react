import VideoPlayer from "@/components/VideoPlayer";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Clock,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  List,
  Lock,
  Play,
} from "lucide-react"; // Import thêm icon
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseApi } from "@/api/course.api";
import { CommentApi } from "@/api/commentLesson.api";
import { AppUtils } from "@/utils/appUtils";
import type { Lesson } from "@/types/lesson.type";
import type { Chapter } from "@/types/chapter.type";
import type { CommentRequest } from "@/types/commentLeason.type";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import useAuth from "@/context/AuthContext";
import routes from "@/routes/routes.const";

const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung không được để trống")
    .max(500, "Không quá 500 ký tự"),
});

export default function LessonLearnPage() {
  const { courseId, lessonId } = useParams();
  const queryClient = useQueryClient();
  const {
    state: { isAuthenticated },
  } = useAuth();

  const [showComments, setShowComments] = useState(false);

  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => CourseApi.getDetails(courseId!),
    enabled: !!courseId,
  });


  const { currentLesson, prevLesson, nextLesson } = useMemo(() => {
    if (!courseData || !lessonId) return {};

    const allLessons: Lesson[] =
      courseData.chaptersDetails?.flatMap(
        (chapter: Chapter) => chapter.lessonsDetails ?? []
      ) ?? [];

    const currentLessonIndex = allLessons.findIndex(
      (lesson) => lesson.id === Number(lessonId)
    );

    if (currentLessonIndex === -1) return {};

    return {
      currentLesson: allLessons[currentLessonIndex],
      prevLesson: allLessons[currentLessonIndex - 1], // Sẽ là 'undefined' nếu là bài đầu
      nextLesson: allLessons[currentLessonIndex + 1], // Sẽ là 'undefined' nếu là bài cuối
    };
  }, [courseData, lessonId]);


  const { data: commentsData, } = useQuery({
    queryKey: ["comments", lessonId],
    queryFn: () => CommentApi.getCommentsByLesson(lessonId!),
    enabled: !!lessonId,
  });
  const comments = commentsData?.data ?? [];


  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  });

  // Mutation để tạo bình luận
  const createCommentMutation = useMutation({
    mutationFn: (data: CommentRequest) => CommentApi.createComment(data),
    onSuccess: () => {
      toast.success("Đăng bình luận thành công");
      commentForm.reset();
      queryClient.invalidateQueries({ queryKey: ["comments", lessonId] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Đăng bình luận thất bại");
    },
  });

  const handleSubmitComment = (data: z.infer<typeof commentFormSchema>) => {
    if (!lessonId) return;
    createCommentMutation.mutate({
      content: data.content,
      lessonId: Number(lessonId),
    });
  };


  const CourseContent = () => (
    <>
      <div className="space-y-2">
        {courseData?.chaptersDetails?.map((chapter: Chapter) => (
          <Accordion
            key={chapter.id}
            type="single"
            collapsible
            // Tự động mở chương chứa bài học hiện tại
            defaultValue={
              chapter.lessonsDetails?.some(
                (l) => l.id === currentLesson?.id
              )
                ? `chapter-${chapter.id}`
                : undefined
            }
          >
            <AccordionItem value={`chapter-${chapter.id}`}>
              <AccordionTrigger className="rounded-none px-4 border border-primary-color hover:no-underline cursor-pointer text-primary-color">
                <div>
                  <h4 className="font-medium text-sm text-left">
                    {chapter.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {chapter.lessonsDetails?.length ?? 0} bài học •{" "}
                    {AppUtils.formatTime(chapter.duration)}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="border border-gray-300 bg-slate-200">
                  {chapter.lessonsDetails?.map((lesson: Lesson) => (
                    <Link
                      to={`/courses/${courseId}/video-lessons/${lesson.id}`}
                      key={lesson.id}
                    >
                      <div
                        className={`flex items-center justify-between p-3 border-t border-t-gray-300 ${lesson.id === currentLesson?.id
                          ? "bg-primary-color/20" // Làm nổi bật bài hiện tại
                          : "hover:bg-gray-100"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {lesson.isPreview ? (
                            <Play className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <h5 className="text-sm font-medium">
                              {lesson.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{AppUtils.formatTime(lesson.duration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </>
  );

  // Component Khu vực bình luận
  const CommentsSection = () => (
    <div className="space-y-6">
      {/* Add Comment */}
      {isAuthenticated ? (
        <div className="space-y-3">
          <Form {...commentForm}>
            <form
              onSubmit={commentForm.handleSubmit(handleSubmitComment)}
              className="space-y-4"
            >
              <FormField
                control={commentForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px]">Bình luận</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Viết bình luận của bạn..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={createCommentMutation.isPending}
                className="bg-primary-color text-white hover:bg-hover-primary-color hover:text-white cursor-pointer"
              >
                {createCommentMutation.isPending
                  ? "Đang đăng..."
                  : "Đăng bình luận"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-100 rounded-md">
          <p>
            Vui lòng{" "}
            <Link
              to={routes.SIGN_IN}
              className="font-semibold text-primary-color hover:underline"
            >
              đăng nhập
            </Link>{" "}
            để tham gia thảo luận.
          </p>
        </div>
      )}

      {/* Comments List */}
      {/* <div className="space-y-6">
        {isLoadingComments && <p>Đang tải bình luận...</p>}
        {comments.map((comment: Comment) => (
          <CommentParent comment={comment} key={comment.id} />
        ))}
      </div> */}
    </div>
  );

  if (isLoadingCourse) {
    return <div>Đang tải nội dung khóa học...</div>; // TODO: Thêm skeleton
  }

  if (!courseData || !currentLesson) {
    return <div>Không tìm thấy bài học.</div>; // TODO: Thêm trang 404
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="main-layout">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-2">
              {prevLesson ? (
                <Link to={`/learn/${courseId}/lesson/${prevLesson.id}`}>
                  <Button variant="outline" size="sm" className="cursor-pointer">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Bài trước
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Bài trước
                </Button>
              )}

              {nextLesson ? (
                <Link to={`/learn/${courseId}/lesson/${nextLesson.id}`}>
                  <Button
                    size="sm"
                    className="bg-primary-color hover:bg-hover-primary-color cursor-pointer"
                  >
                    Bài tiếp theo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  disabled
                  className="bg-primary-color/80 cursor-not-allowed"
                >
                  Bài tiếp theo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="main-layout py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Video Player */}
            <div className="mb-6">
              <VideoPlayer
                src={currentLesson.videoUrl ?? ""}
                title={currentLesson.title}
                className="w-full aspect-video rounded-lg overflow-hidden"
              />
            </div>

            {/* Lesson Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 text-primary-color">
                {currentLesson.title}
              </h1>
              {/* TODO: Tìm tên chương của bài học hiện tại */}
              {/* <p className="text-gray-600">Chương 2: Ôn tập JS và TS</p> */}
            </div>

            {/* Mobile Controls */}
            <div className="xl:hidden flex gap-2 mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <List className="h-4 w-4 mr-2" />
                    Danh sách bài học
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 p-0">
                  <SheetHeader className="p-6 pb-4">
                    <SheetTitle>{courseData.title}</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-6 overflow-y-auto h-[calc(100vh-120px)]">
                    <CourseContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet open={showComments} onOpenChange={setShowComments}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Thảo luận ({comments.length})
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] p-0">
                  <SheetHeader className="px-6 py-4"></SheetHeader>
                  <div className="px-4 py-0 overflow-y-auto h-[calc(80vh-120px)]">
                    <CommentsSection />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Mô tả bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none" // Thêm class 'prose' để định dạng HTML
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.description ?? "",
                  }}
                />
              </CardContent>
            </Card>

            {/* Content (Code, etc.) */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Nội dung bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none" // Thêm class 'prose'
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.content ?? "",
                  }}
                />
              </CardContent>
            </Card>

            {/* Comments Section - Desktop */}
            <div className="hidden xl:block">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Thảo luận ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentsSection />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden xl:block">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{courseData.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseContent />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}