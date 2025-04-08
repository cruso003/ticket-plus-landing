// app/checkout/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/page';
import { Footer } from '@/components/footer/page';
import useEventStore from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { currencyMapping } from '@/utils/currency';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { TICKETPLUS_API_URL } from '@/constants';
import Image from 'next/image';

// Payment Provider Icons
import stripeIcon from '@/public/images/cards.jpg';
import flutterwaveIcon from '@/public/images/rave.jpg';
import momoIcon from '@/public/images/momo.jpg';
//import orangeMoneyIcon from '@/public/images/orange-money.svg';
import airtelMoneyIcon from '@/public/images/airtel.jpg';

// Country-specific payment methods
const PAYMENT_METHODS = {
  Nigeria: [
    { id: 'flutterwave', name: 'Flutterwave', icon: flutterwaveIcon },
  ],
  Liberia: [
    { id: 'stripe', name: 'Credit/Debit Card', icon: stripeIcon },
    { id: 'mtn_momo', name: 'MTN Mobile Money', icon: momoIcon },
    //{ id: 'orange_money', name: 'Orange Money', icon: orangeMoneyIcon },
  ],
  Rwanda: [
    { id: 'stripe', name: 'Credit/Debit Card', icon: stripeIcon },
    { id: 'mtn_momo', name: 'MTN Mobile Money', icon: momoIcon },
    { id: 'airtel_money', name: 'Airtel Money', icon: airtelMoneyIcon },
  ],
  Uganda: [
    { id: 'stripe', name: 'Credit/Debit Card', icon: stripeIcon },
    { id: 'mtn_momo', name: 'MTN Mobile Money', icon: momoIcon },
    { id: 'airtel_money', name: 'Airtel Money', icon: airtelMoneyIcon },
  ],
  'default': [
    { id: 'stripe', name: 'Credit/Debit Card', icon: stripeIcon },
  ]
};

