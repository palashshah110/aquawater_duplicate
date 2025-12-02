import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Truck, 
  Copy, 
  Download,
  Share2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderState {
  paymentId: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    category: {
      _id: string;
      name: string;
    };
    images: {
      url: string;
      publicId: string;
      _id: string;
    }[];
    description: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  shipping: {
    rate: number;
    estimated_days: string;
    courier_name: string;
    courier_company_id: number;
  };
  totalAmount: number;
}

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as OrderState | null;

  // Redirect if no order data
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { paymentId, product, customer, shipping, totalAmount } = state;

  const copyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    toast.success("Payment ID copied to clipboard!");
  };

  const getOrderDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstimatedDelivery = () => {
    const days = parseInt(shipping.estimated_days) || 5;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Animation Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            {/* Success Icon with Pulse */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative w-28 h-28 mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                <CheckCircle className="w-14 h-14 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-3"
            >
              Order Placed Successfully! 🎉
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground"
            >
              Thank you for your purchase, <span className="text-foreground font-medium">{customer.name}</span>
            </motion.p>
          </motion.div>

          {/* Order Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Payment Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Payment Details
                </h3>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                  Paid
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Payment ID</p>
                    <p className="font-mono text-sm font-medium">{paymentId}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={copyPaymentId}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-medium">{getOrderDate()}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-semibold">Total Paid</span>
                  <span className="text-2xl font-bold text-gradient">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Delivery Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                Delivery Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Clock className="w-10 h-10 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold text-lg">{getEstimatedDelivery()}</p>
                    <p className="text-xs text-muted-foreground">{shipping.estimated_days} via {shipping.courier_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.address}, {customer.city}, {customer.state} - {customer.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-6 md:p-8 border border-border mb-8"
          >
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Details
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="w-full md:w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden shrink-0">
                {product.images[0]?.url ? (
                  <img 
                    src={product.images[0].url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">💧</span>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-2">
                    {product.category.name}
                  </span>
                  <h4 className="text-xl font-bold">{product.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>
                
                {/* Price Breakdown */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product Price</span>
                    <span>₹{(product.discountPrice || product.price).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping ({shipping.courier_name})</span>
                    <span>₹{shipping.rate}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-dashed border-border">
                    <span>Total Amount</span>
                    <span className="text-gradient text-lg">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-muted/30 rounded-2xl p-6 mb-8"
          >
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 {customer.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What's Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl p-6 md:p-8 border border-border mb-8"
          >
            <h3 className="font-semibold text-lg mb-6">What Happens Next?</h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[18px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
              
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Order Confirmation",
                    desc: "You'll receive an order confirmation email at " + customer.email,
                    icon: "📧",
                    done: true
                  },
                  {
                    step: 2,
                    title: "Processing",
                    desc: "Our team will process and pack your order within 24 hours",
                    icon: "📦"
                  },
                  {
                    step: 3,
                    title: "Shipped",
                    desc: `Your order will be shipped via ${shipping.courier_name}`,
                    icon: "🚚"
                  },
                  {
                    step: 4,
                    title: "Delivered",
                    desc: `Expected delivery by ${getEstimatedDelivery()}`,
                    icon: "🎉"
                  }
                ].map((item, index) => (
                  <div key={item.step} className="flex items-start gap-4 relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      item.done 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted border-2 border-border"
                    }`}>
                      {item.done ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm">{item.icon}</span>}
                    </div>
                    <div className={index === 0 ? "" : "pt-1"}>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 p-6 bg-muted/30 rounded-2xl"
          >
            <p className="text-muted-foreground mb-2">
              Need help with your order?
            </p>
            <p>
              Contact us at{" "}
              <a href="mailto:support@shreeflow.com" className="text-primary hover:underline font-medium">
                support@shreeflow.com
              </a>
              {" "}or call{" "}
              <a href="tel:+919876543210" className="text-primary hover:underline font-medium">
                +91 98765 43210
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
