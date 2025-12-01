import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Main floating orbs */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl animate-float" />
            <div className="absolute top-1/3 -right-16 w-96 h-96 bg-blue-200/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-cyan-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

            {/* Additional floating elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />

            {/* Animated gradient mesh */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-emerald-50/10 to-cyan-50/10 animate-pulse" />

            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/40 rounded-full animate-float-up-down" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-emerald-400/40 rounded-full animate-float-up-down" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-cyan-400/40 rounded-full animate-float-up-down" style={{ animationDelay: '2.5s' }} />
            <div className="absolute top-2/3 right-1/5 w-3 h-3 bg-teal-400/40 rounded-full animate-float-up-down" style={{ animationDelay: '3.5s' }} />

            {/* Animated lines */}
            <div className="absolute top-1/4 left-1/2 w-px h-32 bg-gradient-to-b from-transparent via-blue-300/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-emerald-300/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
    );
};

export default AnimatedBackground;
