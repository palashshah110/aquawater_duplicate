import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import productsData from "@/data/products.json";

const Products = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

  return (
    <section id="products" ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          style={{ opacity }}
          className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          style={{ opacity, scale }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Our Products
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Smart Water Tank <span className="text-gradient">Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology to protect your water tanks and save resources
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
          {productsData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* More Products Button */}
        <div className="flex justify-center mt-12">
          <Button size="lg" className="px-8">
            More Products
          </Button>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, index }: { product: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group bg-card rounded-lg md:rounded-2xl overflow-hidden card-shadow border border-border/50 hover:border-primary/50 transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl md:text-6xl">💧</div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-1 left-1 md:top-4 md:left-4">
          <span className="px-1.5 py-0.5 md:px-3 md:py-1 bg-primary text-primary-foreground rounded-full text-[8px] md:text-xs font-semibold">
            {product.category}
          </span>
        </div>

        {/* Hover Overlay - Hidden on mobile */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center pb-6">
          <Button className="bg-background text-foreground hover:bg-background/90">
            Quick View
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 md:p-6 space-y-1 md:space-y-4">
        <div>
          <h3 className="text-[10px] md:text-xl font-bold mb-0.5 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="hidden md:block text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating - Simplified on mobile */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex items-center gap-0.5 md:gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2 h-2 md:w-4 md:h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="hidden md:inline text-sm text-muted-foreground">
            ({product.reviews} reviews)
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-1 md:pt-4 border-t border-border gap-1 md:gap-0">
          <div>
            <div className="text-xs md:text-2xl font-bold text-gradient">
              ₹{product.price.toLocaleString()}
            </div>
            <div className="hidden md:block text-xs text-muted-foreground">Inclusive of all taxes</div>
          </div>
          <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-full w-6 h-6 md:w-12 md:h-12">
            <ShoppingCart className="w-3 h-3 md:w-5 md:h-5" />
          </Button>
        </div>

        {/* Features List - Hidden on mobile */}
        <div className="hidden md:block pt-4 space-y-2">
          {product.features.slice(0, 3).map((feature: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Products;
