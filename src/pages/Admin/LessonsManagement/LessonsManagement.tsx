import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LessonApi } from "@/api/lesson.api";
import type {
  Lesson,
  ChangeOrderRequest as LessonChangeOrder,
} from "@/types/lesson.type";
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
  ArrowLeft,
  GripVertical,
  Save,
  Upload,
  Video,
  FolderX,
  Loader2,
} from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import {
  deleteConfirmSchema,
  lessonSchema,
  type DeleteConfirmData,
  type LessonFormData,
} from "./validationSchema";
import { ChapterApi } from "@/api/chapter.api";
import routes from "@/routes/routes.const";

function SortableTableRow({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const secondsToClock = (seconds?: number | null) => {
    if (!seconds && seconds !== 0) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
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
          <Badge variant="outline">#{lesson.orderIndex}</Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Video className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">{lesson.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {lesson.description}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>{secondsToClock(lesson.duration) || "Chưa có"}</TableCell>
      <TableCell>
        {lesson.status === "HIDDEN" ? (
          <Badge variant="outline" className="text-gray-500">
            Ẩn
          </Badge>
        ) : (
          <Badge className="bg-blue-100 text-blue-800">Công khai</Badge>
        )}
      </TableCell>
      <TableCell>
        {lesson.videoUrl ? (
          <Badge className="bg-green-100 text-green-800">Có video</Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500">
            Chưa có video
          </Badge>
        )}
      </TableCell>
      <TableCell>{lesson.createdAt}</TableCell>
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
            <DropdownMenuItem onClick={() => onEdit(lesson)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa bài học
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(lesson.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa bài học
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function LessonsManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { chapterId } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<Lesson[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editSelectedVideoFile, setEditSelectedVideoFile] =
    useState<File | null>(null);
  const [editSelectedDocFile, setEditSelectedDocFile] = useState<File | null>(
    null
  );
  const [editVideoDuration, setEditVideoDuration] = useState<number | null>(
    null
  );
  const [editVideoPreview, setEditVideoPreview] = useState<string | null>(null);
  const editVideoInputRef = useRef<HTMLInputElement>(null);
  const editDocInputRef = useRef<HTMLInputElement>(null);
  const [editDocPreviewUrl, setEditDocPreviewUrl] = useState<string | null>(
    null
  );
  const [createSelectedVideoFile, setCreateSelectedVideoFile] =
    useState<File | null>(null);
  const [createSelectedDocFile, setCreateSelectedDocFile] =
    useState<File | null>(null);
  const [createVideoDuration, setCreateVideoDuration] = useState<number | null>(
    null
  );
  const createVideoInputRef = useRef<HTMLInputElement>(null);
  const createDocInputRef = useRef<HTMLInputElement>(null);
  const [createVideoPreview, setCreateVideoPreview] = useState<string | null>(
    null
  );
  const [createDocPreviewUrl, setCreateDocPreviewUrl] = useState<string | null>(
    null
  );

  const extractVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.onerror = () =>
          reject(new Error("Không thể đọc thời lượng video"));
        video.src = URL.createObjectURL(file);
      } catch (e) {
        reject(e as Error);
      }
    });
  };

  const goBackOrNotFound = useCallback(() => {
    try {
      const canGoBack =
        window.history.state && typeof window.history.state.idx === "number"
          ? window.history.state.idx > 0
          : window.history.length > 1;
      if (canGoBack) {
        navigate(-1);
      } else {
        navigate(routes.NOT_FOUND, { replace: true });
      }
    } catch {
      navigate(routes.NOT_FOUND, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const idNum = Number(chapterId);
    if (!chapterId || Number.isNaN(idNum) || idNum <= 0) {
      goBackOrNotFound();
    }
  }, [chapterId, goBackOrNotFound]);

  useQuery({
    queryKey: ["lessons", chapterId],
    queryFn: async () =>
      LessonApi.getByChapterId(Number(chapterId))
        .then((res) => {
          setLessons(res.data);
          setOriginalOrder(res.data);
          setHasOrderChanged(false);
          return res;
        })
        .catch((err) => {
          goBackOrNotFound();
          throw err;
        }),
    enabled: !!chapterId && !isNaN(Number(chapterId)) && Number(chapterId) > 0,
  });

  const { data: chapterData } = useQuery({
    queryKey: ["chapters", chapterId],
    queryFn: async () =>
      ChapterApi.getChapterById(Number(chapterId)).catch((err) => {
        goBackOrNotFound();
        throw err;
      }),
    enabled: !!chapterId && !isNaN(Number(chapterId)) && Number(chapterId) > 0,
  });

  const handleBackToChapters = useCallback(() => {
    const cid = chapterData?.data?.courseId;
    if (cid && Number(cid) > 0) {
      navigate(routes.CHAPTERS_BY_COURSE.replace(":courseId", String(cid)));
    } else {
      goBackOrNotFound();
    }
  }, [chapterData?.data?.courseId, navigate, goBackOrNotFound]);

  const handleCreateVideoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setCreateSelectedVideoFile(file);
    if (file) {
      try {
        const seconds = await extractVideoDuration(file);
        setCreateVideoDuration(seconds);
      } catch {
        setCreateVideoDuration(null);
      }
      if (createVideoPreview) URL.revokeObjectURL(createVideoPreview);
      setCreateVideoPreview(URL.createObjectURL(file));
    } else {
      setCreateVideoDuration(null);
      if (createVideoPreview) URL.revokeObjectURL(createVideoPreview);
      setCreateVideoPreview(null);
    }
  };

  const handleCreateDocSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setCreateSelectedDocFile(file);
    if (createDocPreviewUrl) {
      URL.revokeObjectURL(createDocPreviewUrl);
      setCreateDocPreviewUrl(null);
    }
    if (file && file.type === "application/pdf") {
      setCreateDocPreviewUrl(URL.createObjectURL(file));
    }
  };

  const createForm = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      status: "PUBLIC",
      isPreview: false,
    },
  });

  // Form for editing lessons
  const editForm = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      status: "PUBLIC",
      isPreview: false,
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
      setLessons((items) => {
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
    const payload = lessons.map((l, index) => ({
      id: l.id,
      orderIndex: index + 1,
    }));
    console.log("payload", payload);
    changeOrderMutation.mutate(payload);
  };

  const handleResetOrder = () => {
    setLessons([...originalOrder]);
    setHasOrderChanged(false);
  };

  const handleEditVideoSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setEditSelectedVideoFile(file);
    if (file) {
      try {
        const seconds = await extractVideoDuration(file);
        setEditVideoDuration(seconds);
      } catch {
        setEditVideoDuration(null);
      }
      if (editVideoPreview) URL.revokeObjectURL(editVideoPreview);
      setEditVideoPreview(URL.createObjectURL(file));
    } else {
      setEditVideoDuration(null);
      if (editVideoPreview) URL.revokeObjectURL(editVideoPreview);
      setEditVideoPreview(null);
    }
  };

  const handleEditDocSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setEditSelectedDocFile(file);
    if (editDocPreviewUrl) {
      URL.revokeObjectURL(editDocPreviewUrl);
      setEditDocPreviewUrl(null);
    }
    if (file && file.type === "application/pdf") {
      setEditDocPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateLesson = (data: LessonFormData) => {
    if (!chapterId) return;
    createLessonMutation.mutate({
      lesson: {
        title: data.title,
        description: data.description || "",
        content: data.content,
        isPreview: data.isPreview,
        status: data.status,
        duration: createVideoDuration ?? 0,
        chapterId: Number(chapterId),
      },
      documentFile: createSelectedDocFile || undefined,
      video: createSelectedVideoFile || undefined,
    });
  };

  const changeOrderMutation = useMutation({
    mutationFn: (payload: LessonChangeOrder) =>
      LessonApi.updateOrder(Number(chapterId), payload),
    onSuccess: () => {
      toast.success("Cập nhật thứ tự bài học thành công");
      setHasOrderChanged(false);
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onError: () => toast.error("Cập nhật thứ tự bài học thất bại"),
  });

  const createLessonMutation = useMutation({
    mutationFn: (payload: {
      lesson: {
        title: string;
        description: string;
        content: string;
        isPreview: boolean;
        status: "PUBLIC" | "HIDDEN";
        duration: number;
        chapterId: number;
      };
      documentFile?: File;
      video?: File;
    }) => LessonApi.create(payload),
    onSuccess: () => {
      toast.success("Tạo bài học thành công");
      setIsCreateOpen(false);
      setCreateSelectedVideoFile(null);
      setCreateSelectedDocFile(null);
      setCreateVideoDuration(null);
      if (createVideoPreview) URL.revokeObjectURL(createVideoPreview);
      setCreateVideoPreview(null);
      if (createDocPreviewUrl) URL.revokeObjectURL(createDocPreviewUrl);
      setCreateDocPreviewUrl(null);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onError: () => toast.error("Tạo bài học thất bại"),
  });

  const updateLessonMutation = useMutation({
    mutationFn: (payload: {
      id: number;
      payload: {
        lesson: {
          title: string;
          description: string;
          content: string;
          isPreview: boolean;
          status: "PUBLIC" | "HIDDEN";
          duration: number;
        };
        documentFile: File | null;
        video: File | null;
      };
    }) => LessonApi.update(payload.id, payload.payload),
    onSuccess: () => {
      toast.success("Cập nhật bài học thành công");
      if (editVideoPreview) URL.revokeObjectURL(editVideoPreview);
      setEditSelectedVideoFile(null);
      setEditSelectedDocFile(null);
      setEditVideoDuration(null);
      setEditVideoPreview(null);
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onError: () => toast.error("Cập nhật bài học thất bại"),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id: number) => LessonApi.delete(id),
    onSuccess: () => {
      toast.success("Xoá bài học thành công");
      setIsDeleteOpen(false);
      setLessonToDelete(null);
      deleteForm.reset();
      queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
    },
    onError: () => toast.error("Xoá bài học thất bại"),
  });

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setVideoPreview(lesson.videoUrl || null);
    if (editVideoPreview) URL.revokeObjectURL(editVideoPreview);
    setEditSelectedVideoFile(null);
    setEditSelectedDocFile(null);
    setEditVideoDuration(null);
    setEditVideoPreview(null);
    if (editDocPreviewUrl) URL.revokeObjectURL(editDocPreviewUrl);
    setEditDocPreviewUrl(null);
    editForm.reset({
      title: lesson.title,
      content: lesson.content,
      description: lesson.description,
      status: lesson.status ?? "PUBLIC",
      isPreview: lesson.isPreview ?? false,
    });
    setIsEditOpen(true);
  };

  const handleUpdateLesson = (data: LessonFormData) => {
    if (!selectedLesson) return;
    updateLessonMutation.mutate({
      id: selectedLesson.id,
      payload: {
        lesson: {
          title: data.title,
          description: data.description || "",
          content: data.content,
          isPreview: data.isPreview,
          status: data.status,
          duration:
            editSelectedVideoFile && editVideoDuration != null
              ? editVideoDuration
              : selectedLesson.duration,
        },
        documentFile: editSelectedDocFile,
        video: editSelectedVideoFile,
      },
    });
  };

  const handleDeleteLesson = (lessonId: number) => {
    const target = lessons.find((l) => l.id === lessonId) || null;
    setLessonToDelete(target);
    deleteForm.reset({ confirmText: "" });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = (_data: DeleteConfirmData) => {
    if (!lessonToDelete) return;
    deleteLessonMutation.mutate(lessonToDelete.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={handleBackToChapters}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại quản lý chương
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý bài học</h2>
          <p className="text-muted-foreground">
            Quản lý các bài học của chương:{" "}
            {chapterData ? chapterData?.data?.title : ""}
          </p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetOrder}
                disabled={changeOrderMutation.isPending}
              >
                Hủy thay đổi
              </Button>
              <Button
                onClick={handleSaveOrder}
                className="bg-green-600 hover:bg-green-700"
                disabled={changeOrderMutation.isPending}
              >
                {changeOrderMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                    lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Cập nhật thứ tự
                  </>
                )}
              </Button>
            </div>
          )}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#155e94] hover:bg-[#0b4674]">
                <Plus className="mr-2 h-4 w-4" /> Thêm bài học
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo bài học mới</DialogTitle>
                <DialogDescription>
                  Thêm bài học mới vào chương học này.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={createForm.handleSubmit(handleCreateLesson)}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="create-title">Tiêu đề bài học *</Label>
                    <Input
                      id="create-title"
                      {...createForm.register("title")}
                      className={
                        createForm.formState.errors.title
                          ? "border-red-500"
                          : ""
                      }
                      disabled={createLessonMutation.isPending}
                      placeholder="Nhập tiêu đề bài học"
                    />
                    {createForm.formState.errors.title && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-description">Mô tả ngắn</Label>
                    <Textarea
                      id="create-description"
                      {...createForm.register("description")}
                      className={
                        createForm.formState.errors.description
                          ? "border-red-500"
                          : ""
                      }
                      rows={3}
                      disabled={createLessonMutation.isPending}
                      placeholder="Mô tả ngắn gọn về nội dung bài học"
                    />
                    {createForm.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Controller
                      name="status"
                      control={createForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={createLessonMutation.isPending}
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
                            <SelectItem value="PUBLIC">Công khai</SelectItem>
                            <SelectItem value="HIDDEN">Ẩn</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {createForm.formState.errors.status && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.status.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Cho phép xem trước</Label>
                    <Controller
                      name="isPreview"
                      control={createForm.control}
                      render={({ field }) => (
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="create-isPreview"
                              checked={field.value === true}
                              onChange={() => field.onChange(true)}
                              disabled={createLessonMutation.isPending}
                            />
                            <span>Có</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="create-isPreview"
                              checked={field.value === false}
                              onChange={() => field.onChange(false)}
                              disabled={createLessonMutation.isPending}
                            />
                            <span>Không</span>
                          </label>
                        </div>
                      )}
                    />
                    {createForm.formState.errors.isPreview && (
                      <p className="text-sm text-red-500">
                        {
                          createForm.formState.errors.isPreview
                            .message as string
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Nội dung bài học *</Label>
                    <Controller
                      name="content"
                      control={createForm.control}
                      render={({ field }) => (
                        <div
                          className={
                            createForm.formState.errors.content
                              ? "border border-red-500 rounded-md"
                              : ""
                          }
                        >
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Viết nội dung chi tiết của bài học..."
                          />
                        </div>
                      )}
                    />
                    {createForm.formState.errors.content && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.content.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Video bài học (tuỳ chọn)</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleCreateVideoSelect}
                        className="hidden"
                        ref={createVideoInputRef}
                        disabled={createLessonMutation.isPending}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => createVideoInputRef.current?.click()}
                        disabled={createLessonMutation.isPending}
                      >
                        <Video className="mr-2 h-4 w-4" /> Chọn video
                      </Button>
                      {createSelectedVideoFile && (
                        <span className="text-sm text-muted-foreground">
                          {createSelectedVideoFile.name}
                          {createVideoDuration
                            ? ` • ${createVideoDuration}`
                            : ""}
                        </span>
                      )}
                    </div>
                    {createVideoPreview && (
                      <div className="mt-2 w-full max-w-md">
                        <video
                          src={createVideoPreview}
                          preload="metadata"
                          controls
                          className="w-full rounded-md border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tệp video sẽ được tải lên sau khi tạo bài học thành công.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Tài liệu đính kèm (tuỳ chọn)</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip"
                        onChange={handleCreateDocSelect}
                        className="hidden"
                        ref={createDocInputRef}
                        disabled={createLessonMutation.isPending}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => createDocInputRef.current?.click()}
                        disabled={createLessonMutation.isPending}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Chọn tài liệu
                      </Button>
                      {createSelectedDocFile && (
                        <span className="text-sm text-muted-foreground">
                          {createSelectedDocFile.name}
                        </span>
                      )}
                    </div>
                    {createDocPreviewUrl && (
                      <div className="mt-2 w-full max-w-2xl h-[420px] border rounded-md overflow-hidden">
                        <iframe
                          src={createDocPreviewUrl}
                          className="w-full h-full"
                          title="Xem trước tài liệu"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tệp tài liệu sẽ được tải lên sau khi tạo bài học thành
                      công.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-[#155e94] hover:bg-[#0b4674]"
                    disabled={createLessonMutation.isPending}
                  >
                    {createLessonMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo bài học"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả bài học</CardTitle>
          <CardDescription>
            Danh sách tất cả các bài học trong chương này. Nhấn và kéo bất kỳ
            hàng nào để sắp xếp lại thứ tự các bài học.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lessons.length > 0 ? (
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
                      <TableHead>Bài học</TableHead>
                      <TableHead>Thời lượng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Video</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={lessons}
                      strategy={verticalListSortingStrategy}
                    >
                      {lessons.map((lesson) => (
                        <SortableTableRow
                          key={lesson.id}
                          lesson={lesson}
                          onEdit={handleEditLesson}
                          onDelete={handleDeleteLesson}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </div>
            </DndContext>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <FolderX className="h-10 w-10 mb-2" />
              <p>Không có dữ liệu phù hợp</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài học</DialogTitle>
            <DialogDescription>
              Thực hiện thay đổi cho bài học tại đây. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(handleUpdateLesson)}
            className="space-y-6"
          >
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Thứ tự trong chương</Label>
                <Input
                  value={`#${selectedLesson?.orderIndex || ""}`}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề bài học *</Label>
                <Input
                  id="edit-title"
                  {...editForm.register("title")}
                  className={
                    editForm.formState.errors.title ? "border-red-500" : ""
                  }
                  placeholder="Nhập tiêu đề bài học"
                />
                {editForm.formState.errors.title && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả ngắn</Label>
                <Textarea
                  id="edit-description"
                  {...editForm.register("description")}
                  className={
                    editForm.formState.errors.description
                      ? "border-red-500"
                      : ""
                  }
                  rows={3}
                  placeholder="Mô tả ngắn gọn về nội dung bài học"
                />
                {editForm.formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Controller
                  name="status"
                  control={editForm.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                        <SelectItem value="PUBLIC">Công khai</SelectItem>
                        <SelectItem value="HIDDEN">Ẩn</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {editForm.formState.errors.status && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.status.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Cho phép xem trước</Label>
                <Controller
                  name="isPreview"
                  control={editForm.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="edit-isPreview"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                        />
                        <span>Có</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="edit-isPreview"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                        />
                        <span>Không</span>
                      </label>
                    </div>
                  )}
                />
                {editForm.formState.errors.isPreview && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.isPreview.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Nội dung bài học *</Label>
                <Controller
                  name="content"
                  control={editForm.control}
                  render={({ field }) => (
                    <div
                      className={
                        editForm.formState.errors.content
                          ? "border border-red-500 rounded-md"
                          : ""
                      }
                    >
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Viết nội dung chi tiết của bài học..."
                      />
                    </div>
                  )}
                />
                {editForm.formState.errors.content && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tệp đính kèm</Label>
                  {videoPreview && !editVideoPreview && (
                    <div className="w-full max-w-md">
                      <p className="text-sm text-muted-foreground mb-2">
                        Video hiện tại:
                      </p>
                      <video
                        src={videoPreview}
                        preload="metadata"
                        controls
                        className="w-full rounded-md border"
                      >
                        Trình duyệt không hỗ trợ video này
                      </video>
                    </div>
                  )}
                  {editVideoPreview && (
                    <div className="w-full max-w-md">
                      <p className="text-sm text-muted-foreground mb-2">
                        Video mới (chưa tải lên):
                      </p>
                      <video
                        src={editVideoPreview}
                        preload="metadata"
                        controls
                        className="w-full rounded-md border"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleEditVideoSelect}
                      className="hidden"
                      ref={editVideoInputRef}
                      disabled={updateLessonMutation.isPending}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editVideoInputRef.current?.click()}
                      disabled={updateLessonMutation.isPending}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {videoPreview ? "Chọn/Thay đổi video" : "Chọn video"}
                    </Button>
                    {editSelectedVideoFile && (
                      <span className="text-sm text-muted-foreground">
                        {editSelectedVideoFile.name}
                        {editVideoDuration ? ` • ${editVideoDuration}` : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tài liệu đính kèm</Label>
                  {selectedLesson?.attachmentUrl && !editSelectedDocFile && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Tài liệu hiện tại:
                        <a
                          href={selectedLesson.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline ml-2"
                        >
                          Mở trong tab mới
                        </a>
                      </p>
                      {selectedLesson.attachmentUrl
                        .toLowerCase()
                        .endsWith(".pdf") && (
                        <div className="w-full max-w-2xl h-[420px] border rounded-md overflow-hidden">
                          <iframe
                            src={selectedLesson.attachmentUrl}
                            className="w-full h-full"
                            title="Tài liệu hiện tại"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip"
                      onChange={handleEditDocSelect}
                      className="hidden"
                      ref={editDocInputRef}
                      disabled={updateLessonMutation.isPending}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editDocInputRef.current?.click()}
                      disabled={updateLessonMutation.isPending}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Chọn tài liệu
                    </Button>
                    {editSelectedDocFile && (
                      <span className="text-sm text-muted-foreground">
                        {editSelectedDocFile.name}
                      </span>
                    )}
                  </div>
                  {editSelectedDocFile && editDocPreviewUrl && (
                    <div className="mt-2 w-full max-w-2xl h-[420px] border rounded-md overflow-hidden">
                      <iframe
                        src={editDocPreviewUrl}
                        className="w-full h-full"
                        title="Tài liệu mới"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Tệp sẽ được tải lên khi bạn Lưu thay đổi.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#155e94] hover:bg-[#0b4674]"
                disabled={updateLessonMutation.isPending}
              >
                {updateLessonMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                    lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xoá bài học</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Vui lòng nhập "OK" để xác nhận
              xoá bài học{lessonToDelete ? `: ${lessonToDelete.title}` : ""}.
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
