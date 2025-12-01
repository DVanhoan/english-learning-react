import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import AudioPlayer, { type AudioPlayerRef } from "@/components/AudioPlayer/AudioPlayer";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { DictationApi } from "@/api/dictation.api";
import routes from "@/routes/routes.const";

export default function DictationLessonDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: lessonData, isLoading, isError } = useQuery({
    queryKey: ["dictation-lesson", id],
    queryFn: () => DictationApi.getLessonById(id!),
    enabled: !!id,
  });

  const lesson = lessonData?.data;

  const sentences = lesson?.sentences?.sort((a, b) => a.orderIndex - b.orderIndex) || [];

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showCorrectText, setShowCorrectText] = useState(false);
  const [isSentenceLooping, setIsSentenceLooping] = useState(false);
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  const currentSentence = sentences[currentSentenceIndex];

  useEffect(() => {
    if (lesson && sentences?.length > 0) {
      setCurrentSentenceIndex(0);
      setUserInput("");
      setShowCorrectText(false);
      setIsSentenceLooping(false);
      if (audioPlayerRef.current && sentences[0]) {
        audioPlayerRef.current.seekTo(sentences[0].startTime);
        audioPlayerRef.current.pause();
      }
    }
  }, [lesson]);

  useEffect(() => {
    setUserInput("");
    setShowCorrectText(false);
    setIsSentenceLooping(false);
    if (audioPlayerRef.current && currentSentence) {
      audioPlayerRef.current.seekTo(currentSentence.startTime);
      audioPlayerRef.current.play();
    }
  }, [currentSentenceIndex, currentSentence]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Lỗi!</AlertTitle>
          <AlertDescription>
            Không tìm thấy bài học chép chính tả này.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to={lesson?.topicId ? `/dictation/topics/${lesson.topicId}/lessons` : routes.DICTATION_TOPICS}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  const handleAudioTimeUpdate = (currentTime: number) => {
    if (isSentenceLooping && currentSentence && audioPlayerRef.current) {
      const buffer = 0.1;
      if (currentTime >= currentSentence.endTime - buffer) {
        audioPlayerRef.current.seekTo(currentSentence.startTime);
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    }
  };

  const handlePreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex((prev) => prev - 1);
    }
  };

  const handleCheck = () => {
    setShowCorrectText(true);
  };

  const highlightErrors = (correctText: string, userText: string) => {
    const correctWords = correctText.toLowerCase().split(/\s+/).filter(Boolean);
    const userWords = userText.toLowerCase().split(/\s+/).filter(Boolean);
    const result: React.ReactNode[] = [];
    let userWordPointer = 0;

    for (let i = 0; i < correctWords.length; i++) {
      const correctWord = correctWords[i];
      let isCorrect = false;
      let foundMatchIndex = -1;

      for (let j = userWordPointer; j < userWords.length; j++) {
        if (userWords[j] === correctWord) {
          foundMatchIndex = j;
          break;
        }
      }

      if (foundMatchIndex !== -1) {
        isCorrect = true;
        userWordPointer = foundMatchIndex + 1;
      }

      result.push(
        <span
          key={i}
          className={cn(
            "mr-1",
            isCorrect ? "text-green-600" : "text-red-600 font-semibold"
          )}
        >
          {correctWords[i]}
        </span>
      );
    }
    return <p className="text-sm">{result}</p>;
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-4">
        <Button variant="ghost" className="pl-0 hover:bg-transparent" asChild>
          <Link to={`/dictation/topics/${lesson.topicId}/lessons`}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại bài học
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      <p className="text-muted-foreground mb-8">{lesson.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nội dung chính tả</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full bg-gray-200 rounded-md overflow-hidden mb-4">
                <AudioPlayer
                  ref={audioPlayerRef}
                  src={lesson.mediaUrl}
                  onPlay={() => { }}
                  onPause={() => { }}
                  onEnded={() => { }}
                  onTimeUpdate={handleAudioTimeUpdate}
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Button
                  size="sm"
                  variant={isSentenceLooping ? "default" : "outline"}
                  onClick={() => setIsSentenceLooping(!isSentenceLooping)}
                >
                  {isSentenceLooping ? "Tắt lặp lại câu" : "Lặp lại câu này"}
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-4">
                <Button
                  onClick={handlePreviousSentence}
                  disabled={currentSentenceIndex === 0}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4" /> Câu trước
                </Button>
                <span className="text-[14px] md:text-[16px] font-medium">
                  Câu {currentSentenceIndex + 1} / {sentences.length}
                </span>
                <Button
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex === sentences.length - 1}
                  variant="outline"
                >
                  Câu tiếp <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <Label htmlFor="dictation-input" className="mb-2 block">
                  Nhập những gì bạn nghe được:
                </Label>
                <Textarea
                  id="dictation-input"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Bắt đầu gõ ở đây..."
                  rows={5}
                  className="w-full text-[14px] md:text-[16px]"
                />
              </div>

              <Button
                onClick={handleCheck}
                className="w-full mb-4 bg-[#155e94] hover:bg-[#155e94]/90 text-white"
              >
                Kiểm tra
              </Button>

              {showCorrectText && currentSentence && (
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Kết quả:</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="text-green-600">Màu xanh: Đúng</span>,{" "}
                      <span className="text-red-600">Màu đỏ: Sai/Thiếu</span>
                    </p>
                    {highlightErrors(currentSentence.text, userInput)}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 max-h-[calc(100vh-2rem)] flex flex-col">
            <CardHeader>
              <CardTitle>Danh sách câu ({sentences.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
              <ul className="space-y-2">
                {sentences.map((sentence, index) => (
                  <li key={sentence.id}>
                    <Button
                      variant={index === currentSentenceIndex ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left h-auto py-2 px-3 whitespace-normal",
                        index === currentSentenceIndex ? "bg-primary-color text-white hover:bg-primary-color/90" : ""
                      )}
                      onClick={() => setCurrentSentenceIndex(index)}
                    >
                      <span className="mr-2 font-bold shrink-0">{index + 1}.</span>
                      <div className="flex flex-col">
                        <span className="text-xs opacity-80">
                          {sentence.startTime}s - {sentence.endTime}s
                        </span>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}