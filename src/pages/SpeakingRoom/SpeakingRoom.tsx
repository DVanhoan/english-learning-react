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
    const peersRef = useRef<PeerData[]>([]);
    const stompClient = useRef<any>(null);
    const socket = useRef<any>(null);

    useEffect(() => {
        if (!user) return;

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }
                connectToSocket(currentStream);
            })
            .catch((err) => {
                console.error("Lỗi media:", err);
                toast.error("Không thể truy cập Camera/Micro. Vui lòng kiểm tra quyền.");
            });

        return () => {
            if (stream) stream.getTracks().forEach((track) => track.stop());
            if (stompClient.current) stompClient.current.disconnect();

            peersRef.current.forEach((p) => {
                if (p.peer) p.peer.destroy();
            });
            peersRef.current = [];
            setPeers([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    const connectToSocket = (currentStream: MediaStream) => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080/e-learning/ws";
        socket.current = new SockJS(socketUrl);
        stompClient.current = Stomp.over(socket.current);
        stompClient.current.debug = null;

        stompClient.current.connect({}, () => {
            console.log(">> Đã kết nối WebSocket");

            stompClient.current.subscribe(`/topic/room/${roomId}`, (message: any) => {
                const payload = JSON.parse(message.body);


                if (String(payload.senderId) === String(user?.id) || String(payload.userId) === String(user?.id)) {
                    return;
                }

                handleSignalMessage(payload, currentStream);
            });

            stompClient.current.send(
                `/app/join/${roomId}`,
                {},
                JSON.stringify({
                    userId: user?.id,
                    senderName: user?.fullName || "Người dùng",
                    type: "JOIN"
                })
            );
        });
    };

    const handleSignalMessage = (payload: any, currentStream: MediaStream) => {
        const senderId = String(payload.senderId || payload.userId);
        const senderName = payload.senderName || "Người dùng";

        switch (payload.type) {
            case "JOIN":
                if (!peersRef.current.find((p) => p.peerId === senderId)) {
                    console.log(">> Nhận JOIN từ:", senderName, "-> Gọi lại (Initiator)");
                    const peer = createPeer(senderId, user?.id, currentStream, senderName);
                    const peerObj = { peerId: senderId, peer, userName: senderName };

                    peersRef.current.push(peerObj);
                    setPeers((prev) => [...prev, peerObj]);
                }
                break;

            case "OFFER":
                console.log(">> Nhận OFFER từ:", senderName);
                if (String(payload.receiverId) === String(user?.id)) {
                    if (peersRef.current.find((p) => p.peerId === senderId)) {
                        return;
                    }

                    const peer = addPeer(payload.sdp, senderId, user?.id, currentStream, senderName);
                    const peerObj = { peerId: senderId, peer, userName: senderName };

                    peersRef.current.push(peerObj);
                    setPeers((prev) => [...prev, peerObj]);
                }
                break;

            case "ANSWER":
                console.log(">> Nhận ANSWER từ:", senderId);
                if (String(payload.receiverId) === String(user?.id)) {
                    const item = peersRef.current.find((p) => p.peerId === senderId);
                    if (item) {
                        item.peer.signal(payload.sdp);
                    }
                }
                break;

            case "CANDIDATE":
                if (String(payload.receiverId) === String(user?.id)) {
                    const item = peersRef.current.find((p) => p.peerId === senderId);
                    if (item) {
                        item.peer.signal(payload.candidate);
                    }
                }
                break;

            case "LEAVE":
                console.log(">> Người dùng rời phòng:", senderId);
                {
                    const leaver = peersRef.current.find(p => p.peerId === senderId);
                    if (leaver) {
                        leaver.peer.destroy();
                    }
                    const newPeers = peersRef.current.filter(p => p.peerId !== senderId);
                    peersRef.current = newPeers;
                    setPeers(newPeers);
                }
                break;
        }
    };

    const createPeer = (userToSignal: string, callerId: any, stream: MediaStream, userNameToSignal: string) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            config: iceServers,
            stream: stream,
        });

        peer.on("signal", (signal) => {
            if (signal.type === "offer") {
                stompClient.current.send(`/app/offer/${roomId}`, {}, JSON.stringify({
                    type: "OFFER",
                    sdp: signal,
                    senderId: callerId,
                    senderName: user?.fullName,
                    receiverId: userToSignal
                }));
            } else if ((signal as any).candidate) {
                stompClient.current.send(`/app/candidate/${roomId}`, {}, JSON.stringify({
                    type: "CANDIDATE",
                    candidate: signal,
                    senderId: callerId,
                    receiverId: userToSignal
                }));
            }
        });

        return peer;
    };

    const addPeer = (incomingSignal: any, callerId: string, receiverId: any, stream: MediaStream, senderName: string) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            config: iceServers,
            stream: stream,
        });

        peer.on("signal", (signal) => {
            if (signal.type === "answer") {
                stompClient.current.send(`/app/answer/${roomId}`, {}, JSON.stringify({
                    type: "ANSWER",
                    sdp: signal,
                    senderId: receiverId,
                    senderName: user?.fullName,
                    receiverId: callerId
                }));
            } else if ((signal as any).candidate) {
                stompClient.current.send(`/app/candidate/${roomId}`, {}, JSON.stringify({
                    type: "CANDIDATE",
                    candidate: signal,
                    senderId: receiverId,
                    receiverId: callerId
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
                userId: user?.id, type: "LEAVE"
            }));
            stompClient.current.disconnect();
        }
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
                <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video border-2 border-blue-500 shadow-lg">
                    <video
                        ref={userVideo}
                        muted
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
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

                {peers.map((p) => (
                    <VideoCard key={p.peerId} peer={p.peer} userName={p.userName} />
                ))}
            </div>

            <div className="h-20 flex items-center justify-center gap-6 mt-4 bg-gray-900 rounded-2xl shadow-xl border border-gray-800">
                <Button
                    onClick={toggleMute}
                    variant={isMuted ? "destructive" : "secondary"}
                    className={`rounded-full h-12 w-12 p-0 transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>

                <Button
                    onClick={toggleVideo}
                    variant={isVideoOff ? "destructive" : "secondary"}
                    className={`rounded-full h-12 w-12 p-0 transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </Button>

                <div className="w-px h-8 bg-gray-700 mx-2"></div>

                <Button
                    onClick={leaveRoom}
                    className="bg-red-600 hover:bg-red-700 rounded-full px-8 h-12 font-medium transition-all hover:scale-105"
                >
                    <PhoneOff className="mr-2 h-5 w-5" /> Rời phòng
                </Button>
            </div>
        </div>
    );
}

const VideoCard = ({ peer, userName }: { peer: Instance, userName: string }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        peer.on("stream", (stream) => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }
        });
    }, [peer]);

    return (
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video border border-gray-700 shadow-lg">
            <video
                ref={ref}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm">
                <User size={14} className="text-blue-400" /> {userName}
            </div>
        </div>
    );
};