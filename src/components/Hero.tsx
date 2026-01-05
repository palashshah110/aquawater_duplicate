import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const MockSlidesData = [
  {
    id: 1,
    title: "Smart Water Tank Monitoring",
    subtitle: "Never Worry About Water Overflow",
    description: "IoT-enabled automatic overflow protection with real-time alerts",
    buttonText: "Shop Now",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&h=800&fit=crop"
  },
  {
    id: 2,
    title: "Advanced Water Level Sensors",
    subtitle: "Precision Water Management",
    description: "99.9% accurate monitoring with instant notifications",
    buttonText: "Explore Products",
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop"
  },
  {
    id: 3,
    title: "Complete Tank Protection",
    subtitle: "Save Water, Save Money",
    description: "Automatic cut-off system with 2-year warranty",
    buttonText: "View Details",
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1627595226481-fddd0668f936?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const SLIDE_INTERVAL = 2500;

const Hero = () => {
  const [slides, setSlides] = useState(MockSlidesData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${API_URL}/banners`);
      const data = await response.json();
      setSlides(data.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetTimer();
  };

  return (
    <section id="home" className="relative h-[600px] md:h-[700px] overflow-hidden mt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: slides[currentSlide]?.image
                ? `url(${slides[currentSlide].image})`
                : "none",
            }}
                    >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl space-y-6"
            >
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold"
              >
                {slides[currentSlide]?.badge || ''}
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground"
              >
                {slides[currentSlide]?.title || ''}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-2xl md:text-3xl font-semibold text-primary"
              >
                {slides[currentSlide]?.subtitle || ''}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground"
              >
                {slides[currentSlide]?.description || ''}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link to="/products">
                  <Button size="lg" className="h-12 px-8 group">
                    {slides[currentSlide]?.buttonText || ''}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all flex items-center justify-center group z-10 hidden md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-primary transition-colors" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all flex items-center justify-center group z-10 hidden md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index
                ? "w-8 bg-primary"
                : "w-2 bg-background/60 hover:bg-background/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
