import React from 'react';

const AnimatedContactBackground = () => {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Main gradient background - subtle blue tones */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/20" />

            {/* Floating orbs with consistent blue theme - lighter */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-sky-200/15 rounded-full blur-3xl animate-float" />
            <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-200/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-200/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

            {/* Additional floating elements - subtle */}
            <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-2/3 right-1/3 w-32 h-32 bg-sky-100/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
            <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-blue-50/25 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />

            {/* Animated gradient mesh - subtle */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-50/4 via-blue-50/4 to-slate-50/4 animate-pulse" />

            {/* Floating particles - subtle */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/20 rounded-full animate-float-up-down" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-sky-400/20 rounded-full animate-float-up-down" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-blue-300/25 rounded-full animate-float-up-down" style={{ animationDelay: '2.5s' }} />
            <div className="absolute top-3/4 right-1/6 w-3 h-3 bg-sky-300/20 rounded-full animate-float-up-down" style={{ animationDelay: '3.5s' }} />
            <div className="absolute top-1/6 left-1/2 w-2 h-2 bg-blue-200/25 rounded-full animate-float-up-down" style={{ animationDelay: '4.5s' }} />

            {/* Animated lines - subtle */}
            <div className="absolute top-1/4 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-blue-200/15 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-sky-200/15 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-px h-28 bg-gradient-to-b from-transparent via-blue-100/20 to-transparent animate-pulse" style={{ animationDelay: '3s' }} />

            {/* Decorative geometric shapes - subtle */}
            <div className="absolute top-1/6 right-1/3 w-16 h-16 border border-blue-100/15 rotate-45 animate-spin-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border border-sky-100/15 rotate-12 animate-spin-reverse" />
            <div className="absolute top-2/3 right-1/6 w-8 h-8 border border-blue-50/20 rotate-45 animate-spin-slow" />

            {/* Wave-like elements - subtle */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/5 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sky-50/5 to-transparent" />
        </div>
    );
};

export default AnimatedContactBackground;
