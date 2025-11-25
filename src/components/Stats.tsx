import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Package, Award, TrendingUp } from "lucide-react";

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Happy Customers", color: "text-blue-500" },
  { icon: Package, value: 100000, suffix: "+", label: "Products Sold", color: "text-green-500" },
  { icon: Award, value: 15, suffix: "+", label: "Industry Awards", color: "text-yellow-500" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Customer Satisfaction", color: "text-purple-500" },
];

const Stats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Curved Top */}
        <svg
          className="absolute top-0 left-0 w-full h-auto"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--primary) / 0.1)"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>

        {/* Curved Bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--accent) / 0.1)"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>

      <motion.div
        style={{ scale, opacity }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const StatCard = ({ stat, index }: { stat: any; index: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const Icon = stat.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const duration = 2000;
          const steps = 60;
          const increment = stat.value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
              setCount(stat.value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [stat.value, hasAnimated]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative bg-card rounded-2xl p-8 card-shadow border border-border/50 hover:border-primary/50 transition-all duration-300 text-center"
    >
      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center justify-center mb-4"
      >
        <div className="relative">
          <Icon className={`w-12 h-12 ${stat.color}`} />
          <div className="absolute inset-0 blur-xl bg-current opacity-30 group-hover:opacity-50 transition-opacity" />
        </div>
      </motion.div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>

      {/* Label */}
      <div className="text-muted-foreground font-medium">
        {stat.label}
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-300 rounded-full" />
    </motion.div>
  );
};

export default Stats;
