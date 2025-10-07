'use client';

import { motion } from 'framer-motion';

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circle 1 - Top Left */}
      <motion.div
        className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        style={{ top: '10%', left: '10%' }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Circle 2 - Top Right */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        style={{ top: '5%', right: '5%' }}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Circle 3 - Bottom Left */}
      <motion.div
        className="absolute w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
        style={{ bottom: '10%', left: '5%' }}
        animate={{
          y: [0, -40, 0],
          x: [0, 25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Circle 4 - Bottom Right */}
      <motion.div
        className="absolute w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
        style={{ bottom: '5%', right: '10%' }}
        animate={{
          y: [0, 35, 0],
          x: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Small floating elements */}
      <motion.div
        className="absolute w-20 h-20 bg-yellow-500/20 rounded-2xl"
        style={{ top: '30%', left: '30%' }}
        animate={{
          rotate: [0, 180, 360],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute w-16 h-16 bg-pink-500/20 rounded-full"
        style={{ top: '60%', right: '25%' }}
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-24 h-24 bg-indigo-500/20 rounded-3xl"
        style={{ bottom: '40%', left: '20%' }}
        animate={{
          rotate: [0, -180, -360],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
