import React from "react";

interface ModernBackgroundProps {
  variant?: "hero" | "auth" | "header";
  children?: React.ReactNode;
  className?: string;
}

const ModernBackground: React.FC<ModernBackgroundProps> = ({
  variant = "hero",
  children,
  className = "",
}) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case "hero":
        return {
          background: `
            linear-gradient(135deg, 
              rgba(99, 102, 241, 0.1) 0%, 
              rgba(168, 85, 247, 0.08) 25%, 
              rgba(236, 72, 153, 0.06) 50%, 
              rgba(251, 146, 60, 0.08) 75%, 
              rgba(34, 197, 94, 0.1) 100%
            ),
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
          `,
        };
      case "auth":
        return {
          background: `
            linear-gradient(135deg, 
              rgba(147, 197, 253, 0.1) 0%, 
              rgba(196, 181, 253, 0.08) 25%, 
              rgba(252, 165, 165, 0.06) 50%, 
              rgba(253, 186, 116, 0.08) 75%, 
              rgba(167, 243, 208, 0.1) 100%
            ),
            radial-gradient(circle at 30% 40%, rgba(147, 197, 253, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(196, 181, 253, 0.1) 0%, transparent 60%)
          `,
        };
      case "header":
        return {
          background: `
            linear-gradient(90deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(248, 250, 252, 0.98) 50%, 
              rgba(255, 255, 255, 0.95) 100%
            )
          `,
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={getBackgroundStyle()}
    >
      {/* Animated floating elements */}
      {variant === "hero" && (
        <>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-lg animate-bounce"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-lg animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "2s" }}
          />
        </>
      )}

      {variant === "auth" && (
        <>
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-300/15 to-purple-300/15 rounded-full blur-2xl animate-pulse" />
          <div
            className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-300/15 to-orange-300/15 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </>
      )}

      {children}
    </div>
  );
};

export default ModernBackground;
