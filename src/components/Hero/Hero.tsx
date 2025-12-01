import React from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  Star,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import routes from "@/routes/routes.const";
import AnimatedBackground from "./AnimatedBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50/50">
      {/* --- BACKGROUND LAYERS --- */}

      {/* 1. Animated Particles (Giữ lại cái cũ của bạn vì nó tốt) */}
      <AnimatedBackground />

      {/* 2. Mesh Gradients (Tạo màu nền mềm mại, hiện đại hơn) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-sky-300/20 blur-[120px]" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container relative z-10 px-4 md:px-6 main-layout">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)] py-12 lg:py-0">

          {/* === LEFT COLUMN: TEXT & CTA === */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">

            {/* Badge thông báo nhỏ */}
            <div className="inline-flex items-center justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium shadow-sm hover:bg-blue-100 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Nền tảng học tiếng Anh #1 Việt Nam
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Chinh Phục <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-color via-blue-600 to-sky-500">
                  Tiếng Anh
                </span>{" "}
                Dễ Dàng
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-[600px] mx-auto lg:mx-0 leading-relaxed">
                Lộ trình học cá nhân hóa, công nghệ AI hỗ trợ luyện nói và kho tàng từ vựng phong phú. Giúp bạn tự tin giao tiếp chỉ sau 3 tháng.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-primary-color hover:bg-blue-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all hover:-translate-y-1"
                asChild
              >
                <Link to={routes.COURSES}>
                  Bắt đầu học ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 text-slate-700 hover:border-primary-color hover:text-primary-color hover:bg-blue-50 transition-all"
                asChild
              >
                <Link to={routes.SPEAKING_LOBBY}>
                  <PlayCircle className="ml-2 h-5 w-5 mr-2" />
                  Test trình độ
                </Link>
              </Button>
            </div>

            {/* Social Proof (Bằng chứng xã hội) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar key={i} className="border-2 border-white w-10 h-10">
                    <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-600">
                  +2k
                </div>
              </div>
              <div className="text-sm text-slate-600">
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p><span className="font-bold text-slate-900">4.9/5</span> từ hơn 2,000 học viên</p>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: IMAGE COMPOSITION === */}
          <div className="relative lg:h-full flex items-center justify-center lg:justify-end perspective-1000">
            <div className="relative w-full max-w-[500px] aspect-square md:aspect-[4/3] lg:aspect-square">

              {/* Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-sky-50 rounded-full blur-3xl -z-10 animate-pulse-slow" />

              <img
                src="/images/hero_1.png"
                alt="Vietnamese student learning English - Maccy on Unsplash"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] aspect-[4/5] object-cover object-top  transform transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.02]" //rounded-3xl shadow-2xl
                style={{ backfaceVisibility: "hidden" }}
              />

              {/* Floating Card 1: Vocab */}
              <div className="absolute -left-4 top-10 md:left-[-20px] bg-white/80 backdrop-blur-md border border-white/40 p-3 rounded-2xl shadow-xl z-20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-xl">
                    <BookOpen className="text-orange-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Từ vựng</p>
                    <p className="text-sm font-bold text-slate-800">3000+ Từ mới</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Success */}
              <div className="absolute -right-4 bottom-20 md:right-[-20px] bg-white/80 backdrop-blur-md border border-white/40 p-3 rounded-2xl shadow-xl z-20 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Kết quả</p>
                    <p className="text-sm font-bold text-slate-800">Đạt mục tiêu</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: AI Tech */}
              <div className="absolute left-10 bottom-[-10px] bg-white/90 backdrop-blur-md border border-white/40 py-2 px-4 rounded-full shadow-lg z-30 flex items-center gap-2 animate-bounce-slow">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">AI Speaking Tutor</span>
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;