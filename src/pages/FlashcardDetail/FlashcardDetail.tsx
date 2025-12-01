import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Edit,
  BookOpen,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  Share2,
  Heart,
  Loader2
} from "lucide-react";
import routes from "@/routes/routes.const";
import { useQuery } from "@tanstack/react-query";
import { FlashcardApi } from "@/api/flashcard.api";
import useAuth from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FlashcardDetail() {
  const { id } = useParams<{ id: string }>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { state: { user: currentUser } } = useAuth();

  const { data: flashcardSetData, isLoading, isError } = useQuery({
    queryKey: ["flashcard", id],
    queryFn: () => FlashcardApi.getById(id!),
    enabled: !!id,
  });

  const flashcardSet = flashcardSetData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-color" />
      </div>
    );
  }

  if (isError || !flashcardSet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-lg text-gray-600">Không tìm thấy bộ flashcard này.</p>
        <Button asChild variant="outline">
          <Link to={routes.FLASHCARDS}>Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const cards = flashcardSet.cards || [];
  const currentCard = cards[currentCardIndex];
  const progress = cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;
  const isOwner = currentUser?.id === flashcardSet.author.id || currentUser?.role === "ADMIN";

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Dừng audio đang đọc
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" className="bg-transparent hover:bg-gray-100 pl-0" asChild>
            <Link to={routes.FLASHCARDS}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>

          {isOwner && (
            <Button variant="outline" className="bg-white border-primary-color text-primary-color hover:bg-primary-color hover:text-white" asChild>
              {/* TODO: Thêm route Edit */}
              <Link to={routes.CREATE_FLASHCARD /* Thay bằng EDIT_FLASHCARD khi có */}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Flashcard Viewer */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card Viewer */}
            {cards.length > 0 ? (
              <div className="relative perspective-1000 h-[400px] w-full">
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? "rotate-y-180" : ""}`}
                  onClick={handleFlipCard}
                >
                  {/* Front Face */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-white shadow-lg border-2 border-gray-100">
                    <div className="absolute top-4 left-4 text-sm text-gray-400 font-medium uppercase tracking-wider">Thuật ngữ</div>
                    <Button
                      size="icon" variant="ghost"
                      className="absolute top-4 right-4 text-gray-400 hover:text-primary-color"
                      onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.term); }}
                    >
                      <Volume2 size={20} />
                    </Button>

                    <div className="text-3xl md:text-4xl font-bold text-gray-800 text-center px-6">
                      {currentCard.term}
                    </div>
                  </Card>

                  {/* Back Face */}
                  <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-blue-50 shadow-lg border-2 border-blue-100">
                    <div className="absolute top-4 left-4 text-sm text-blue-400 font-medium uppercase tracking-wider">Định nghĩa</div>
                    <Button
                      size="icon" variant="ghost"
                      className="absolute top-4 right-4 text-blue-400 hover:text-blue-600"
                      onClick={(e) => { e.stopPropagation(); handleSpeak(currentCard.definition); }}
                    >
                      <Volume2 size={20} />
                    </Button>

                    <div className="text-2xl md:text-3xl font-medium text-blue-900 text-center px-6">
                      {currentCard.definition}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="h-[400px] flex items-center justify-center bg-gray-100 border-dashed">
                <p className="text-gray-500">Bộ này chưa có thẻ nào.</p>
              </Card>
            )}

            {/* Controls */}
            {cards.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-6">
                  <Button
                    variant="outline" size="icon"
                    onClick={handlePrevCard}
                    className="h-12 w-12 rounded-full border-gray-300 hover:border-primary-color hover:text-primary-color transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <span className="text-lg font-medium text-gray-700 min-w-[80px] text-center">
                    {currentCardIndex + 1} / {cards.length}
                  </span>

                  <Button
                    variant="outline" size="icon"
                    onClick={handleNextCard}
                    className="h-12 w-12 rounded-full border-gray-300 hover:border-primary-color hover:text-primary-color transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Tiến độ</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}
          </div>

          {/* Right: Info & Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">{flashcardSet.category}</Badge>
                    <CardTitle className="text-xl">{flashcardSet.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{flashcardSet.description || "Không có mô tả."}</p>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={flashcardSet.author.avatarUrl} />
                    <AvatarFallback>{flashcardSet.author.fullName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{flashcardSet.author.fullName}</p>
                    <p className="text-xs text-gray-500">Tác giả</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <BookOpen className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                    <p className="text-xs text-gray-500">Số thẻ</p>
                    <p className="font-bold text-gray-800">{flashcardSet.cardCount}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                    <p className="text-xs text-gray-500">Học viên</p>
                    <p className="font-bold text-gray-800">{flashcardSet.studyCount}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline" className="flex-1"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    Lưu
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* List of Cards (Mini view) */}
            <Card className="max-h-[400px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Danh sách thẻ ({cards.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-2 space-y-2">
                {cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className={`p-3 rounded-md text-sm cursor-pointer transition-colors border ${idx === currentCardIndex ? "bg-blue-50 border-blue-200" : "bg-white border-transparent hover:bg-gray-50"}`}
                    onClick={() => { setCurrentCardIndex(idx); setIsFlipped(false); }}
                  >
                    <div className="font-medium text-gray-900">{card.term}</div>
                    <div className="text-gray-500 truncate">{card.definition}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}