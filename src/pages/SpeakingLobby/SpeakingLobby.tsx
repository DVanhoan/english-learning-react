import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SpeakingApi } from "@/api/speaking.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "@/context/AuthContext";
import routes from "@/routes/routes.const";

export default function SpeakingLobby() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { state: { isAuthenticated } } = useAuth();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [roomNameInput, setRoomNameInput] = useState("");

    const { data: topicsData } = useQuery({
        queryKey: ["speaking-topics"],
        queryFn: SpeakingApi.getTopics,
    });

    const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
        queryKey: ["active-rooms"],
        queryFn: SpeakingApi.getActiveRooms,
        refetchInterval: 5000,
    });

    const createRoomMutation = useMutation({
        mutationFn: (data: { topicId: number; roomName: string }) =>
            SpeakingApi.createRoom(data.topicId, data.roomName),
        onSuccess: (res) => {
            toast.success("Tạo phòng thành công!");
            setIsCreateOpen(false);
            setRoomNameInput("");
            navigate(`/speaking/room/${res.data.id}`);
            queryClient.invalidateQueries({ queryKey: ["active-rooms"] });
        },
        onError: () => toast.error("Tạo phòng thất bại"),
    });

    const handleCreateRoom = () => {
        if (!isAuthenticated) {
            toast.info("Vui lòng đăng nhập để tạo phòng");
            navigate(routes.SIGN_IN);
            return;
        }

        if (!selectedTopicId || !roomNameInput.trim()) {
            toast.warn("Vui lòng chọn chủ đề và nhập tên phòng");
            return;
        }
        createRoomMutation.mutate({
            topicId: selectedTopicId,
            roomName: roomNameInput
        });
    };

    const handleJoinRoom = (roomId: number) => {
        if (!isAuthenticated) {
            toast.info("Vui lòng đăng nhập để tham gia");
            navigate(routes.SIGN_IN);
            return;
        }
        navigate(`/speaking/room/${roomId}`);
    };

    const topics = topicsData?.data || [];
    const rooms = roomsData?.data || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="main-layout">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary-color">Luyện Nói Tiếng Anh</h1>
                        <p className="text-gray-600">Tham gia các phòng chat video để luyện tập cùng cộng đồng.</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="mr-2 h-4 w-4" /> Tạo phòng mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Tạo phòng luyện nói</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Tên phòng</Label>
                                    <Input
                                        placeholder="Ví dụ: Luyện IELTS Part 1..."
                                        value={roomNameInput}
                                        onChange={(e) => setRoomNameInput(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Chọn chủ đề</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto border p-2 rounded">
                                        {topics.map(topic => (
                                            <Card
                                                key={topic.id}
                                                className={`cursor-pointer transition-all ${selectedTopicId === topic.id ? "border-2 border-primary-color bg-blue-50" : "hover:border-gray-400"}`}
                                                onClick={() => setSelectedTopicId(topic.id)}
                                            >
                                                <div className="flex items-center p-3 gap-3">
                                                    <img src={topic.imageUrl || "/placeholder.svg"} className="w-12 h-12 rounded object-cover" />
                                                    <div>
                                                        <h4 className="font-bold text-sm">{topic.title}</h4>
                                                        <Badge variant="outline" className="mt-1 text-xs">{topic.level}</Badge>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleCreateRoom} disabled={createRoomMutation.isPending}>
                                    {createRoomMutation.isPending ? "Đang tạo..." : "Tạo phòng"}
                                </Button>
                            </div>

                        </DialogContent>
                    </Dialog>
                </div>

                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Video className="text-red-500" /> Phòng đang hoạt động ({rooms.length})
                </h2>

                {isLoadingRooms ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : rooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map(room => (
                            <Card key={room.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <Badge className="w-fit mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">{room.topic.title}</Badge>
                                    <CardTitle className="text-lg">{room.roomName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Users className="h-4 w-4 mr-1" /> {room.currentParticipants} người
                                        </div>
                                        <Button onClick={() => handleJoinRoom(room.id)} variant="outline">Tham gia ngay</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                        <p className="text-gray-500">Chưa có phòng nào đang hoạt động. Hãy tạo phòng mới!</p>
                    </div>
                )}
            </div>
        </div>
    );
}