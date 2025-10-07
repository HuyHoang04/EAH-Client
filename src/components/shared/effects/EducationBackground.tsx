"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EducationBackground() {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Array<{
    id: number;
    left: number;
    top: number;
    opacity: number;
    duration: number;
    delay: number;
  }>>([]);
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Generate random positions only on client side to prevent hydration mismatch
    setStars(
      [...Array(50)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
    );
    
    setParticles(
      [...Array(30)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100 + 20,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
      }))
    );
    
    setMounted(true);
  }, []);

  // Render static background during SSR and before hydration
  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Stars/particles */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 3D Floating Books */}
      <motion.div
        layoutId="floating-book"
        className="absolute w-32 h-40 left-[10%] top-[20%] pointer-events-none"
        animate={{
          y: [0, -30, 0],
          rotateY: [0, 15, 0],
          rotateX: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative w-full h-full">
          {/* Book cover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-2xl border-2 border-blue-400/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
            <div className="absolute top-4 left-4 right-4">
              <div className="h-2 bg-white/30 rounded mb-2"></div>
              <div className="h-2 bg-white/30 rounded w-3/4"></div>
            </div>
          </div>
          {/* Book spine */}
          <div className="absolute -right-2 top-0 bottom-0 w-4 bg-gradient-to-r from-blue-700 to-blue-900 rounded-r-lg"></div>
        </div>
      </motion.div>

      {/* 3D Floating Notebook */}
      <motion.div
        layoutId="floating-notebook"
        className="absolute w-28 h-36 right-[15%] top-[30%] pointer-events-none"
        animate={{
          y: [0, 25, 0],
          rotateY: [0, -20, 0],
          rotateZ: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{ 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-2xl border-2 border-orange-300/30">
          <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
          {/* Spiral binding */}
          <div className="absolute -left-2 top-4 bottom-4 flex flex-col gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-800 rounded-full border border-gray-600"></div>
            ))}
          </div>
          {/* Lines */}
          <div className="absolute top-8 left-6 right-4 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-0.5 bg-white/40 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3D Floating Pen */}
      <motion.div
        layoutId="floating-pen"
        className="absolute w-4 h-32 left-[25%] bottom-[25%] pointer-events-none"
        animate={{
          y: [0, -20, 0],
          rotateZ: [45, 55, 45],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ willChange: "transform" }}
      >
        <div className="relative w-full h-full bg-gradient-to-b from-purple-500 to-purple-700 rounded-full shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full"></div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-800 to-gray-950 rounded-b-full"></div>
        </div>
      </motion.div>

      {/* 3D Calculator */}
      <motion.div
        layoutId="floating-calculator"
        className="absolute w-24 h-32 right-[25%] bottom-[20%] pointer-events-none"
        animate={{
          y: [0, 30, 0],
          rotateY: [0, 20, 0],
          rotateX: [0, -15, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        style={{ 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 rounded-xl shadow-2xl border-2 border-gray-700/30 p-2">
          {/* Display screen */}
          <div className="w-full h-8 bg-green-900 rounded mb-2 flex items-center justify-end px-2">
            <span className="text-green-400 text-xs font-mono">0</span>
          </div>
          {/* Buttons grid */}
          <div className="grid grid-cols-4 gap-1">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-700 rounded hover:bg-gray-600 transition-colors"></div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3D Laptop/Tablet */}
      <motion.div
        layoutId="floating-laptop"
        className="absolute w-36 h-28 left-[70%] top-[15%] pointer-events-none"
        animate={{
          y: [0, -25, 0],
          rotateY: [0, -10, 0],
          rotateX: [10, 5, 10],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        style={{ 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative w-full h-full">
          {/* Screen */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-2xl border-4 border-gray-800">
            <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center">
              <div className="space-y-1">
                <div className="h-1.5 w-16 bg-blue-400 rounded"></div>
                <div className="h-1.5 w-12 bg-blue-300 rounded"></div>
                <div className="h-1.5 w-14 bg-blue-400 rounded"></div>
              </div>
            </div>
          </div>
          {/* Keyboard base */}
          <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gray-800 rounded-b-lg"></div>
        </div>
      </motion.div>

      {/* 3D Graduation Cap */}
      <motion.div
        layoutId="floating-grad-cap"
        className="absolute w-24 h-24 left-[15%] bottom-[15%] pointer-events-none"
        animate={{
          y: [0, -35, 0],
          rotateZ: [0, 10, 0],
          rotateY: [0, 360, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative w-full h-full">
          {/* Cap top (square board) */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-700 rotate-45 shadow-2xl border-2 border-yellow-400/50"></div>
          {/* Cap base */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-gray-900 to-black rounded-b-3xl"></div>
          {/* Tassel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-yellow-600"></div>
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
        </div>
      </motion.div>

      {/* 3D Stack of Books */}
      <motion.div
        layoutId="floating-book-stack"
        className="absolute w-32 h-20 right-[8%] bottom-[35%] pointer-events-none"
        animate={{
          y: [0, 20, 0],
          rotateY: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        style={{ 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        {/* Bottom book */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-red-600 to-red-800 rounded shadow-xl border-2 border-red-500/30"></div>
        {/* Middle book */}
        <div className="absolute bottom-5 left-2 right-2 h-6 bg-gradient-to-r from-green-600 to-green-800 rounded shadow-xl border-2 border-green-500/30"></div>
        {/* Top book */}
        <div className="absolute bottom-10 left-4 right-4 h-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded shadow-xl border-2 border-indigo-500/30"></div>
      </motion.div>

      {/* Glowing particles around objects */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute w-2 h-2 bg-cyan-400/60 rounded-full blur-sm"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
    </div>
  );
}
