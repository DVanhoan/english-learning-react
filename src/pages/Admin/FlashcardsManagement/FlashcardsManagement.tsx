import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Select... } // Nếu bạn muốn dùng select category
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import DynamicPagination from "@/components/DynamicPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlashcardApi } from "@/api/flashcard.api";
import type { FlashcardSet, FlashcardSetRequest, FlashcardRequestData } from "@/types/flashcard.type";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import routes from "@/routes/routes.const";


interface FlashcardFormData {
  title: string;
  description: string;
  category: string;
  cards: FlashcardRequestData[];
}

const initialFormState: FlashcardFormData = {
  title: "",
  description: "",
  category: "",
  cards: [{ term: "", definition: "" }],
};

export function FlashcardsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<FlashcardSet | null>(null);
  const [formData, setFormData] = useState<FlashcardFormData>(initialFormState);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();


  const { data: flashcardData, isLoading } = useQuery({
    queryKey: ["admin-flashcards", currentPage, searchTerm],
    queryFn: () =>
      FlashcardApi.getManagement({
        page: currentPage,
        size: itemsPerPage,
        keyword: searchTerm,
        sort: "newest",
      }),
    staleTime: 0
  });

  const flashcards = flashcardData?.data.items ?? [];
  const totalPages = flashcardData?.data.totalPages ?? 1;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => FlashcardApi.delete(id),
    onSuccess: () => {
      toast.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-flashcards"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Xóa thất bại")
  });

  const createMutation = useMutation({
    mutationFn: (data: FlashcardSetRequest) => FlashcardApi.create(data),
    onSuccess: () => {
      toast.success("Tạo thành công");
      setIsCreateOpen(false);
      setFormData(initialFormState);
      queryClient.invalidateQueries({ queryKey: ["admin-flashcards"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Tạo thất bại")
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number, data: FlashcardSetRequest }) => FlashcardApi.update(params.id, params.data),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      setIsEditOpen(false);
      setSelectedFlashcard(null);
      setFormData(initialFormState);
      queryClient.invalidateQueries({ queryKey: ["admin-flashcards"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Cập nhật thất bại")
  });


  const handleCreate = () => {
    if (!formData.title || !formData.category) {
      toast.warn("Vui lòng nhập tiêu đề và danh mục");
      return;
    }
    createMutation.mutate({ ...formData, isPublic: true });
  }

  const handleEditClick = (flashcard: FlashcardSet) => {
    setSelectedFlashcard(flashcard);
    setFormData({
      title: flashcard.title,
      description: flashcard.description,
      category: flashcard.category,
      cards: flashcard.cards.map(c => ({ term: c.term, definition: c.definition }))
    });
    setIsEditOpen(true);
  }

  const handleUpdate = () => {
    if (!selectedFlashcard) return;
    updateMutation.mutate({
      id: selectedFlashcard.id,
      data: { ...formData, isPublic: selectedFlashcard.isPublic }
    });
  }

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bộ thẻ này?")) {
      deleteMutation.mutate(id);
    }
  }

  const handleCardChange = (index: number, field: 'term' | 'definition', value: string) => {
    const newCards = [...formData.cards];
    newCards[index][field] = value;
    setFormData({ ...formData, cards: newCards });
  }

  const addCard = () => {
    setFormData({ ...formData, cards: [...formData.cards, { term: "", definition: "" }] });
  }

  const removeCard = (index: number) => {
    const newCards = formData.cards.filter((_, i) => i !== index);
    setFormData({ ...formData, cards: newCards });
  }

  const renderFormContent = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label>Tiêu đề</Label>
        <Input
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nhập tiêu đề bộ thẻ"
        />
      </div>
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Mô tả ngắn gọn"
        />
      </div>
      <div className="space-y-2">
        <Label>Danh mục</Label>
        <Input
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          placeholder="Ví dụ: TOEIC, IELTS..."
        />
      </div>

      <div className="space-y-4 mt-2">
        <div className="flex justify-between items-center">
          <Label>Danh sách thẻ ({formData.cards.length})</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCard}>
            <Plus className="h-4 w-4 mr-1" /> Thêm thẻ
          </Button>
        </div>

        {formData.cards.map((card, idx) => (
          <div key={idx} className="flex gap-2 items-start border p-2 rounded bg-gray-50">
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Thuật ngữ"
                value={card.term}
                onChange={e => handleCardChange(idx, 'term', e.target.value)}
              />
              <Input
                placeholder="Định nghĩa"
                value={card.definition}
                onChange={e => handleCardChange(idx, 'definition', e.target.value)}
              />
            </div>
            {formData.cards.length > 1 && (
              <Button
                type="button" variant="ghost" size="icon"
                className="text-red-500 mt-1"
                onClick={() => removeCard(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Flashcards</h2>
          <p className="text-muted-foreground">Xem và quản lý các bộ thẻ học tập</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#155e94] hover:bg-[#0b4674]">
              <Plus className="mr-2 h-4 w-4" />
              Tạo bộ thẻ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tạo bộ Flashcard</DialogTitle>
              <DialogDescription>Thêm bộ thẻ mới vào hệ thống.</DialogDescription>
            </DialogHeader>
            {renderFormContent()}
            <DialogFooter>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo mới
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách ({flashcardData?.data.numberOfElements || 0})</CardTitle>
          <CardDescription>Tất cả các bộ thẻ hiện có.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-color" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Thông tin bộ thẻ</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Số thẻ</TableHead>
                      <TableHead>Tác giả</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flashcards.map((flashcard) => (
                      <TableRow key={flashcard.id}>
                        <TableCell>
                          <div className="font-medium">{flashcard.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{flashcard.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{flashcard.category}</Badge>
                        </TableCell>
                        <TableCell>{flashcard.cardCount}</TableCell>
                        <TableCell>{flashcard.author.fullName}</TableCell>
                        <TableCell>{dayjs(flashcard.createdAt).format("DD/MM/YYYY")}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link to={routes.FLASHCARD_DETAIL.replace(":id", String(flashcard.id))}>
                                  <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(flashcard)}>
                                <Edit className="mr-2 h-4 w-4" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(flashcard.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4">
                  <DynamicPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bộ thẻ</DialogTitle>
          </DialogHeader>
          {renderFormContent()}
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}