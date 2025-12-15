import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import SimplePeer, { type Instance } from "simple-peer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User } from "lucide-react";
import useAuth from "@/context/AuthContext";
import { toast } from "react-toastify";

const iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
    ],
};

interface PeerData {
    peerId: string;
    peer: Instance;
    userName: string;
}

export default function SpeakingRoom() {
    const { roomId } = useParams<{ roomId: string }>();
    const { state: { user } } = useAuth();
    const navigate = useNavigate();

    const [peers, setPeers] = useState<PeerData[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const userVideo = useRef<HTMLVideoElement>(null);

    // Refs để giữ giá trị không bị reset khi render lại
    const peersRef = useRef<PeerData[]>([]);
    const stompClient = useRef<any>(null);
    const socket = useRef<any>(null);
    const userIdRef = useRef(user?.id);
    const userNameRef = useRef(user?.fullName);

    // Cờ quan trọng để chặn StrictMode chạy 2 lần
    const isInitiated = useRef(false);

    // Cập nhật Ref khi user thay đổi
    useEffect(() => {
        if (user) {
            userIdRef.current = user.id;
            userNameRef.current = user.fullName;
        }
    }, [user]);

    useEffect(() => {
        // 1. Chặn nếu chưa có User hoặc đã khởi tạo rồi
        if (!user || isInitiated.current) return;

        // Đánh dấu đã khởi tạo
        isInitiated.current = true;

        const init = async () => {
            try {
                const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(currentStream);

                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }

                // Chỉ kết nối socket khi đã có stream
                connectToSocket(currentStream);
            } catch (err) {
                console.error("Lỗi media:", err);
                toast.error("Không thể truy cập Camera/Micro. Vui lòng kiểm tra quyền.");
            }
        };

        init();

        // Cleanup function
        return () => {
            // Khi component unmount thật sự (rời trang), mới dọn dẹp
            // Lưu ý: Trong StrictMode dev, cleanup này sẽ chạy 1 lần, nhưng isInitiated vẫn giữ true
            // nên lần mount thứ 2 sẽ bị chặn ở dòng `if (isInitiated.current) return`.
            // Tuy nhiên, để đảm bảo dọn dẹp đúng khi rời trang hẳn:
            if (stream) stream.getTracks().forEach((track) => track.stop());
            if (stompClient.current) stompClient.current.disconnect();
            peersRef.current.forEach((p) => p.peer.destroy());
            peersRef.current = [];
            setPeers([]);
            isInitiated.current = false; // Reset cờ khi rời trang hẳn
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, user]); // Phụ thuộc vào roomId và user

    const connectToSocket = (currentStream: MediaStream) => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080/e-learning/ws";
        socket.current = new SockJS(socketUrl);
        stompClient.current = Stomp.over(socket.current);
        stompClient.current.debug = null;

        stompClient.current.connect({}, () => {
            console.log(">> WebSocket Connected. My ID:", userIdRef.current);

            stompClient.current.subscribe(`/topic/room/${roomId}`, (message: any) => {
                const payload = JSON.parse(message.body);

                // Ép kiểu về String để so sánh chính xác
                const myId = String(userIdRef.current);
                const senderId = String(payload.senderId || payload.userId);

                // --- LOG DEBUG: Kiểm tra xem tại sao lọc bị trượt ---
                // console.log(`Check: Msg from ${senderId} vs My ID ${myId}`);

                if (senderId === myId) {
                    return; // Bỏ qua tin nhắn của chính mình
                }

                handleSignalMessage(payload, currentStream, senderId);
            });

            // Gửi JOIN
            stompClient.current.send(
                `/app/join/${roomId}`,
                {},
                JSON.stringify({
                    userId: userIdRef.current,
                    senderName: userNameRef.current || "Người dùng",
                    type: "JOIN"
                })
            );
        });
    };

    const handleSignalMessage = (payload: any, currentStream: MediaStream, senderId: string) => {
        const senderName = payload.senderName || "Người dùng";
        const currentUserId = String(userIdRef.current);

        switch (payload.type) {
            case "JOIN":
                if (!peersRef.current.find((p) => p.peerId === senderId)) {
                    console.log(">> New User Joined:", senderName);
                    const peer = createPeer(senderId, currentUserId, currentStream);
                    const peerObj = { peerId: senderId, peer, userName: senderName };

                    peersRef.current.push(peerObj);
                    setPeers((prev) => [...prev, peerObj]);
                }
                break;

            case "OFFER":
                if (String(payload.receiverId) === currentUserId) {
                    if (peersRef.current.find((p) => p.peerId === senderId)) return;

                    console.log(">> Received Offer from:", senderName);
                    const peer = addPeer(payload.sdp, senderId, currentUserId, currentStream);
                    const peerObj = { peerId: senderId, peer, userName: senderName };

                    peersRef.current.push(peerObj);
                    setPeers((prev) => [...prev, peerObj]);
                }
                break;

            case "ANSWER":
                if (String(payload.receiverId) === currentUserId) {
                    const item = peersRef.current.find((p) => p.peerId === senderId);
                    if (item) item.peer.signal(payload.sdp);
                }
                break;

            case "CANDIDATE":
                if (String(payload.receiverId) === currentUserId) {
                    const item = peersRef.current.find((p) => p.peerId === senderId);
                    if (item) item.peer.signal(payload.candidate);
                }
                break;

            case "LEAVE":
                {
                    const leaver = peersRef.current.find(p => p.peerId === senderId);
                    if (leaver) leaver.peer.destroy();
                    const newPeers = peersRef.current.filter(p => p.peerId !== senderId);
                    peersRef.current = newPeers;
                    setPeers(newPeers);
                    break;
                }
        }
    };

    const createPeer = (userToSignal: string, callerId: string, stream: MediaStream) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            config: iceServers,
            stream: stream,
        });

        peer.on("signal", (signal) => {
            const myName = userNameRef.current;
            if (signal.type === "offer") {
                stompClient.current.send(`/app/offer/${roomId}`, {}, JSON.stringify({
                    type: "OFFER", sdp: signal, senderId: callerId, senderName: myName, receiverId: userToSignal
                }));
            } else if ((signal as any).candidate) {
                stompClient.current.send(`/app/candidate/${roomId}`, {}, JSON.stringify({
                    type: "CANDIDATE", candidate: signal, senderId: callerId, receiverId: userToSignal
                }));
            }
        });
        return peer;
    };

    const addPeer = (incomingSignal: any, callerId: string, receiverId: string, stream: MediaStream) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            config: iceServers,
            stream: stream,
        });

        peer.on("signal", (signal) => {
            const myName = userNameRef.current;
            if (signal.type === "answer") {
                stompClient.current.send(`/app/answer/${roomId}`, {}, JSON.stringify({
                    type: "ANSWER", sdp: signal, senderId: receiverId, senderName: myName, receiverId: callerId
                }));
            } else if ((signal as any).candidate) {
                stompClient.current.send(`/app/candidate/${roomId}`, {}, JSON.stringify({
                    type: "CANDIDATE", candidate: signal, senderId: receiverId, receiverId: callerId
                }));
            }
        });

        peer.signal(incomingSignal);
        return peer;
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoOff(!isVideoOff);
        }
    };

    const leaveRoom = () => {
        if (stompClient.current) {
            stompClient.current.send(`/app/leave/${roomId}`, {}, JSON.stringify({
                userId: userIdRef.current, type: "LEAVE"
            }));
            stompClient.current.disconnect();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        isInitiated.current = false;
        navigate("/speaking");
    };

    return (
        <div className="h-screen bg-gray-950 text-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 px-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Phòng: {roomId}</h2>
                    <Badge variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
                        {peers.length + 1} người tham gia
                    </Badge>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto p-4">
                {/* 1. KHUNG HÌNH CỦA CHÍNH BẠN */}
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video border-2 border-blue-500 shadow-lg">
                    <video ref={userVideo} muted autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                    <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Bạn ({user?.fullName})
                    </div>
                    {(isMuted || isVideoOff) && (
                        <div className="absolute top-3 right-3 flex gap-2">
                            {isMuted && <div className="bg-red-500 p-1.5 rounded-full"><MicOff size={14} /></div>}
                            {isVideoOff && <div className="bg-red-500 p-1.5 rounded-full"><VideoOff size={14} /></div>}
                        </div>
                    )}
                </div>

                {/* 2. KHUNG HÌNH CỦA NGƯỜI KHÁC (Đã lọc trùng lặp) */}
                {peers.map((p) => {
                    // Thêm một lớp bảo vệ cuối cùng: Không render nếu ID trùng với mình
                    if (String(p.peerId) === String(user?.id)) return null;

                    return (
                        <VideoCard key={p.peerId} peer={p.peer} userName={p.userName} />
                    )
                })}
            </div>

            {/* Controls... (Giữ nguyên) */}
            <div className="h-20 flex items-center justify-center gap-6 mt-4 bg-gray-900 rounded-2xl shadow-xl border border-gray-800">
                <Button onClick={toggleMute} variant={isMuted ? "destructive" : "secondary"} className="rounded-full h-12 w-12 p-0">
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>
                <Button onClick={toggleVideo} variant={isVideoOff ? "destructive" : "secondary"} className="rounded-full h-12 w-12 p-0">
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </Button>
                <div className="w-px h-8 bg-gray-700 mx-2"></div>
                <Button onClick={leaveRoom} className="bg-red-600 hover:bg-red-700 rounded-full px-8 h-12 font-medium">
                    <PhoneOff className="mr-2 h-5 w-5" /> Rời phòng
                </Button>
            </div>
        </div>
    );
}

// ... VideoCard component giữ nguyên
const VideoCard = ({ peer, userName }: { peer: Instance, userName: string }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        peer.on("stream", (stream) => {
            if (ref.current) ref.current.srcObject = stream;
        });
    }, [peer]);

    return (
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video border border-gray-700 shadow-lg">
            <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                <User size={14} className="text-blue-400" /> {userName}
            </div>
        </div>
    );
};