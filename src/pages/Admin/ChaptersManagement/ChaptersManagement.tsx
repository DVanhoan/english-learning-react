import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Edit,
  Trash2,
  BookOpen,
  Play,
  ArrowLeft,
  GripVertical,
  Save,
  FolderX,
} from "lucide-react";
import type {
  ChangeOrderRequest,
  Chapter,
  ChapterRequest,
} from "@/types/chapter.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChapterApi } from "@/api/chapter.api";
import routes from "@/routes/routes.const";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  chapterSchema,
  deleteConfirmSchema,
  type ChapterFormData,
  type DeleteConfirmData,
} from "./validationSchema";

function SortableTableRow({
  chapter,
  onEdit,
  onDelete,
}: {
  chapter: Chapter;
  onEdit: (chapter: Chapter) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PUBLIC: "bg-green-100 text-green-800",
      HIDDEN: "bg-yellow-100 text-yellow-800",
    };
    const labels = {
      PUBLIC: "CÔNG KHAI",
      HIDDEN: "ẨN",
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`cursor-move ${isDragging ? "bg-muted/50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <TableCell>
        <div className="flex items-center">
          <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
          <Badge variant="outline">#{chapter.orderIndex}</Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">{chapter.title}</div>
            <div className="text-sm text-muted-foreground">
              {chapter.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Play className="mr-1 h-4 w-4 text-muted-foreground" />
          {chapter.numberOfLessons} bài học
        </div>
      </TableCell>
      <TableCell>{(chapter.duration / 3600).toFixed(2)} tiếng</TableCell>
      <TableCell>{getStatusBadge(chapter.status)}</TableCell>
      <TableCell>{dayjs(chapter.createdAt).format("DD/MM/YYYY")}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`/admin/chapters/${chapter.id}/lessons`}>
                <Play className="mr-2 h-4 w-4" />
                Quản lý bài học
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(chapter)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa chương
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(chapter.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa chương
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function ChaptersManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<number>(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!courseId || isNaN(Number(courseId)) || Number(courseId) < 1) {
      navigate(routes.COURSES_MANAGEMENT);
    }
  }, [courseId, navigate]);

  useQuery({
    queryKey: ["chapters", courseId],
    queryFn: () =>
      ChapterApi.getChaptersByCourseId(Number(courseId))
        .then((response) => {
          setOriginalOrder(response.data);
          setHasOrderChanged(false);
          setChapters(response.data);
          return response;
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          if (error.response?.data?.status == 403) {
            toast.error("Không đủ quyền truy cập");
          }
          navigate(routes.COURSES_MANAGEMENT);
        }),
    enabled: courseId && !isNaN(Number(courseId)) && Number(courseId) > 0,
  });

  const changeOrderMutation = useMutation({
    mutationFn: (data: ChangeOrderRequest) =>
      ChapterApi.updateOrder(data, Number(courseId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
      toast.success("Cập nhật thứ tự chương học thành công");
    },
    onError: () => {
      toast.error("Cập nhật thứ tự chương học thất bại");
    },
  });

  const updateChapterMutation = useMutation({
    mutationFn: (data: { payload: ChapterRequest; id: number }) =>
      ChapterApi.update(data.payload, data.id),
    onSuccess: () => {
      toast.success("Cập nhật chương học thành công");
      setIsEditOpen(false);
      setSelectedChapter(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
    onError: () => {
      toast.error("Cập nhật chương học thất bại");
    },
  });

  const createChapterMutation = useMutation({
    mutationFn: (data: ChapterRequest) => ChapterApi.create(data),
    onSuccess: () => {
      toast.success("Tạo chương học thành công");
      setIsCreateOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
    onError: () => {
      toast.error("Tạo chương học thất bại");
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: (data: number) => ChapterApi.delete(data),
    onSuccess: () => {
      toast.success("Xoá chương học thành công");
      setIsDeleteOpen(false);
      setChapterToDelete(0);
      deleteForm.reset();
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
    onError: () => {
      toast.error("Xoá chương học thất bại");
    },
  });

  const createForm = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "PUBLIC",
    },
  });

  const editForm = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "PUBLIC",
    },
  });

  const deleteForm = useForm<DeleteConfirmData>({
    resolver: zodResolver(deleteConfirmSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        const orderChanged = newItems.some(
          (item, index) => item.id !== originalOrder[index]?.id
        );
        setHasOrderChanged(orderChanged);

        return newItems;
      });
    }
  };

  const handleSaveOrder = () => {
    console.log("Lưu thứ tự chương:", chapters);
    const payload = chapters.map((item, index) => {
      return { id: item.id, orderIndex: index + 1 };
    });
    changeOrderMutation.mutate(payload);
  };

  const handleResetOrder = () => {
    setChapters([...originalOrder]);
    setHasOrderChanged(false);
  };

  const handleCreateChapter = (data: ChapterFormData) => {
    createChapterMutation.mutate({ ...data, courseId: Number(courseId) });
  };

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    editForm.reset({
      title: chapter.title,
      description: chapter.description,
      status: chapter.status,
    });
    setIsEditOpen(true);
  };

  const handleUpdateChapter = (data: ChapterFormData) => {
    updateChapterMutation.mutate({ payload: data, id: selectedChapter?.id });
  };

  const handleDeleteChapter = (chapterId: number) => {
    setChapterToDelete(chapterId);
    deleteForm.reset({ confirmText: "" });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteChapterMutation.mutate(chapterToDelete);
  };

  return (
    <div className="space-y-6">
      {/* Back button - Đưa lên trên và riêng dòng */}
      <div>
        <Link to="/admin/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại quản lý khóa học
          </Button>
        </Link>
      </div>

      {/* Header với nút thêm và cập nhật thứ tự */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý chương học
          </h2>
          <p className="text-muted-foreground">
            Quản lý các chương của khóa học ID: {courseId}
          </p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetOrder}>
                Hủy thay đổi
              </Button>
              <Button
                onClick={handleSaveOrder}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Cập nhật thứ tự
              </Button>
            </div>
          )}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#155e94] hover:bg-[#0b4674]">
                <Plus className="mr-2 h-4 w-4" />
                Thêm chương
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tạo chương mới</DialogTitle>
                <DialogDescription>
                  Thêm chương mới để tổ chức các bài học trong khóa học.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={createForm.handleSubmit(handleCreateChapter)}
                className="space-y-4"
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="create-title" className="text-right">
                      Tiêu đề *
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="create-title"
                        {...createForm.register("title")}
                        className={
                          createForm.formState.errors.title
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {createForm.formState.errors.title && (
                        <p className="text-sm text-red-500 mt-1">
                          {createForm.formState.errors.title.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="create-description" className="text-right">
                      Mô tả *
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="create-description"
                        {...createForm.register("description")}
                        className={
                          createForm.formState.errors.description
                            ? "border-red-500"
                            : ""
                        }
                        rows={3}
                      />
                      {createForm.formState.errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {createForm.formState.errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="create-status" className="text-right">
                      Trạng thái *
                    </Label>
                    <div className="col-span-3">
                      <Controller
                        name="status"
                        control={createForm.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger
                              className={
                                createForm.formState.errors.status
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLIC">CÔNG KHAI</SelectItem>
                              <SelectItem value="HIDDEN">ẨN</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {createForm.formState.errors.status && (
                        <p className="text-sm text-red-500 mt-1">
                          {createForm.formState.errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#155e94] hover:bg-[#0b4674]"
                  >
                    Tạo chương
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả chương học</CardTitle>
          <CardDescription>
            Danh sách tất cả các chương trong khóa học. Nhấn và kéo bất kỳ hàng
            nào để sắp xếp lại thứ tự các chương.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chapters && chapters.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thứ tự</TableHead>
                      <TableHead>Chương</TableHead>
                      <TableHead>Bài học</TableHead>
                      <TableHead>Thời lượng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={chapters}
                      strategy={verticalListSortingStrategy}
                    >
                      {chapters.map((chapter) => (
                        <SortableTableRow
                          key={chapter.id}
                          chapter={chapter}
                          onEdit={handleEditChapter}
                          onDelete={handleDeleteChapter}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </div>
            </DndContext>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <FolderX className="h-12 w-12 mb-3 text-gray-400" />
              <p className="text-lg font-medium">Không có dữ liệu phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Chapter Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chương</DialogTitle>
            <DialogDescription>
              Thực hiện thay đổi cho chương tại đây. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdateChapter)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Tiêu đề *
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-title"
                    {...editForm.register("title")}
                    className={
                      editForm.formState.errors.title ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Mô tả *
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="edit-description"
                    {...editForm.register("description")}
                    className={
                      editForm.formState.errors.description
                        ? "border-red-500"
                        : ""
                    }
                    rows={3}
                  />
                  {editForm.formState.errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Trạng thái *
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="status"
                    control={editForm.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={
                            editForm.formState.errors.status
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PUBLIC">CÔNG KHAI</SelectItem>
                          <SelectItem value="HIDDEN">ẨN</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {editForm.formState.errors.status && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.status.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#155e94] hover:bg-[#0b4674]">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xoá chương</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Vui lòng nhập "OK" để xác nhận
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={deleteForm.handleSubmit(handleConfirmDelete)}
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="delete-confirm">Nhập OK để xác nhận</Label>
              <Input
                id="delete-confirm"
                placeholder="OK"
                {...deleteForm.register("confirmText")}
                className={
                  deleteForm.formState.errors.confirmText
                    ? "border-red-500"
                    : ""
                }
              />
              {deleteForm.formState.errors.confirmText && (
                <p className="text-sm text-red-500">
                  {deleteForm.formState.errors.confirmText.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
              >
                Huỷ
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Xác nhận xoá
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
