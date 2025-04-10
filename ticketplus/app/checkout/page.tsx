"use client";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/header/page";
import { Footer } from "@/components/footer/page";
import useEventStore from "@/store/eventStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { currencyMapping } from "@/utils/currency";
import { toast } from "react-hot-toast";
import axios from "axios";
import { TICKETPLUS_API_URL } from "@/constants";
import Image from "next/image";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";

// Payment Provider Icons
import stripeIcon from "@/public/images/cards.jpg";
import flutterwaveIcon from "@/public/images/rave.jpg";
import momoIcon from "@/public/images/momo.jpg";
import airtelMoneyIcon from "@/public/images/airtel.jpg";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51KDsVdHjllFf5pa1Ir48dU2N3rquvHyMJyL6dT86biDxww7ko7WW9k9FGPHng97PnqSW3PQ83hoIaiisOBIN5ODp001LF3F78E"
);

// Country-specific payment methods
const PAYMENT_METHODS = {
  Nigeria: [{ id: "flutterwave", name: "Flutterwave", icon: flutterwaveIcon }],
  Liberia: [
    { id: "stripe", name: "Credit/Debit Card", icon: stripeIcon },
    { id: "mtn_momo", name: "MTN Mobile Money", icon: momoIcon },
  ],
  Rwanda: [
    { id: "stripe", name: "Credit/Debit Card", icon: stripeIcon },
    { id: "mtn_momo", name: "MTN Mobile Money", icon: momoIcon },
    { id: "airtel_money", name: "Airtel Money", icon: airtelMoneyIcon },
  ],
  Uganda: [
    { id: "stripe", name: "Credit/Debit Card", icon: stripeIcon },
    { id: "mtn_momo", name: "MTN Mobile Money", icon: momoIcon },
    { id: "airtel_money", name: "Airtel Money", icon: airtelMoneyIcon },
  ],
  default: [{ id: "stripe", name: "Credit/Debit Card", icon: stripeIcon }],
};

