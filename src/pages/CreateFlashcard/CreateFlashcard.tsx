"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, XCircle, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import routes from "@/routes/routes.const";

interface Flashcard {
  term: string;
  definition: string;
}

const categories = [
  "Từ vựng cơ bản",
  "Từ vựng nâng cao",
  "TOEIC",
  "IELTS",
  "Giao tiếp",
  "Kinh doanh",
  "Du lịch",
  "Ẩm thực",
  "Công nghệ",
];

export default function CreateFlashcard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([
    { term: "", definition: "" },
  ]);

  const handleAddCard = () => {
    setCards([...cards, { term: "", definition: "" }]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCardChange = (
    index: number,
    field: keyof Flashcard,
    value: string
  ) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !title.trim() ||
      !category.trim() ||
      cards.some((card) => !card.term.trim() || !card.definition.trim())
    ) {
      alert("Vui lòng điền đầy đủ thông tin và ít nhất một thẻ.");
      return;
    }

    const newFlashcardSet = {
      id: Date.now().toString(), // Mock ID
      title,
      description,
      category,
      cards,
      cardCount: cards.length,
      studyCount: 0,
      rating: 0,
      ratingCount: 0,
      author: "Người dùng hiện tại", // Mock author
      authorAvatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600",
      createdAt: new Date().toISOString().split("T")[0],
      isPublic: true, // Default to public for now
      thumbnail:
        "/placeholder.svg?height=400&width=600&text=Flashcard+Thumbnail", // Placeholder
    };

    console.log("New Flashcard Set:", newFlashcardSet);
    // In a real app, you would send this to your backend
    alert("Bộ flashcard đã được tạo thành công!");
    navigate(routes.FLASHCARDS); // Redirect to flashcards list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary-color">
            Tạo bộ Flashcard mới
          </h1>
          <Button variant="outline" className="bg-transparent" asChild>
            <Link to={routes.FLASHCARDS}>
              <XCircle className="h-4 w-4 mr-2" />
              Hủy
            </Link>
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* General Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tiêu đề bộ thẻ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ví dụ: 1000 từ vựng tiếng Anh cơ bản"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn gọn về nội dung bộ thẻ..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Chủ đề <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flashcards List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Thẻ Flashcard <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg relative"
                  >
                    <div className="absolute top-2 right-2 text-gray-500 text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`term-${index}`}>Thuật ngữ</Label>
                      <Input
                        id={`term-${index}`}
                        placeholder="Ví dụ: Hello"
                        value={card.term}
                        onChange={(e) =>
                          handleCardChange(index, "term", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`definition-${index}`}>Định nghĩa</Label>
                      <Input
                        id={`definition-${index}`}
                        placeholder="Ví dụ: Xin chào"
                        value={card.definition}
                        onChange={(e) =>
                          handleCardChange(index, "definition", e.target.value)
                        }
                        required
                      />
                    </div>
                    {cards.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCard(index)}
                        className="absolute bottom-4 right-4 md:static md:self-end md:ml-4 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Xóa thẻ</span>
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCard}
                  className="w-full bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ mới
                </Button>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-primary-color hover:bg-hover-primary-color"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Lưu bộ Flashcard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
