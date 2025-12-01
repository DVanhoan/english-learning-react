import { useState, useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Loader2, Bot, User, Volume2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AIApi } from "@/api/ai.api";

interface ChatMessage {
    id: number;
    role: "user" | "ai";
    text: string;
}

export default function AITutor() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleStopRecording = (blobUrl: string, blob: Blob) => {
        console.log("Recording stopped. Sending audio...");

        fetch(blobUrl)
            .then((res) => res.blob())
            .then((audioData) => {
                chatMutation.mutate(audioData);
            });
    };

    const { status, startRecording, stopRecording } = useReactMediaRecorder({
        audio: true,
        blobPropertyBag: { type: "audio/wav" },
        onStop: handleStopRecording,
    });

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, status]);

    const chatMutation = useMutation({
        mutationFn: (audioBlob: Blob) => AIApi.sendAudioToAI(audioBlob),

        onSuccess: (data) => {
            const aiResponseText = data.aiText;
            console.log("AI Response:", data);

            setMessages(prev => [
                ...prev,
                { id: Date.now(), role: "user", text: data.userText || "Audio message" },
                { id: Date.now() + 1, role: "ai", text: aiResponseText }
            ]);

            speak(aiResponseText);
        },

        onError: (error: any) => {
            const msg = error.response?.data?.message || "Có lỗi khi kết nối với AI";
            toast.error(msg);
        }
    });


    return (
        <div className="h-[calc(100vh-80px)] bg-gray-50 flex flex-col">
            <div className="main-layout w-full max-w-3xl mx-auto flex-1 flex flex-col py-4 md:py-8 px-4">

                <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-primary-color shrink-0">
                    Luyện nói cùng Google Gemini
                </h1>

                <Card className="flex-1 overflow-hidden flex flex-col bg-white shadow-sm border border-gray-200 rounded-xl">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                                <div className="p-4 bg-gray-100 rounded-full">
                                    <Bot className="w-12 h-12 md:w-16 md:h-16 opacity-50" />
                                </div>
                                <p className="text-sm md:text-base font-medium">Nhấn Micro và nói "Hello" để bắt đầu!</p>
                            </div>
                        )}

                        {messages.map(msg => (
                            <div key={msg.id} className={`flex gap-2 md:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "ai" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                    }`}>
                                    {msg.role === "ai" ? <Bot size={18} className="md:w-5 md:h-5" /> : <User size={18} className="md:w-5 md:h-5" />}
                                </div>

                                <div className={`p-3 md:p-4 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm md:text-base shadow-sm whitespace-pre-wrap ${msg.role === "ai"
                                    ? "bg-gray-100 text-gray-800 rounded-tl-none"
                                    : "bg-blue-600 text-white rounded-tr-none"
                                    }`}>
                                    <p>{msg.text}</p>

                                    {msg.role === "ai" && (
                                        <Button variant="ghost" size="sm" onClick={() => speak(msg.text)} className="mt-2 h-6 px-2 -ml-2 hover:bg-gray-200 text-gray-500 hover:text-gray-900">
                                            <Volume2 size={14} className="mr-1" /> <span className="text-xs">Nghe lại</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {chatMutation.isPending && (
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Bot size={18} className="text-green-600" />
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm p-3 bg-gray-50 rounded-2xl rounded-tl-none">
                                    <Loader2 className="animate-spin w-3 h-3 md:w-4 md:h-4" />
                                    <span>Gemini đang suy nghĩ...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </Card>

                <div className="shrink-0 mt-4 md:mt-6 flex flex-col items-center gap-3">
                    <div className="relative group">
                        {status === "recording" && (
                            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                        )}

                        {status === "recording" ? (
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={stopRecording}
                                className="rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg transition-transform hover:scale-105 relative z-10"
                            >
                                <Square className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                            </Button>
                        ) : (
                            <Button
                                size="icon"
                                className="rounded-full w-14 h-14 md:w-16 md:h-16 shadow-lg bg-primary-color hover:bg-hover-primary-color transition-transform hover:scale-105 relative z-10"
                                onClick={startRecording}
                                disabled={chatMutation.isPending}
                            >
                                <Mic className="w-6 h-6 md:w-8 md:h-8" />
                            </Button>
                        )}
                    </div>

                    <p className={`text-sm font-medium transition-colors ${status === "recording" ? "text-red-500 animate-pulse" : "text-gray-500"
                        }`}>
                        {status === "recording" ? "Đang ghi âm... (Nhấn để gửi)" : "Nhấn micro để nói"}
                    </p>
                </div>
            </div>
        </div>
    );
}