// Step indicator component
const CheckoutSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { name: "Information", status: currentStep >= 1 ? "complete" : "current" },
    {
      name: "Payment",
      status:
        currentStep >= 2
          ? "complete"
          : currentStep === 1
          ? "current"
          : "upcoming",
    },
    {
      name: "Confirmation",
      status:
        currentStep >= 3
          ? "complete"
          : currentStep === 2
          ? "current"
          : "upcoming",
    },
  ];

  return (
    <nav className="mb-8">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => (
          <li key={step.name} className="relative flex items-center">
            {index > 0 && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-0 h-[2px] w-8 -ml-8 ${
                  step.status === "upcoming" ? "bg-gray-700" : "bg-purple-600"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step.status === "complete"
                    ? "bg-purple-600"
                    : step.status === "current"
                    ? "bg-purple-900 border-2 border-purple-600"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {step.status === "complete" ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      step.status === "current" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  step.status === "upcoming" ? "text-gray-500" : "text-white"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] w-8 ml-0 ${
                  steps[index + 1].status === "upcoming"
                    ? "bg-gray-700"
                    : "bg-purple-600"
                }`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Stripe Payment Form Component
const StripePaymentForm = ({
  total,
  currencySymbol,
  onPaymentSuccess,
}: {
  clientSecret: string;
  total: number;
  currencySymbol: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An unexpected error occurred");
        setProcessing(false);
        return;
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/checkout/success` },
        redirect: "if_required",
      });

      if (paymentError) {
        setError(paymentError.message || "Payment failed");
        toast.error(paymentError.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      setError( "Payment failed");
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement options={{ layout: "tabs" }} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${currencySymbol}${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, getCartTotal, clearCart, coupon } = useEventStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderReference, setOrderReference] = useState("");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [showMobileMoneyInput, setShowMobileMoneyInput] = useState(false);
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  interface FlutterwaveConfig {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: {
      email: string;
      phone_number: string;
      name: string;
    };
    customizations: {
      title: string;
      description: string;
      logo: string;
    };
    callback_url?: string;
  }

  const [flutterwaveConfig, setFlutterwaveConfig] = useState<FlutterwaveConfig | null>(null);

  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Initialize Flutterwave Hook with a default or empty config
  const handleFlutterwave = useFlutterwave(flutterwaveConfig || {
    public_key: "",
    tx_ref: "",
    amount: 0,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "",
      phone_number: "",
      name: "",
    },
    customizations: {
      title: "Ticket+",
      description: "Payment for event tickets",
      logo: "https://ticketplus.app/logo.png",
    },
  });

  const eventCountry = cart.length > 0 ? cart[0].country : "Nigeria";

  const getCurrencyCode = (country: string): string => {
    switch (country) {
      case "Nigeria": return "NGN";
      case "Rwanda": return "RWF";
      case "Uganda": return "UGX";
      case "Liberia": default: return "USD";
    }
  };

  const currencyCode = getCurrencyCode(eventCountry);
  const { subtotal, discount, fees, total } = getCartTotal();
  const currencySymbol = currencyMapping[eventCountry] || "$";
  const availablePaymentMethods =
    PAYMENT_METHODS[eventCountry as keyof typeof PAYMENT_METHODS] || PAYMENT_METHODS.default;

  // Reset processing states when payment method changes
  const handlePaymentMethodChange = (methodId: string) => {
    setPaymentMethod(methodId);
    setIsProcessing(false);
    setIsPaymentProcessing(false);
    setShowMomoModal(false);
    setStripeClientSecret(null);
    setFlutterwaveConfig(null); // Reset Flutterwave config
  };

  useEffect(() => {
    setPaymentMethod("");
    setShowMobileMoneyInput(false);
  }, [eventCountry]);

  useEffect(() => {
    if (["mtn_momo", "orange_money", "airtel_money"].includes(paymentMethod)) {
      setShowMobileMoneyInput(true);
    } else {
      setShowMobileMoneyInput(false);
    }
  }, [paymentMethod]);

  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!contactInfo.firstName.trim()) newErrors.firstName = "First name is required";
    if (!contactInfo.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!contactInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!contactInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(contactInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
      setErrors(newErrors);
      return false;
    }
    if (["mtn_momo", "orange_money", "airtel_money"].includes(paymentMethod)) {
      if (!mobileMoneyNumber.trim()) {
        newErrors.mobileMoneyNumber = "Mobile money number is required";
      } else {
        const digitsOnly = mobileMoneyNumber.replace(/\D/g, "");
        const validPhoneFormat =
          (digitsOnly.startsWith("231") && digitsOnly.length === 12) ||
          (digitsOnly.startsWith("256") && digitsOnly.length === 12) ||
          (digitsOnly.startsWith("250") && digitsOnly.length === 12);
        if (!validPhoneFormat) {
          newErrors.mobileMoneyNumber = "Please enter a valid mobile money number with country code";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBackToCart = () => router.push("/cart");

  const handleContinueToPayment = () => {
    if (validateContactInfo()) setCurrentStep(1);
    else toast.error("Please correct the errors in the form");
  };

  const handleProcessPayment = async () => {
    if (!validatePaymentInfo()) {
      toast.error("Please correct the payment information");
      return;
    }
    setIsProcessing(true);
    try {
      switch (paymentMethod) {
        case "mtn_momo":
        case "orange_money":
        case "airtel_money":
          setShowMomoModal(true);
          break;
        case "flutterwave":
          await handleFlutterwavePayment();
          break;
        case "stripe":
          await handleStripePayment();
          break;
        default:
          throw new Error("Unsupported payment method");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("There was a problem processing your payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleMomoPayment = async (phoneNumber: string) => {
    setIsPaymentProcessing(true);
    try {
      const loadingToast = toast.loading("Sending payment request...");
      const response = await axios.post(
        `${TICKETPLUS_API_URL}/payments/request-to-pay`,
        {
          total: total,
          phone: phoneNumber,
          paymentType: "TICKET_PURCHASE",
          currency: currencyCode,
          metadata: {
            orderDetails: {
              tickets: cart.map((item) => ({
                ticketId: item.ticketId,
                ticketName: item.ticketName,
                ticketPrice: item.salePrice,
                owner: item.event.owner,
                event: item.event._id,
                eventName: item.event.name,
                eventCategory: item.event.category,
                quantity: item.qty,
                totalAmount: item.salePrice * item.qty,
                startingTime: item.event.startingTime,
                endingTime: item.event.endingTime,
                merchandise: item.merchandise,
              })),
              contactInfo: {
                email: contactInfo.email,
                phone: contactInfo.phone,
                name: `${contactInfo.firstName} ${contactInfo.lastName}`,
                country: eventCountry,
              },
              ...(coupon ? { coupon: { code: coupon.code } } : {}),
            },
          },
        }
      );
      toast.dismiss(loadingToast);
      if (response.data.success) {
        toast.success("Payment request sent. Check your mobile money app");
        await pollPaymentStatus(response.data.data.referenceId);
      } else {
        throw new Error(response.data.error || "Payment request failed");
      }
    } catch (error) {
      console.error("Mobile Money payment error:", error);
      toast.error("Mobile Money payment failed. Please try again.");
      setIsPaymentProcessing(false);
      setShowMomoModal(false);
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (referenceId: string) => {
    let attempts = 0;
    const maxAttempts = 20;
    const pollInterval = 6000;
    const MAX_PAYMENT_TIME = 120000;

    const paymentTimeout = setTimeout(() => {
      toast.error("Payment request has expired. Please try again.");
      setIsPaymentProcessing(false);
      setShowMomoModal(false);
      setIsProcessing(false);
    }, MAX_PAYMENT_TIME);

    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        clearTimeout(paymentTimeout);
        toast.error("Payment verification timed out.");
        setIsPaymentProcessing(false);
        setShowMomoModal(false);
        setIsProcessing(false);
        return;
      }
      attempts++;
      try {
        const response = await axios.get(
          `${TICKETPLUS_API_URL}/payments/payment-status/${referenceId}`
        );
        if (response.data.status === "COMPLETED") {
          clearTimeout(paymentTimeout);
          toast.success("Payment successful!");
          setShowMomoModal(false);
          setCurrentStep(2);
          setOrderReference(referenceId);
          setOrderCompleted(true);
          clearCart();
          setIsPaymentProcessing(false);
          setIsProcessing(false);
        } else if (["TIMEOUT", "CANCELED", "FAILED", "EXPIRED"].includes(response.data.status)) {
          clearTimeout(paymentTimeout);
          toast.error(`Payment ${response.data.status.toLowerCase()}.`);
          setIsPaymentProcessing(false);
          setShowMomoModal(false);
          setIsProcessing(false);
        } else {
          setTimeout(checkStatus, pollInterval);
        }
      } catch (error) {
        clearTimeout(paymentTimeout);
        console.error("Error checking payment status:", error);
        toast.error("Error verifying payment status. Please try again.");
        setIsPaymentProcessing(false);
        setShowMomoModal(false);
        setIsProcessing(false);
      }
    };
    await checkStatus();
  };

  const handleFlutterwavePayment = async () => {
    try {
      const response = await axios.post(
        `${TICKETPLUS_API_URL}/payments/flutterwave/initialize`,
        {
          amount: total,
          email: contactInfo.email,
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          phone: contactInfo.phone,
          metadata: {
            country: eventCountry,
            currency: currencyCode,
            orderDetails: {
              tickets: cart.map((item) => ({
                ticketId: item.ticketId,
                ticketName: item.ticketName,
                ticketPrice: item.salePrice,
                owner: item.event.owner,
                event: item.event._id,
                eventName: item.event.name,
                eventCategory: item.event.category,
                quantity: item.qty,
                totalAmount: item.salePrice * item.qty,
                startingTime: item.event.startingTime,
                endingTime: item.event.endingTime,
                merchandise: item.merchandise,
              })),
              contactInfo: {
                email: contactInfo.email,
                phone: contactInfo.phone,
                name: `${contactInfo.firstName} ${contactInfo.lastName}`,
                country: eventCountry,
              },
              ...(coupon ? { coupon: { code: coupon.code } } : {}),
            },
          },
        }
      );
      if (response.data.success) {
        const config = {
          public_key: response.data.data.public_key,
          tx_ref: response.data.data.tx_ref,
          amount: total,
          currency: response.data.data.currency,
          payment_options: response.data.data.payment_options,
          customer: response.data.data.customer,
          customizations: response.data.data.customizations,
          callback_url: window.location.origin + "/checkout/success",
        };
        setFlutterwaveConfig(config); // Update config state

        // Trigger Flutterwave payment
        handleFlutterwave({
          callback: async (response) => {
            if (response.status === "successful" || response.status === "completed") {
              const verifyRes = await axios.post(
                `${TICKETPLUS_API_URL}/payments/flutterwave/verify`,
                { transaction_id: response.transaction_id, tx_ref: response.tx_ref }
              );
              if (verifyRes.data.success) {
                const orderId = verifyRes.data.data?.orderId || response.transaction_id;
                setOrderReference(orderId);
                setCurrentStep(2);
                setOrderCompleted(true);
                clearCart();
              } else {
                toast.error("Payment verification failed.");
              }
            } else {
              toast.error("Payment was not successful.");
            }
            closePaymentModal();
            setIsProcessing(false);
          },
          onClose: () => {
            setIsProcessing(false);
            setFlutterwaveConfig(null); // Reset config after closing
          },
        });
      }
    } catch (error) {
      console.error("[Flutterwave] Error during payment:", error);
      toast.error("Failed to initialize Flutterwave payment");
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      const response = await axios.post(
        `${TICKETPLUS_API_URL}/payments/stripe/intent`,
        {
          amount: total,
          currency: currencyCode.toLowerCase(),
          metadata: {
            email: contactInfo.email,
            name: `${contactInfo.firstName} ${contactInfo.lastName}`,
            phone: contactInfo.phone,
            country: eventCountry,
            orderDetails: {
              tickets: cart.map((item) => ({
                ticketId: item.ticketId,
                ticketName: item.ticketName,
                ticketPrice: item.salePrice,
                owner: item.event.owner,
                event: item.event._id,
                eventName: item.event.name,
                eventCategory: item.event.category,
                quantity: item.qty,
                totalAmount: item.salePrice * item.qty,
                startingTime: item.event.startingTime,
                endingTime: item.event.endingTime,
                merchandise: item.merchandise || [],
              })),
              contactInfo: {
                email: contactInfo.email,
                phone: contactInfo.phone,
                name: `${contactInfo.firstName} ${contactInfo.lastName}`,
                country: eventCountry,
              },
              ...(coupon ? { coupon: { code: coupon.code } } : {}),
            },
          },
        }
      );
      if (response.data.success) {
        setStripeClientSecret(response.data.data.clientSecret);
      } else {
        throw new Error("Failed to create payment intent");
      }
    } catch (error) {
      console.error("Error setting up Stripe payment:", error);
      toast.error("Failed to set up payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const MomoPaymentModal = ({
    isOpen,
    onClose,
    onSubmit,
    isProcessing: momoProcessing,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (phoneNumber: string) => void;
    isProcessing: boolean;
  }) => {
    const [phoneNumber, setPhoneNumber] = useState(mobileMoneyNumber || "");
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
      if (momoProcessing && timeLeft === null) setTimeLeft(120);
      if (!momoProcessing) setTimeLeft(null);
      if (timeLeft !== null && timeLeft > 0) {
        const timerInterval = setInterval(() => {
          setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);
        return () => clearInterval(timerInterval);
      }
    }, [momoProcessing, timeLeft]);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Mobile Money Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!momoProcessing ? (
              <>
                <p className="text-sm text-gray-400">
                  Enter your mobile money number to receive a payment prompt.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="momoNumber">Mobile Money Number</Label>
                  <Input
                    id="momoNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 231881158457"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Include country code without plus sign (e.g., 231 for Liberia)
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">Payment Pending</h3>
                <p className="text-sm text-gray-400">
                  Check your mobile money app for a payment prompt
                </p>
                {timeLeft !== null && (
                  <div className="mt-6">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-white">{timeLeft}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Time remaining to complete payment
                    </p>
                  </div>
                )}
                <div className="bg-gray-800 p-3 rounded-md text-sm text-gray-300">
                  <p>
                    Payment request sent to:{" "}
                    <span className="text-white font-medium">{phoneNumber}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {!momoProcessing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSubmit(phoneNumber)}
                  disabled={!phoneNumber}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Proceed to Pay
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  setIsProcessing(false);
                }}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel Payment
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const handleCompleteCheckout = () => router.push("/events");

  if (cart.length === 0 && !orderCompleted) {
    router.push("/cart");
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToCart}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-white ml-4">Checkout</h1>
          </div>

          <CheckoutSteps currentStep={currentStep} />

          {currentStep === 0 && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Your tickets will be sent to the email you provide
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-400">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={contactInfo.firstName}
                      onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                      className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-400">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                      className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-400">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  <p className="text-gray-400 text-sm mt-1">Your tickets will be sent to this email address</p>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-400">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-gray-400">Country</Label>
                  <div className="bg-gray-800 border border-gray-700 rounded-md p-3 flex items-center mt-1">
                    <span className="text-white">{eventCountry}</span>
                    <span className="ml-auto text-sm text-gray-400">{`(${currencyCode})`}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Country and currency are based on the event location</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={handleContinueToPayment}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white">Payment Method</CardTitle>
                <CardDescription className="text-gray-400">
                  Select your preferred payment method for {eventCountry}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {availablePaymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => handlePaymentMethodChange(method.id)}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? "bg-purple-950/70 ring-1 ring-purple-500 border border-purple-800"
                            : "bg-gray-800 hover:bg-gray-800/80 border border-gray-700"
                        }`}
                      >
                        <div className="h-10 w-10 bg-gray-700 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                          <Image
                            src={method.icon}
                            alt={method.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-white font-medium">{method.name}</p>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`w-6 h-6 rounded-full ${
                              paymentMethod === method.id
                                ? "bg-purple-600 flex items-center justify-center"
                                : "border-2 border-gray-600"
                            }`}
                          >
                            {paymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.paymentMethod && (
                    <div className="bg-red-900/30 p-3 rounded-md border border-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <p className="text-red-400">{errors.paymentMethod}</p>
                    </div>
                  )}

                  {paymentMethod === "stripe" && (
                    <div className="mt-6">
                      {stripeClientSecret ? (
                        <Elements
                          stripe={stripePromise}
                          options={{
                            clientSecret: stripeClientSecret,
                            appearance: {
                              theme: "night",
                              variables: {
                                colorPrimary: "#9333EA",
                                colorBackground: "#1F2937",
                                colorText: "#FFFFFF",
                                colorDanger: "#EF4444",
                                fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                                borderRadius: "0.375rem",
                              },
                            },
                          }}
                        >
                          <StripePaymentForm
                            clientSecret={stripeClientSecret}
                            total={total}
                            currencySymbol={currencySymbol}
                            onPaymentSuccess={(paymentId) => {
                              setOrderReference(paymentId);
                              setCurrentStep(2);
                              setOrderCompleted(true);
                              clearCart();
                            }}
                          />
                        </Elements>
                      ) : (
                        <div className="text-center py-4">
                          <Button
                            onClick={handleStripePayment}
                            disabled={isProcessing}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up payment...
                              </>
                            ) : (
                              "Continue to Card Payment"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {showMobileMoneyInput && (
                    <div className="mt-6">
                      <Label htmlFor="mobileMoneyNumber" className="text-gray-400">
                        Mobile Money Number
                      </Label>
                      <Input
                        id="mobileMoneyNumber"
                        placeholder="Enter your mobile money number"
                        value={mobileMoneyNumber}
                        onChange={(e) => setMobileMoneyNumber(e.target.value)}
                        className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.mobileMoneyNumber ? "border-red-500" : ""}`}
                      />
                      {errors.mobileMoneyNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyNumber}</p>
                      )}
                      <p className="text-gray-400 text-sm mt-1">
                        You will receive a payment prompt on this number
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                {paymentMethod && paymentMethod !== "stripe" && (
                  <Button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Payment"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-gray-900 border-gray-800 mb-8">
              <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white">Order Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Thank You For Your Order!</h2>
                  <p className="text-gray-400 mb-6">Order #{orderReference}</p>
                  <p className="text-gray-300 mb-4">
                    We&apos;ve sent a confirmation email to{" "}
                    <span className="text-white font-medium">{contactInfo.email}</span>
                  </p>
                  <div className="max-w-md mx-auto bg-gray-800/50 rounded-lg p-4 text-left">
                    <p className="text-white text-sm mb-2">Your tickets will be available in:</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Email confirmation with QR code</li>
                      <li>• Tick8+ app (if you have an account)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={handleCompleteCheckout}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Browse More Events
                  </Button>
                  <Link href="/tickets">
                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-900/20"
                    >
                      View My Tickets
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          )}

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2">
                    <div>
                      <p className="text-white font-medium">{item.event.name}</p>
                      <p className="text-gray-400 text-sm">{item.ticketName} x {item.qty}</p>
                      {item.merchandise.length > 0 && (
                        <div className="mt-1">
                          {item.merchandise.map((merch, i) => (
                            <p key={i} className="text-gray-500 text-xs">
                              + {merch.itemName} x {merch.qty}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-white">
                        {currencySymbol}{(
                          item.salePrice * item.qty +
                          item.merchandise.reduce((total, m) => total + m.price * m.qty, 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="bg-gray-800 my-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {coupon?.code && `Coupon: ${coupon.code.toUpperCase()}`}
                    </span>
                    <span>-{currencySymbol}{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Fee (5%)</span>
                  <span className="text-white">{currencySymbol}{fees.toFixed(2)}</span>
                </div>
                <Separator className="bg-gray-800 my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-purple-400 text-xl">{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
      <MomoPaymentModal
        isOpen={showMomoModal}
        onClose={() => {
          setShowMomoModal(false);
          setIsProcessing(false);
        }}
        onSubmit={handleMomoPayment}
        isProcessing={isPaymentProcessing}
      />
    </>
  );
};

export default CheckoutPage;
