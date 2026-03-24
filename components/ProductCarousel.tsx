import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { FadeIn } from "./product-page/shared";

export const ProductCarousel: React.FC<{ images: { src: string; alt: string }[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex(prev => (prev + dir + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [go]);

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <FadeIn className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          src={images[index].src}
          alt={images[index].alt}
          className="absolute inset-0 w-full h-[90%] object-contain p-4"
          draggable={false}
        />
      </AnimatePresence>

      {/* Nav buttons */}
      <button
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-secondary rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-secondary rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white w-4' : 'bg-white/50'}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </FadeIn>
  );
};