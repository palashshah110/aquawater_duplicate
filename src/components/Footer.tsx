import { motion } from "framer-motion";
import { Droplets, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import logo from '../assets/logo.png';
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Category, Product, productsApi } from "@/admin/services/api";
const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
    const fetchProducts = async () => {
    try {
      setLoading(true);
      const response:any = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(products.map((p: Product) => p.category as Category))];
    return cats as Category[];
  }, [products]);
  return (
    <footer className="relative bg-card border-t border-border">
      {/* Wave Top */}
      <svg
        className="absolute top-0 left-0 w-full h-auto -translate-y-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="hsl(var(--card))"
          d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
        />
      </svg>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              {/* <Droplets className="w-8 h-8 text-primary" /> */}
              {/* <span className="text-2xl font-bold text-gradient">shreeflow</span> */}
              <img src={logo} alt="shreeflow" className="w-30 h-24" />
            </div>
            <p className="text-muted-foreground mb-6">
              Leading provider of smart water tank management solutions. Protecting homes and businesses since 2018.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:block"
          >
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Products", "Features", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`${link.toLowerCase().replace(" ", "-")}`}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-3">
              {uniqueCategories.slice(0, 5).map((category) => (
                <li key={category._id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  28, Vijay Nagar,
                  <br />
                  Indore, Madhya Pradesh 452010
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+918168304716" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 8168304716
                </a>
                <a href="tel:+919599268300" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 9599268300
                </a>

              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:support@shreeflow.com" className="text-muted-foreground hover:text-primary transition-colors">
                  support@shreeflow.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 Shreeflow. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
