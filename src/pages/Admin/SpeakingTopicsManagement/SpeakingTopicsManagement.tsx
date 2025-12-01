import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SpeakingApi } from "@/api/speaking.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { SpeakingTopic, SpeakingTopicRequest } from "@/types/speaking.type";

const initialForm: SpeakingTopicRequest = { title: "", description: "", level: "Beginner" };

export default function SpeakingTopicsManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState<SpeakingTopicRequest>(initialForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic | null>(null);

    const queryClient = useQueryClient();

    // Get List
    const { data: topicsData, isLoading } = useQuery({
        queryKey: ["admin-speaking-topics"],
        queryFn: SpeakingApi.getTopics,
    });
    const topics = topicsData?.data || [];

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: () => SpeakingApi.createTopic(formData, imageFile || undefined),
        onSuccess: () => {
            toast.success("Tạo chủ đề thành công");
            setIsCreateOpen(false); setFormData(initialForm); setImageFile(null);
            queryClient.invalidateQueries({ queryKey: ["admin-speaking-topics"] });
        },
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: () => SpeakingApi.updateTopic(selectedTopic!.id, formData, imageFile || undefined),
        onSuccess: () => {
            toast.success("Cập nhật thành công");
            setIsEditOpen(false); setSelectedTopic(null);
            queryClient.invalidateQueries({ queryKey: ["admin-speaking-topics"] });
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => SpeakingApi.deleteTopic(id),
        onSuccess: () => {
            toast.success("Xóa thành công");
            queryClient.invalidateQueries({ queryKey: ["admin-speaking-topics"] });
        }
    });

    const handleEditClick = (topic: SpeakingTopic) => {
        setSelectedTopic(topic);
        setFormData({ title: topic.title, description: topic.description, level: topic.level });
        setImageFile(null);
        setIsEditOpen(true);
    };

    const renderForm = () => (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Tiêu đề</label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả / Câu hỏi gợi ý</label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Cấp độ</label>
                    <Select value={formData.level} onValueChange={v => setFormData({ ...formData, level: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {["Beginner", "Intermediate", "Advanced"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Ảnh bìa</label>
                    <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Quản lý Chủ đề Speaking</h2>
                <Button onClick={() => { setFormData(initialForm); setIsCreateOpen(true); }} className="bg-primary-color">
                    <Plus className="mr-2 h-4 w-4" /> Thêm chủ đề
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Danh sách chủ đề ({topics.length})</CardTitle></CardHeader>
                <CardContent>
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow><TableHead>Ảnh</TableHead><TableHead>Tiêu đề</TableHead><TableHead>Cấp độ</TableHead><TableHead>Mô tả</TableHead><TableHead className="text-right">Hành động</TableHead></TableRow>
                            </TableHeader>
                            <TableBody>
                                {topics.map(topic => (
                                    <TableRow key={topic.id}>
                                        <TableCell><img src={topic.imageUrl || "/placeholder.svg"} className="w-12 h-12 rounded object-cover" /></TableCell>
                                        <TableCell className="font-medium">{topic.title}</TableCell>
                                        <TableCell><span className="px-2 py-1 rounded bg-gray-100 text-xs">{topic.level}</span></TableCell>
                                        <TableCell className="max-w-xs truncate text-gray-500">{topic.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(topic)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { if (confirm("Xóa chủ đề này?")) deleteMutation.mutate(topic.id); }}><Trash2 className="h-4 w-4" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent><DialogHeader><DialogTitle>Tạo chủ đề mới</DialogTitle></DialogHeader>
                    {renderForm()}
                    <DialogFooter><Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>Lưu</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent><DialogHeader><DialogTitle>Cập nhật chủ đề</DialogTitle></DialogHeader>
                    {renderForm()}
                    <DialogFooter><Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>Lưu thay đổi</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}