// Step indicator component
const CheckoutSteps = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { name: 'Information', status: currentStep >= 1 ? 'complete' : 'current' },
    { name: 'Payment', status: currentStep >= 2 ? 'complete' : currentStep === 1 ? 'current' : 'upcoming' },
    { name: 'Confirmation', status: currentStep >= 3 ? 'complete' : currentStep === 2 ? 'current' : 'upcoming' },
  ];

  return (
    <nav className="mb-8">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => (
          <li key={step.name} className="relative flex items-center">
            {index > 0 && (
              <div className={`absolute top-1/2 -translate-y-1/2 left-0 h-[2px] w-8 -ml-8 ${
                step.status === 'upcoming' ? 'bg-gray-700' : 'bg-purple-600'
              }`} />
            )}
            <div className="flex flex-col items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step.status === 'complete' ? 'bg-purple-600' : 
                step.status === 'current' ? 'bg-purple-900 border-2 border-purple-600' : 
                'bg-gray-800 border border-gray-700'
              }`}>
                {step.status === 'complete' ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${
                    step.status === 'current' ? 'text-white' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`text-sm font-medium ${
                step.status === 'upcoming' ? 'text-gray-500' : 'text-white'
              }`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-[2px] w-8 ml-0 ${
                steps[index+1].status === 'upcoming' ? 'bg-gray-700' : 'bg-purple-600'
              }`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, getCartSubtotal, clearCart } = useEventStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderReference, setOrderReference] = useState('');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [showMobileMoneyInput, setShowMobileMoneyInput] = useState(false);
  
  // Form states
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: cart.length > 0 ? cart[0].country : 'Nigeria',
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  
  // Calculate totals
  const subtotal = getCartSubtotal();
  const fees = subtotal * 0.05; // 5% service fee
  const total = subtotal + fees;

  // Select payment methods based on country
  const availablePaymentMethods = 
    PAYMENT_METHODS[contactInfo.country as keyof typeof PAYMENT_METHODS] || 
    PAYMENT_METHODS.default;

  useEffect(() => {
    // Reset payment method when country changes
    setPaymentMethod('');
    setShowMobileMoneyInput(false);
  }, [contactInfo.country]);

  useEffect(() => {
    // Show mobile money input field if a mobile money method is selected
    if (['mtn_momo', 'orange_money', 'airtel_money'].includes(paymentMethod)) {
      setShowMobileMoneyInput(true);
    } else {
      setShowMobileMoneyInput(false);
    }
  }, [paymentMethod]);
  
  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!contactInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!contactInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(contactInfo.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
      setErrors(newErrors);
      return false;
    }

    if (paymentMethod === 'stripe') {
      if (!cardInfo.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!cardInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!cardInfo.expiry.trim()) newErrors.expiry = 'Expiry date is required';
      if (!cardInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
      
      // Validate card number (simple check for demo)
      if (cardInfo.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      // Validate expiry (MM/YY format)
      if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiry)) {
        newErrors.expiry = 'Please use MM/YY format';
      }
      
      // Validate CVV (3-4 digits)
      if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }

    if (['mtn_momo', 'orange_money', 'airtel_money'].includes(paymentMethod)) {
      if (!mobileMoneyNumber.trim()) {
        newErrors.mobileMoneyNumber = 'Mobile money number is required';
      } else {
        // Simple validation - can be enhanced based on country-specific formats
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(mobileMoneyNumber.replace(/\s/g, ''))) {
          newErrors.mobileMoneyNumber = 'Please enter a valid phone number';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleBackToCart = () => {
    router.push('/cart');
  };
  
  const handleContinueToPayment = () => {
    if (validateContactInfo()) {
      setCurrentStep(1);
    } else {
      toast.error('Please correct the errors in the form');
    }
  };
  
  const handleProcessPayment = async () => {
    if (!validatePaymentInfo()) {
      toast.error('Please correct the payment information');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // First check if the user exists or create a new one
      const userResponse = await axios.post(`${TICKETPLUS_API_URL}/user/find-or-create`, {
        email: contactInfo.email,
        name: `${contactInfo.firstName} ${contactInfo.lastName}`,
        phone: contactInfo.phone,
        country: contactInfo.country
      });
      
      const userId = userResponse.data.userId;
      
      // Process payment based on selected method
      let paymentResponse;
      
      switch(paymentMethod) {
        case 'stripe':
          // Simulate Stripe payment for demo
          paymentResponse = await axios.post(`${TICKETPLUS_API_URL}/payment/intents`, {
            amount: Math.round(total * 100), // Convert to cents for Stripe
            currency: 'usd',
            paymentMethodType: 'card',
            // In production, this would be integrated with Stripe.js
            // For demo, we'll simulate a successful payment
            simulated: true
          });
          break;
          
        case 'flutterwave':
          // Simulate Flutterwave payment
          paymentResponse = await axios.post(`${TICKETPLUS_API_URL}/payment/flutterwave`, {
            amount: total,
            email: contactInfo.email,
            phone: contactInfo.phone,
            name: `${contactInfo.firstName} ${contactInfo.lastName}`,
            // For demo, simulate success
            simulated: true
          });
          break;
          
        case 'mtn_momo':
        case 'orange_money':
        case 'airtel_money':
          // Simulate mobile money payment
          paymentResponse = await axios.post(`${TICKETPLUS_API_URL}/payment/mobile-money`, {
            amount: total,
            phone: mobileMoneyNumber,
            provider: paymentMethod,
            // For demo, simulate success
            simulated: true
          });
          break;
          
        default:
          throw new Error('Unsupported payment method');
      }
      
      if (paymentResponse.data.success) {
        // Create order
        const orderItems = cart.map(item => ({
          event: item.event._id,
          ticketId: item.ticketId,
          ticketName: item.ticketName,
          ticketPrice: item.salePrice,
          quantity: item.qty,
          merchandise: item.merchandise.map(merch => ({
            _id: merch._id,
            itemName: merch.itemName,
            price: merch.price,
            qty: merch.qty
          }))
        }));
        
        const orderResponse = await axios.post(`${TICKETPLUS_API_URL}/orders/place-order`, {
          user: userId,
          tickets: orderItems,
          status: 'Success',
          payment: {
            transactionId: paymentResponse.data.transactionId || `demo-${Date.now()}`,
            amount: total,
            paymentMethod: paymentMethod
          },
          contactInfo: {
            email: contactInfo.email,
            phone: contactInfo.phone,
            name: `${contactInfo.firstName} ${contactInfo.lastName}`
          }
        });
        
        if (orderResponse.data) {
          setOrderReference(orderResponse.data._id || `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
          setCurrentStep(2);
        } else {
          throw new Error('Order creation failed');
        }
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCompleteCheckout = () => {
    clearCart();
    router.push('/events');
  };
  
  if (cart.length === 0) {
    router.push('/cart');
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
                      onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
                      className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-400">Last Name</Label>
                    <Input 
                      id="lastName"
                      placeholder="Doe"
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
                      className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
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
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.email ? 'border-red-500' : ''}`}
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
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-gray-400">Country</Label>
                  <Select 
                    value={contactInfo.country} 
                    onValueChange={(value) => setContactInfo({...contactInfo, country: value})}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Liberia">Liberia</SelectItem>
                      <SelectItem value="Rwanda">Rwanda</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                    </SelectContent>
                  </Select>
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
                  Select your preferred payment method for {contactInfo.country}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {availablePaymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'bg-purple-950/70 ring-1 ring-purple-500 border border-purple-800' 
                            : 'bg-gray-800 hover:bg-gray-800/80 border border-gray-700'
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
                          <div className={`w-6 h-6 rounded-full ${
                            paymentMethod === method.id 
                              ? 'bg-purple-600 flex items-center justify-center' 
                              : 'border-2 border-gray-600'
                          }`}>
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
                  
                  {paymentMethod === 'stripe' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardName" className="text-gray-400">Name on Card</Label>
                        <Input 
                          id="cardName"
                          placeholder="John Doe"
                          value={cardInfo.cardName}
                          onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                          className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.cardName ? 'border-red-500' : ''}`}
                        />
                        {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-400">Card Number</Label>
                        <div className="relative">
                          <Input 
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardInfo.cardNumber}
                            onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                            className={`bg-gray-800 border-gray-700 text-white mt-1 pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry" className="text-gray-400">Expiry Date</Label>
                          <Input 
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                            className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.expiry ? 'border-red-500' : ''}`}
                          />
                          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-gray-400">CVV</Label>
                          <Input 
                            id="cvv"
                            placeholder="123"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                            className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.cvv ? 'border-red-500' : ''}`}
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {showMobileMoneyInput && (
                    <div className="mt-6">
                      <Label htmlFor="mobileMoneyNumber" className="text-gray-400">Mobile Money Number</Label>
                      <Input 
                        id="mobileMoneyNumber"
                        placeholder="Enter your mobile money number"
                        value={mobileMoneyNumber}
                        onChange={(e) => setMobileMoneyNumber(e.target.value)}
                        className={`bg-gray-800 border-gray-700 text-white mt-1 ${errors.mobileMoneyNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.mobileMoneyNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyNumber}</p>}
                      <p className="text-gray-400 text-sm mt-1">
                        You will receive a payment prompt on this number
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
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
                    'Complete Payment'
                  )}
                </Button>
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
                  <p className="text-gray-400 mb-6">
                    Order #{orderReference}
                  </p>
                  <p className="text-gray-300 mb-4">
                    We&apos;ve sent a confirmation email to <span className="text-white font-medium">{contactInfo.email}</span>
                  </p>
                  <div className="max-w-md mx-auto bg-gray-800/50 rounded-lg p-4 text-left">
                    <p className="text-white text-sm mb-2">Your tickets will be available in:</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Email confirmation with QR code</li>
                      <li>• Ticket8+ app (if you have an account)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button 
                  onClick={handleCompleteCheckout}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Browse More Events
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Order Summary */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Cart Items */}
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
                        {currencyMapping[item.country] || '$'}
                        {(item.salePrice * item.qty + 
                          item.merchandise.reduce((total, m) => total + m.price * m.qty, 0)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-gray-800 my-4" />
              
              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Fee (5%)</span>
                  <span className="text-white">${fees.toFixed(2)}</span>
                </div>
                <Separator className="bg-gray-800 my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-purple-400 text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
