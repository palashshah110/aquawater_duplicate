import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Shield, Zap, Check, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specs: {
    warranty: string;
    power: string;
    compatibility: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [product, setProduct] = useState<any | undefined>(undefined);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProductById = async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: any = await response.json() as Promise<Product>;
    setProduct(data.data);
  };
  useEffect(() => {
    fetchProductById(id);
  }, [id]);
  if(loading){
    return (
      <LoadingSpinner />
    )
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBuyNow = () => {
    navigate(`/checkout/${product._id}`);
  };

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category?.name === product.category?.name && p._id !== product._id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </motion.div>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Product Image */}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >

              <Swiper
                navigation={true}
                modules={[Navigation]}
                className="aspect-square rounded-2xl overflow-hidden"
              >
                {product.images.map((img: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <img
                        src={img.url}
                        alt={`${product.name}-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Category Badge */}
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
                {product.category?.name}
              </Badge>
            </motion.div>


            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 4.9)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{product.rating || 4.9}</span>
                <span className="text-muted-foreground">({product.reviews || 199} reviews)</span>
              </div>

              {/* Price */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-baseline gap-2 mb-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-4xl font-bold text-gradient">
                        ₹{product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gradient">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{product.specs.warranty}</p>
                  <p className="text-xs text-muted-foreground">Warranty</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border text-center">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{product.specs.power}</p>
                  <p className="text-xs text-muted-foreground">Power</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border text-center">
                  <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-[10px] md:text-sm">{product.specs.compatibility}</p>
                  <p className="text-xs text-muted-foreground">Compatible</p>
                </div>
              </div>

              {/* Buy Now Button */}
              <Button
                size="lg"
                className="w-full h-14 text-lg font-semibold"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Quality Assured
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4 text-primary" />
                  Fast Delivery
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <div className="text-5xl">💧</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-gradient mt-1">
                          ₹{relatedProduct.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
