import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MoreHorizontal, Plus, Edit, Trash2, Loader2, BookOpen
} from "lucide-react";
import DynamicPagination from "@/components/DynamicPagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DictationApi } from "@/api/dictation.api";
import type { DictationTopic, DictationTopicRequest } from "@/types/dictation.type";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import routes from "@/routes/routes.const";
import { Checkbox } from "@/components/ui/checkbox";

interface TopicFormData {
    title: string;
    description: string;
    category: string;
    levelRange: string;
    difficulty: string;
    hasVideo: boolean;
    thumbnail: File | null;
}

const initialFormState: TopicFormData = {
    title: "", description: "", category: "", levelRange: "A1-B1", difficulty: "Easy", hasVideo: false, thumbnail: null
};

export default function DictationTopicsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<DictationTopic | null>(null);
    const [formData, setFormData] = useState<TopicFormData>(initialFormState);
    const itemsPerPage = 10;
    const queryClient = useQueryClient();

    const { data: topicsData, isLoading } = useQuery({
        queryKey: ["admin-dictation-topics"],
        queryFn: DictationApi.getAllTopics,
        staleTime: 0
    });

    const allTopics = topicsData?.data || [];

    // Filter & Pagination Client-side
    const filteredTopics = allTopics.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
    const paginatedTopics = filteredTopics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // 2. MUTATIONS
    const createMutation = useMutation({
        mutationFn: (data: TopicFormData) => {
            const request: DictationTopicRequest = {
                title: data.title, description: data.description, category: data.category,
                levelRange: data.levelRange, difficulty: data.difficulty, hasVideo: data.hasVideo
            };
            return DictationApi.createTopic(request, data.thumbnail || undefined);
        },
        onSuccess: () => {
            toast.success("Tạo chủ đề thành công");
            setIsCreateOpen(false); setFormData(initialFormState);
            queryClient.invalidateQueries({ queryKey: ["admin-dictation-topics"] });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Tạo thất bại")
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: number, form: TopicFormData }) => {
            const request: DictationTopicRequest = {
                title: data.form.title, description: data.form.description, category: data.form.category,
                levelRange: data.form.levelRange, difficulty: data.form.difficulty, hasVideo: data.form.hasVideo
            };
            return DictationApi.updateTopic(data.id, request, data.form.thumbnail || undefined);
        },
        onSuccess: () => {
            toast.success("Cập nhật thành công");
            setIsEditOpen(false); setSelectedTopic(null);
            queryClient.invalidateQueries({ queryKey: ["admin-dictation-topics"] });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Cập nhật thất bại")
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => DictationApi.deleteTopic(id),
        onSuccess: () => {
            toast.success("Xóa thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-dictation-topics"] });
        }
    });

    // Handlers
    const handleCreate = () => createMutation.mutate(formData);
    const handleUpdate = () => selectedTopic && updateMutation.mutate({ id: selectedTopic.id, form: formData });
    const handleDelete = (id: number) => confirm("Xóa chủ đề sẽ xóa tất cả bài học bên trong. Tiếp tục?") && deleteMutation.mutate(id);

    const openEdit = (topic: DictationTopic) => {
        setSelectedTopic(topic);
        setFormData({
            title: topic.title, description: topic.description || "", category: topic.category || "",
            levelRange: topic.levelRange || "A1-B1", difficulty: topic.difficulty || "Easy",
            hasVideo: topic.hasVideo, thumbnail: null
        });
        setIsEditOpen(true);
    }

    // Render Form
    const renderForm = () => (
        <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Tiêu đề</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Mô tả</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Danh mục</Label><Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="TOEIC, IELTS..." /></div>
                <div className="space-y-2"><Label>Độ khó</Label>
                    <Select value={formData.difficulty} onValueChange={v => setFormData({ ...formData, difficulty: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2"><Label>Thumbnail</Label><Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })} /></div>
            <div className="flex items-center gap-2"><Checkbox id="hasVideo" checked={formData.hasVideo} onCheckedChange={(c) => setFormData({ ...formData, hasVideo: c as boolean })} /><Label htmlFor="hasVideo">Chủ đề này có Video?</Label></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Quản lý Chủ đề Dictation</h2>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild><Button className="bg-primary-color"><Plus className="mr-2 h-4 w-4" /> Thêm Chủ đề</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Tạo Chủ đề Mới</DialogTitle></DialogHeader>{renderForm()}<DialogFooter><Button onClick={handleCreate} disabled={createMutation.isPending}>Tạo</Button></DialogFooter></DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader><CardTitle>Danh sách ({filteredTopics.length})</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Input placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm" />
                    </div>
                    {isLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader><TableRow><TableHead>Thumbnail</TableHead><TableHead>Tiêu đề</TableHead><TableHead>Cấp độ</TableHead><TableHead>Bài học</TableHead><TableHead className="text-right">Hành động</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {paginatedTopics.map(topic => (
                                        <TableRow key={topic.id}>
                                            <TableCell><img src={topic.thumbnailUrl || "/placeholder.svg"} className="w-12 h-12 object-cover rounded" alt="" /></TableCell>
                                            <TableCell><div className="font-medium">{topic.title}</div><div className="text-xs text-gray-500">{topic.category}</div></TableCell>
                                            <TableCell>{topic.levelRange} ({topic.difficulty})</TableCell>
                                            <TableCell>{topic.lessonCount}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* NÚT QUẢN LÝ BÀI HỌC */}
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link to={routes.DICTATION_LESSONS_MANAGEMENT.replace(":topicId", String(topic.id))}>
                                                            <BookOpen className="h-4 w-4 mr-1" /> Bài học
                                                        </Link>
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEdit(topic)}><Edit className="mr-2 h-4 w-4" /> Sửa</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(topic.id)}><Trash2 className="mr-2 h-4 w-4" /> Xóa</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent><DialogHeader><DialogTitle>Cập nhật Chủ đề</DialogTitle></DialogHeader>{renderForm()}<DialogFooter><Button onClick={handleUpdate} disabled={updateMutation.isPending}>Lưu</Button></DialogFooter></DialogContent>
            </Dialog>
        </div>
    );
}