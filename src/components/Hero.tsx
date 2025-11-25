import { motion } from "framer-motion";
import { ArrowRight, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Clean Background with subtle gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block px-4 py-1.5 bg-primary/5 text-primary rounded-full text-sm font-medium border border-primary/10"
              >
                Smart Water Management
              </motion.span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Never Worry About{" "}
                <span className="text-gradient">Water Overflow</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                IoT-enabled water tank monitoring with automatic overflow protection and real-time alerts.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="h-12 px-8 group">
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-8 pt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Easy Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Save Water</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Clean Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Product Display */}
              <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 border border-border/50">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    <Droplet className="w-40 h-40 text-primary drop-shadow-2xl" />
                    <div className="absolute inset-0 bg-primary/20 blur-3xl" />
                  </div>
                </motion.div>

                {/* Clean Stats */}
                <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-border/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">99.9%</div>
                    <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">24/7</div>
                    <div className="text-sm text-muted-foreground mt-1">Monitoring</div>
                  </div>
                </div>
              </div>

              {/* Subtle Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl -z-10 opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
