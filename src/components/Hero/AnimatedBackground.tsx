import { useEffect, useRef, useState } from "react";
import {
  BookOpenCheck,
  Globe,
  Sparkles,
  Trophy,
  Star,
  GraduationCap,
  Languages,
  Target,
} from "lucide-react";

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        animationFrameRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const floatingElements = [
    { icon: BookOpenCheck, delay: 0, duration: 6, x: "10%", y: "20%" },
    { icon: Globe, delay: 1, duration: 8, x: "80%", y: "15%" },
    { icon: Sparkles, delay: 2, duration: 7, x: "15%", y: "70%" },
    { icon: Trophy, delay: 0.5, duration: 9, x: "85%", y: "60%" },
    { icon: Star, delay: 1.5, duration: 5, x: "25%", y: "40%" },
    { icon: GraduationCap, delay: 3, duration: 6, x: "75%", y: "35%" },
    { icon: Languages, delay: 2.5, duration: 7, x: "5%", y: "50%" },
    { icon: Target, delay: 1, duration: 8, x: "90%", y: "80%" },
  ];

  // Re-enable a few moving texts for liveliness
  const movingTexts = [
    { text: "ENGLISH", x: "6%", y: "26%", delay: 0.4, speed: 18 },
    { text: "VOCAB", x: "72%", y: "12%", delay: 1.2, speed: 20 },
    { text: "GRAMMAR", x: "12%", y: "62%", delay: 0.8, speed: 22 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs with Mouse Interaction - Sky Blue Focused */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-sky-400/25 to-blue-500/20 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03
            }px)`,
          left: "10%",
          top: "10%",
          willChange: "transform",
          transformOrigin: "center",
        }}
      />
      <div
        className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/18 to-sky-300/15 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02
            }px)`,
          right: "10%",
          bottom: "20%",
          willChange: "transform",
          transformOrigin: "center",
        }}
      />
      <div
        className="absolute w-64 h-64 bg-gradient-to-r from-blue-300/12 to-indigo-400/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015
            }px)`,
          left: "50%",
          top: "50%",
          willChange: "transform",
          transformOrigin: "center",
        }}
      />

      {/* Floating Icons - Sky Blue Focused */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.icon;
        const colors = [
          "text-sky-500",
          "text-blue-500",
          "text-cyan-500",
          "text-indigo-500",
        ];
        const colorClass = colors[index % colors.length];
        return (
          <div
            key={index}
            className={`absolute opacity-25 ${colorClass}`}
            style={{
              left: element.x,
              top: element.y,
              animation: `floatUpDown ${6 + index % 4}s ease-in-out ${element.delay
                }s infinite alternate`,
            }}
          >
            <IconComponent size={24} />
          </div>
        );
      })}

      {/* Moving Text Elements - Sky Blue Focused */}
      {movingTexts.map((textElement, index) => {
        const colors = [
          "text-sky-400/35",
          "text-blue-400/30",
          "text-cyan-400/25",
          "text-indigo-400/30",
        ];
        const colorClass = colors[index % colors.length];
        return (
          <div
            key={index}
            className={`absolute text-xs font-bold ${colorClass} select-none`}
            style={{
              left: textElement.x,
              top: textElement.y,
              animation: `moveHorizontal ${textElement.speed}s ease-in-out infinite`,
              animationDelay: `${textElement.delay}s`,
              willChange: "transform",
            }}
          >
            {textElement.text}
          </div>
        );
      })}

      {/* Animated Geometric Shapes - Sky Blue Focused */}
      <div
        className="absolute top-20 left-20 w-4 h-4 bg-sky-400/35 rotate-45 animate-spin"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute top-40 right-32 w-6 h-6 border-2 border-blue-400/35 rounded-full animate-pulse" />
      <div
        className="absolute bottom-32 left-40 w-3 h-8 bg-cyan-400/30 animate-bounce"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 right-20 w-5 h-5 bg-indigo-400/25 rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating Particles - Sky Blue Focused */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => {
          const colors = [
            "bg-sky-400/40",
            "bg-blue-400/35",
            "bg-cyan-400/30",
            "bg-indigo-400/25",
          ];
          const colorClass = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`absolute w-1 h-1 ${colorClass} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.4,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedBackground;
