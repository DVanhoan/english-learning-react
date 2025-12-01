import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import SimplePeer, { type Instance } from "simple-peer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import useAuth from "@/context/AuthContext";
import { toast } from "react-toastify";

const iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
    ],
};


export default function SpeakingRoom() {
    const { roomId } = useParams<{ roomId: string }>();
    const { state: { user } } = useAuth();
    const navigate = useNavigate();

    const [peers, setPeers] = useState<Array<{ peerId: string; peer: Instance }>>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<Array<{ peerId: string; peer: Instance }>>([]);
    const stompClient = useRef<any>(null);
    const socket = useRef<any>(null);

    useEffect(() => {
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
                console.error("Error accessing media devices.", err);
                toast.error("Bạn cần cấp quyền Camera/Mic để tham gia.");
            });

        return () => {
            if (stream) stream.getTracks().forEach((track) => track.stop());
            if (stompClient.current) stompClient.current.disconnect();
            peersRef.current.forEach((p) => p.peer.destroy());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    const connectToSocket = (currentStream: MediaStream) => {
        const socketUrl = import.meta.env.SOCKET_URL || "http://localhost:8080/e-learning/ws";
        socket.current = new SockJS(socketUrl);
        stompClient.current = Stomp.over(socket.current);

        stompClient.current.connect({}, () => {
            console.log("Connected to WebSocket");

            stompClient.current.subscribe(`/topic/room/${roomId}`, (message: any) => {
                const payload = JSON.parse(message.body);

                if (payload.senderId === String(user?.id)) return;

                handleSignalMessage(payload, currentStream);
            });

            stompClient.current.send(
                `/app/join/${roomId}`,
                {},
                JSON.stringify({ userId: user?.id, type: "JOIN" })
            );
        });
    };

    const handleSignalMessage = (payload: any, currentStream: MediaStream) => {
        const senderId = String(payload.senderId || payload.userId);

        switch (payload.type) {
            case "JOIN":
                if (!peersRef.current.find((p) => p.peerId === senderId)) {
                    const peer = createPeer(senderId, user?.id, currentStream);
                    peersRef.current.push({ peerId: senderId, peer });
                    setPeers((prev) => [...prev, { peerId: senderId, peer }]);
                }
                break;

            case "OFFER":
                if (String(payload.receiverId) === String(user?.id)) {
                    const peer = addPeer(payload.sdp, senderId, user?.id, currentStream);
                    peersRef.current.push({ peerId: senderId, peer });
                    setPeers((prev) => [...prev, { peerId: senderId, peer }]);
                }
                break;

            case "ANSWER":
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
                {
                    const newPeers = peersRef.current.filter(p => p.peerId !== senderId);
                    peersRef.current.find(p => p.peerId === senderId)?.peer.destroy();
                    peersRef.current = newPeers;
                    setPeers(newPeers);
                    break;
                }
        }
    };

    const createPeer = (userToSignal: string, callerId: any, stream: MediaStream) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            config: iceServers,
            stream: stream,
        });

        peer.on("signal", (signal) => {
            stompClient.current.send(`/app/offer/${roomId}`, {}, JSON.stringify({
                type: "OFFER",
                sdp: signal,
                senderId: callerId,
                receiverId: userToSignal
            }));
        });

        return peer;
    };

    const addPeer = (incomingSignal: any, callerId: string, receiverId: any, stream: MediaStream) => {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            config: iceServers,
            stream: stream,
        });

        peer.on("signal", (signal) => {
            stompClient.current.send(`/app/answer/${roomId}`, {}, JSON.stringify({
                type: "ANSWER",
                sdp: signal,
                senderId: receiverId,
                receiverId: callerId
            }));
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
        stompClient.current.send(`/app/leave/${roomId}`, {}, JSON.stringify({
            userId: user?.id, type: "LEAVE"
        }));

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        peersRef.current.forEach(p => p.peer.destroy());

        if (stompClient.current) stompClient.current.disconnect();

        navigate("/speaking");
    };

    return (
        <div className="h-screen bg-gray-900 text-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Phòng: {roomId}</h2>
                <Badge variant="outline" className="text-green-400 border-green-400">
                    {peers.length + 1} người tham gia
                </Badge>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video border-2 border-blue-500">
                    <video ref={userVideo} muted autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">Bạn</div>
                </div>

                {peers.map((p) => (
                    <VideoCard key={p.peerId} peer={p.peer} />
                ))}
            </div>

            <div className="h-20 flex items-center justify-center gap-4 mt-4 bg-gray-800 rounded-xl">
                <Button
                    onClick={toggleMute}
                    variant={isMuted ? "destructive" : "secondary"}
                    className="rounded-full h-12 w-12 p-0"
                >
                    {isMuted ? <MicOff /> : <Mic />}
                </Button>

                <Button
                    onClick={toggleVideo}
                    variant={isVideoOff ? "destructive" : "secondary"}
                    className="rounded-full h-12 w-12 p-0"
                >
                    {isVideoOff ? <VideoOff /> : <Video />}
                </Button>

                <Button
                    onClick={leaveRoom}
                    className="bg-red-600 hover:bg-red-700 rounded-full px-6"
                >
                    <PhoneOff className="mr-2 h-5 w-5" /> Rời phòng
                </Button>
            </div>
        </div>
    );
}

const VideoCard = ({ peer }: { peer: Instance }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        peer.on("stream", (stream) => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }
        });
    }, [peer]);

    return (
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
            <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">Người dùng</div>
        </div>
    );
};