import { useEffect, useState } from "react";
import {
  BookOpen,
  Globe,
  Sparkles,
  Trophy,
  Star,
  GraduationCap,
  Languages,
  Target,
  PenTool,
  Lightbulb,
} from "lucide-react";

const AnimatedBlogBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements = [
    { icon: BookOpen, delay: 0, duration: 8, x: "8%", y: "15%" },
    { icon: Globe, delay: 1, duration: 10, x: "85%", y: "10%" },
    { icon: Sparkles, delay: 2, duration: 7, x: "12%", y: "75%" },
    { icon: Trophy, delay: 0.5, duration: 9, x: "88%", y: "65%" },
    { icon: Star, delay: 1.5, duration: 6, x: "20%", y: "45%" },
    { icon: GraduationCap, delay: 3, duration: 8, x: "78%", y: "30%" },
    { icon: Languages, delay: 2.5, duration: 9, x: "5%", y: "55%" },
    { icon: Target, delay: 1, duration: 7, x: "92%", y: "85%" },
    { icon: PenTool, delay: 3.5, duration: 8, x: "15%", y: "25%" },
    { icon: Lightbulb, delay: 2, duration: 6, x: "82%", y: "50%" },
  ];

  const movingTexts = [
    { text: "LEARN", x: "3%", y: "20%", delay: 0, speed: 25 },
    { text: "STUDY", x: "75%", y: "8%", delay: 2, speed: 30 },
    { text: "PRACTICE", x: "8%", y: "65%", delay: 1, speed: 22 },
    { text: "IMPROVE", x: "85%", y: "75%", delay: 3, speed: 28 },
    { text: "ACHIEVE", x: "12%", y: "88%", delay: 1.5, speed: 26 },
    { text: "SUCCESS", x: "88%", y: "35%", delay: 2.5, speed: 24 },
    { text: "KNOWLEDGE", x: "25%", y: "12%", delay: 0.5, speed: 27 },
    { text: "GROWTH", x: "65%", y: "90%", delay: 3.5, speed: 29 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced Gradient Orbs with Mouse Interaction */}
      <div
        className="absolute w-[500px] h-[500px] bg-gradient-to-r from-sky-300/20 via-blue-400/15 to-cyan-300/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.03}px, ${
            mousePosition.y * 0.03
          }px)`,
          left: "5%",
          top: "5%",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] bg-gradient-to-r from-indigo-300/18 via-purple-300/12 to-sky-400/15 rounded-full blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -0.02}px, ${
            mousePosition.y * -0.02
          }px)`,
          right: "8%",
          bottom: "15%",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] bg-gradient-to-r from-cyan-300/15 via-teal-300/10 to-blue-300/12 rounded-full blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.015}px, ${
            mousePosition.y * 0.015
          }px)`,
          left: "45%",
          top: "40%",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] bg-gradient-to-r from-emerald-300/12 via-green-300/8 to-sky-300/10 rounded-full blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -0.01}px, ${
            mousePosition.y * 0.02
          }px)`,
          right: "35%",
          top: "20%",
        }}
      />

      {/* Floating Icons */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.icon;
        const colors = [
          "text-sky-400",
          "text-blue-400",
          "text-cyan-400",
          "text-indigo-400",
          "text-purple-400",
        ];
        const colorClass = colors[index % colors.length];
        return (
          <div
            key={index}
            className={`absolute animate-bounce opacity-30 ${colorClass}`}
            style={{
              left: element.x,
              top: element.y,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            <IconComponent size={28} />
          </div>
        );
      })}

      {/* Moving Text Elements */}
      {movingTexts.map((textElement, index) => {
        const colors = [
          "text-sky-300/40",
          "text-blue-300/35",
          "text-cyan-300/30",
          "text-indigo-300/35",
          "text-purple-300/25",
        ];
        const colorClass = colors[index % colors.length];
        return (
          <div
            key={index}
            className={`absolute text-sm font-bold ${colorClass} select-none`}
            style={{
              left: textElement.x,
              top: textElement.y,
              animation: `moveHorizontal ${textElement.speed}s linear infinite`,
              animationDelay: `${textElement.delay}s`,
            }}
          >
            {textElement.text}
          </div>
        );
      })}

      {/* Enhanced Geometric Shapes */}
      <div
        className="absolute top-16 left-16 w-6 h-6 bg-sky-300/40 rotate-45 animate-spin"
        style={{ animationDuration: "12s" }}
      />
      <div className="absolute top-32 right-24 w-8 h-8 border-2 border-blue-300/40 rounded-full animate-pulse" />
      <div
        className="absolute bottom-24 left-32 w-4 h-10 bg-cyan-300/35 animate-bounce"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-16 right-16 w-6 h-6 bg-indigo-300/30 rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-20 w-5 h-5 bg-purple-300/25 rotate-12 animate-pulse"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="absolute top-1/3 right-32 w-7 h-7 border-2 border-sky-300/35 rotate-45 animate-spin"
        style={{ animationDuration: "15s" }}
      />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => {
          const colors = [
            "bg-sky-300/45",
            "bg-blue-300/40",
            "bg-cyan-300/35",
            "bg-indigo-300/30",
            "bg-purple-300/25",
          ];
          const colorClass = colors[i % colors.length];
          const sizes = ["w-1 h-1", "w-1.5 h-1.5", "w-2 h-2"];
          const sizeClass = sizes[i % sizes.length];
          return (
            <div
              key={i}
              className={`absolute ${sizeClass} ${colorClass} rounded-full animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
              }}
            />
          );
        })}
      </div>

      {/* Subtle Wave Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-100/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-100/15 to-transparent" />
      </div>
    </div>
  );
};

export default AnimatedBlogBackground;
