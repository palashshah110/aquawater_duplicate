import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productsData from "@/data/products.json";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const product = productsData.find((p) => p.id === Number(id)) as Product | undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're trying to purchase doesn't exist.
          </p>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof CustomerDetails]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};

    if (!customerDetails.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!customerDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(customerDetails.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!customerDetails.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!customerDetails.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!customerDetails.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!customerDetails.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(customerDetails.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsLoading(false);
        return;
      }

      // In a real application, you would create an order on your backend
      // and get the order_id from Razorpay API
      // For demo purposes, we're using test mode configuration

      const options = {
        key: "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay Key ID
        amount: product.price * 100, // Amount in paise
        currency: "INR",
        name: "ShreeFlow",
        description: product.name,
        image: "/logo.png",
        handler: function (response: any) {
          // Payment successful
          toast.success("Payment Successful!");
          console.log("Payment ID:", response.razorpay_payment_id);

          // Navigate to success page or show confirmation
          navigate("/order-success", {
            state: {
              paymentId: response.razorpay_payment_id,
              product: product,
              customer: customerDetails,
            },
          });
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: {
          address: `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}`,
          product_id: product.id,
          product_name: product.name,
        },
        theme: {
          color: "#0070D0",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.error("Payment failed:", response.error);
        setIsLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
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
              Back to Product
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Customer Details Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>

              <div className="bg-card rounded-xl p-6 border border-border space-y-6">
                <h2 className="text-lg font-semibold">Customer Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your complete address"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-destructive" : ""}
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Enter state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={customerDetails.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Summary</h2>

              <div className="bg-card rounded-xl p-6 border border-border space-y-6 sticky top-24">
                {/* Product Info */}
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-4xl">💧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-lg font-bold text-gradient mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-gradient">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Pay Now Button */}
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{product.price.toLocaleString()}</>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    Secure payment powered by Razorpay
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    100% safe & secure transactions
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">We accept</p>
                  <div className="flex flex-wrap gap-2">
                    {["UPI", "Cards", "Net Banking", "Wallets"].map((method) => (
                      <span
                        key={method}
                        className="px-2 py-1 bg-muted rounded text-xs"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
