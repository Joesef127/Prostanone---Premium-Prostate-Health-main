import React from 'react';
import { motion } from 'framer-motion';

export const ProstateDiagram: React.FC<{ scrollProgress?: number }> = () => {
  return (
    <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
       <svg viewBox="0 0 200 200" className="w-full h-full max-w-md">
         {/* Bladder */}
         <motion.path 
            d="M 60 20 Q 100 -10 140 20 L 130 80 Q 100 90 70 80 Z" 
            fill="#E5E7EB" 
            stroke="#9CA3AF"
            strokeWidth="2"
         />
         
         {/* Urethra */}
         <motion.path 
            d="M 95 80 L 95 180 L 105 180 L 105 80 Z" 
            fill="#FEF3C7" 
         />
         
         {/* Prostate - Left Lobe */}
         <motion.path 
            d="M 95 90 Q 60 90 60 120 Q 60 150 95 150 Z" 
            initial={{ fill: "#FF6B6B", scale: 1.1, x: -5 }}
            whileInView={{ fill: "#FFB3BA", scale: 1, x: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: false, amount: 0.5 }}
         />
         
         {/* Prostate - Right Lobe */}
         <motion.path 
             d="M 105 90 Q 140 90 140 120 Q 140 150 105 150 Z"
             initial={{ fill: "#FF6B6B", scale: 1.1, x: 5 }}
             whileInView={{ fill: "#FFB3BA", scale: 1, x: 0 }}
             transition={{ duration: 2, ease: "easeInOut" }}
             viewport={{ once: false, amount: 0.5 }}
         />

         <text x="100" y="195" textAnchor="middle" fontSize="10" fill="#4B5563">Urethra</text>
         <text x="150" y="120" textAnchor="middle" fontSize="10" fill="#4B5563">Prostate</text>
         <text x="100" y="50" textAnchor="middle" fontSize="10" fill="#4B5563">Bladder</text>
       </svg>
    </div>
  );
};