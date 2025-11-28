import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Smartphone, Zap, Shield, Cloud, Battery, Bell } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const features = [
  {
    icon: Smartphone,
    title: "Mobile App Control",
    description: "Monitor and control your water tank from anywhere using our intuitive mobile app",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Auto Cut-Off",
    description: "Intelligent automatic pump control prevents overflow and saves electricity",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Dry Run Protection",
    description: "Advanced sensors protect your motor from running dry and extend its lifespan",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Cloud,
    title: "Cloud Monitoring",
    description: "Real-time data sync and historical analytics accessible from any device",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Battery,
    title: "Power Backup",
    description: "Built-in battery ensures continuous operation even during power cuts",
    color: "from-red-500 to-rose-500"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Instant notifications via SMS, email, and push notifications for critical events",
    color: "from-indigo-500 to-blue-500"
  }
];

const Features = ({ showHeader = false }: { showHeader?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <>
        {showHeader && <Navbar />}

    <section id="features" ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Curved Background Element */}
      <svg
        className="absolute top-0 left-0 w-full h-auto -z-10 opacity-10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          className="text-primary"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced technology meets simplicity for the ultimate water management experience
          </p>
        </motion.div>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>    
    {showHeader && <Footer />}
</>
  );
};

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-card rounded-2xl p-8 card-shadow border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="relative inline-block mb-6"
      >
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5`}>
          <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
      </motion.div>

      {/* Content */}
      <h3 className="text-sm md:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="hidden md:block text-xs md:text-base text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Animated Line */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
      />
    </motion.div>
  );
};

export default Features;
