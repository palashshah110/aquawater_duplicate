import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderState {
  paymentId: string;
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
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
}

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as OrderState | null;

  // Redirect if no order data
  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { paymentId, product, customer } = state;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-14 h-14 text-primary" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-6 md:p-8 border border-border space-y-6"
          >
            {/* Payment ID */}
            <div className="text-center pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
              <p className="font-mono text-lg font-semibold text-primary">
                {paymentId}
              </p>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Details
              </h3>
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-3xl">💧</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-xl font-bold text-gradient mt-2">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Delivery Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm">👤</span>
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">{customer.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {customer.address}, {customer.city}, {customer.state} -{" "}
                      {customer.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <p className="text-muted-foreground">
                    You will receive an order confirmation email shortly
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    Our team will process and ship your order within 24-48 hours
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    Track your shipment via the link sent to your email
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
          >
            <Link to="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 text-sm text-muted-foreground"
          >
            <p>
              Need help? Contact us at{" "}
              <a href="mailto:support@shreeflow.com" className="text-primary hover:underline">
                support@shreeflow.com
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
