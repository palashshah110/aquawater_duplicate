import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Eye, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productsData from "@/data/products.json";

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

const AllProducts = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(productsData.map((p) => p.category))];
    return cats;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...productsData] as Product[];

    // Filter by category
    if (selectedCategories.length > 0) {
      products = products.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by price
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        products.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return products;
  }, [selectedCategories, priceRange, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 6000]);
    setSortBy("featured");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label
                htmlFor={category}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={6000}
            min={0}
            step={100}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={clearFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              All Products
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Water Tank <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of water tank monitoring and protection devices
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filter Sidebar - 30% width */}
            <aside className="hidden lg:block w-[30%] shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length} products
                  </span>
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Products Area - 70% width */}
            <div className="flex-1">
              {/* Mobile Filter & Sort Bar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {selectedCategories.length > 0 && (
                        <span className="ml-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          {selectedCategories.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {cat}
                      <button
                        onClick={() => toggleCategory(cat)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find what you're looking for
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg"
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl md:text-6xl">💧</div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4">
            <span className="px-2 py-1 md:px-3 md:py-1 bg-primary text-primary-foreground rounded-full text-[10px] md:text-xs font-semibold">
              {product.category}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <Button className="bg-background text-foreground hover:bg-background/90">
              View Details
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 md:p-5 space-y-2 md:space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="hidden md:block text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 md:w-4 md:h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs md:text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-border">
          <div>
            <div className="text-lg md:text-xl font-bold text-gradient">
              ₹{product.price.toLocaleString()}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Incl. taxes</div>
          </div>
          <Link to={`/product/${product.id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AllProducts;
