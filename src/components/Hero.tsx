import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        
        {/* Curved Overlay */}
        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="currentColor"
            className="text-primary"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                Smart Water Management Solutions
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Never Worry About{" "}
                <span className="text-gradient">Water Overflow</span> Again
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Advanced IoT-enabled water tank monitoring systems with automatic
              overflow protection, real-time alerts, and intelligent water
              management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                Explore Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </motion.div>

            {/* Features Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg card-shadow">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg card-shadow">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Easy Installation</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg card-shadow">
                <Droplet className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">Save Water</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Animated Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Main Product Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-card rounded-3xl p-8 card-shadow border border-border/50"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <Droplet className="w-32 h-32 text-primary" />
                </div>
                
                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -left-6 top-1/4 bg-card rounded-2xl p-4 card-shadow"
                >
                  <div className="text-2xl font-bold text-gradient">99.9%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -right-6 bottom-1/4 bg-card rounded-2xl p-4 card-shadow"
                >
                  <div className="text-2xl font-bold text-gradient">24/7</div>
                  <div className="text-xs text-muted-foreground">Monitoring</div>
                </motion.div>
              </motion.div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl -z-10 animate-pulse-glow" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
