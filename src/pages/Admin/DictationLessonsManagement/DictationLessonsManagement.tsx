import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Search, Edit, Trash2, Loader2, ArrowLeft } from "lucide-react";
import DynamicPagination from "@/components/DynamicPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DictationApi } from "@/api/dictation.api";
import type { DictationLesson, DictationLessonRequest, DictationSentenceRequest } from "@/types/dictation.type";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import routes from "@/routes/routes.const";

// Form Data Type
interface LessonFormData {
  title: string;
  subtitle: string;
  description: string;
  vocabLevel: string;
  duration: string;
  audioFile: File | null;
  sentencesText: string; // Nhập nhanh: mỗi dòng 1 câu
}

const initialFormState: LessonFormData = {
  title: "", subtitle: "", description: "", vocabLevel: "A1", duration: "00:00", audioFile: null, sentencesText: ""
};

export default function DictationLessonsManagement() {
  const { topicId } = useParams<{ topicId: string }>(); // Lấy topicId từ URL
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<DictationLesson | null>(null);
  const [formData, setFormData] = useState<LessonFormData>(initialFormState);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  // 1. Fetch Topic Info (để hiển thị tên chủ đề)
  const { data: topicData } = useQuery({
    queryKey: ["dictation-topic-detail", topicId],
    queryFn: () => DictationApi.getTopicById(topicId!),
    enabled: !!topicId
  });

  // 2. Fetch Lessons by Topic
  const { data: lessonsData, isLoading } = useQuery({
    queryKey: ["dictation-lessons-admin", topicId],
    queryFn: () => DictationApi.getLessonsByTopic(topicId!),
    enabled: !!topicId
  });

  const allLessons = lessonsData?.data || [];
  const filteredLessons = allLessons.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 3. MUTATIONS
  const createMutation = useMutation({
    mutationFn: (data: { req: DictationLessonRequest, file?: File }) => DictationApi.createLesson(data.req, data.file),
    onSuccess: () => {
      toast.success("Tạo bài học thành công");
      setIsCreateOpen(false); setFormData(initialFormState);
      queryClient.invalidateQueries({ queryKey: ["dictation-lessons-admin", topicId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Tạo thất bại")
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, req: DictationLessonRequest, file?: File }) => DictationApi.updateLesson(data.id, data.req, data.file),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      setIsEditOpen(false); setSelectedLesson(null);
      queryClient.invalidateQueries({ queryKey: ["dictation-lessons-admin", topicId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Cập nhật thất bại")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => DictationApi.deleteLesson(id),
    onSuccess: () => {
      toast.success("Xóa thành công");
      queryClient.invalidateQueries({ queryKey: ["dictation-lessons-admin", topicId] });
    }
  });

  // Handlers
  const parseSentences = (text: string): DictationSentenceRequest[] => {
    return text.split('\n').filter(line => line.trim()).map((line, index) => ({
      text: line.trim(),
      startTime: index * 5.0, // Demo: 5s mỗi câu
      endTime: (index + 1) * 5.0,
      orderIndex: index + 1
    }));
  };

  const handleCreate = () => {
    const request: DictationLessonRequest = {
      title: formData.title, subtitle: formData.subtitle, description: formData.description,
      vocabLevel: formData.vocabLevel, duration: formData.duration,
      topicId: Number(topicId), // Gắn cứng Topic ID từ URL
      sentences: parseSentences(formData.sentencesText)
    };
    createMutation.mutate({ req: request, file: formData.audioFile || undefined });
  };

  const handleUpdate = () => {
    if (!selectedLesson) return;
    const request: DictationLessonRequest = {
      title: formData.title, subtitle: formData.subtitle, description: formData.description,
      vocabLevel: formData.vocabLevel, duration: formData.duration,
      topicId: Number(topicId),
      sentences: parseSentences(formData.sentencesText)
    };
    updateMutation.mutate({ id: selectedLesson.id, req: request, file: formData.audioFile || undefined });
  };

  const openEdit = (lesson: DictationLesson) => {
    setSelectedLesson(lesson);
    setFormData({
      title: lesson.title, subtitle: lesson.subtitle || "", description: lesson.description || "",
      vocabLevel: lesson.vocabLevel || "A1", duration: lesson.duration || "00:00",
      audioFile: null, sentencesText: lesson.sentences.map(s => s.text).join('\n')
    });
    setIsEditOpen(true);
  }

  const handleDelete = (id: number) => confirm("Xóa bài học này?") && deleteMutation.mutate(id);

  // Render Form
  const renderForm = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label>Tiêu đề</Label>
        <Input
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={formData.subtitle}
          onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Trình độ</Label>
          <Select value={formData.vocabLevel} onValueChange={v => setFormData({ ...formData, vocabLevel: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["A1", "A2", "B1", "B2", "C1", "C2"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Thời lượng</Label>
          <Input
            value={formData.duration}
            onChange={e => setFormData({ ...formData, duration: e.target.value })}
            placeholder="05:30" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>File Audio/Video</Label>
        <Input
          type="file"
          accept="audio/*,video/*"
          onChange={e => setFormData({ ...formData, audioFile: e.target.files?.[0] || null })} />
      </div>
      <div className="space-y-2">
        <Label>Nội dung (Mỗi câu 1 dòng)</Label>
        <Textarea
          rows={6}
          value={formData.sentencesText}
          onChange={e => setFormData({ ...formData, sentencesText: e.target.value })}
          placeholder="Nhập transcript tại đây..." />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" asChild className="-ml-2"><Link to={routes.DICTATION_TOPICS_MANAGEMENT}><ArrowLeft className="h-5 w-5" /></Link></Button>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài học</h2>
          </div>
          <p className="text-muted-foreground">Chủ đề: <span className="font-semibold text-primary-color">{topicData?.data.title}</span></p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild><Button className="bg-primary-color"><Plus className="mr-2 h-4 w-4" /> Thêm Bài học</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[600px]"><DialogHeader><DialogTitle>Tạo Bài học Mới</DialogTitle></DialogHeader>{renderForm()}<DialogFooter><Button onClick={handleCreate} disabled={createMutation.isPending}>Tạo</Button></DialogFooter></DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Danh sách ({filteredLessons.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4"><Input placeholder="Tìm kiếm bài học..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
          {isLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : (
            <div className="rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead>Tiêu đề</TableHead><TableHead>Subtitle</TableHead><TableHead>Số câu</TableHead><TableHead>Ngày tạo</TableHead><TableHead className="text-right">Hành động</TableHead></TableRow></TableHeader>
                <TableBody>
                  {paginatedLessons.map(lesson => (
                    <TableRow key={lesson.id}>
                      <TableCell><div className="font-medium">{lesson.title}</div></TableCell>
                      <TableCell>{lesson.subtitle}</TableCell>
                      <TableCell>{lesson.sentences?.length || 0}</TableCell>
                      <TableCell>{dayjs(lesson.createdAt).format("DD/MM/YYYY")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(lesson)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(lesson.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4"><DynamicPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cập nhật Bài học</DialogTitle>
          </DialogHeader>{renderForm()}<DialogFooter>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}