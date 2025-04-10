// app/cart/page.tsx
"use client";
import React, { useState } from "react";
import { Header } from "@/components/header/page";
import { Footer } from "@/components/footer/page";
import useEventStore from "@/store/eventStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { currencyMapping } from "@/utils/currency";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { TICKETPLUS_API_URL } from "@/constants";

const CartPage = () => {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateMerchandiseQuantity,
    clearCart,
    getCartTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useEventStore();

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleRemoveItem = (index: number) => {
    removeFromCart(index);
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (
    index: number,
    type: "more" | "less",
    maxQty?: number
  ) => {
    updateQuantity(index, type, maxQty);
  };

  const handleMerchandiseQuantityChange = (
    cartIndex: number,
    merchIndex: number,
    type: "more" | "less"
  ) => {
    updateMerchandiseQuantity(cartIndex, merchIndex, type);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const response = await axios.post(
        `${TICKETPLUS_API_URL}/coupons/validate`,
        {
          code: couponCode,
          eventId: cart[0].event._id,
          userId: "guest",
        }
      );

      if (response.data.success) {
        applyCoupon(response.data.coupon);
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        toast.error(response.data.message || "Invalid coupon code");
      }
    } catch (error: unknown) {
      console.error("Error validating coupon:", error);
      const axiosError = error as AxiosError<{message?: string}>;
      setCouponError(
        axiosError.response?.data?.message || "Failed to validate coupon"
      );
      toast.error(axiosError.response?.data?.message || "Failed to validate coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setCouponError(null);
    toast.success("Coupon removed");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    router.push("/checkout");
  };

  // Calculate totals
  const { subtotal, discount, fees, total } = getCartTotal();

  // Get currency symbol based on the first item in cart
  // Default to $ if cart is empty or country is not found
  const currencySymbol = cart.length > 0 
    ? (currencyMapping[cart[0].country] || '$') 
    : '$';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

          {cart.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-800 p-6 rounded-full mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-400 mb-6 text-center max-w-md">
                  Looks like you haven&apos;t added any events to your cart yet.
                  Browse our events to find something you&apos;ll love!
                </p>
                <Button
                  onClick={() => router.push("/events")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-white">
                      Cart Items ({cart.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-800 last:border-0"
                      >
                        <div className="p-4 sm:p-6">
                          {/* Main Item */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Image */}
                            <div className="relative h-32 sm:h-24 sm:w-36 w-full rounded-md overflow-hidden">
                              <Image
                                src={
                                  item.event.imageUrl ||
                                  "/images/event-placeholder.jpg"
                                }
                                alt={item.event.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-white font-medium">
                                    {item.event.name}
                                  </h3>
                                  <p className="text-gray-400 text-sm">
                                    {item.ticketName}
                                  </p>
                                  <div className="flex gap-2 items-center mt-1">
                                    <span className="text-purple-400 font-medium">
                                      {currencyMapping[item.country] || "$"}
                                      {item.salePrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(index)}
                                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center mt-3">
                                <span className="text-sm text-gray-400 mr-2">
                                  Quantity:
                                </span>
                                <div className="flex items-center border border-gray-700 rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={item.qty <= 1}
                                    onClick={() =>
                                      handleQuantityChange(index, "less")
                                    }
                                    className="h-8 w-8 text-gray-400 hover:text-white"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-10 text-center text-white">
                                    {item.qty}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={item.qty >= item.event.quantity}
                                    onClick={() =>
                                      handleQuantityChange(
                                        index,
                                        "more",
                                        item.event.quantity
                                      )
                                    }
                                    className="h-8 w-8 text-gray-400 hover:text-white"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Merchandise */}
                          {item.merchandise && item.merchandise.length > 0 && (
                            <div className="mt-4 ml-0 sm:ml-40">
                              <p className="text-sm text-gray-400 mb-2">
                                Merchandise
                              </p>
                              <div className="space-y-2">
                                {item.merchandise.map((merch, merchIndex) => (
                                  <div
                                    key={merchIndex}
                                    className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-md"
                                  >
                                    <span className="text-white text-sm">
                                      {merch.itemName}
                                    </span>
                                    <div className="flex items-center">
                                      <div className="flex items-center border border-gray-700 rounded-md mr-4">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          disabled={merch.qty <= 1}
                                          onClick={() =>
                                            handleMerchandiseQuantityChange(
                                              index,
                                              merchIndex,
                                              "less"
                                            )
                                          }
                                          className="h-7 w-7 text-gray-400 hover:text-white"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center text-white text-sm">
                                          {merch.qty}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleMerchandiseQuantityChange(
                                              index,
                                              merchIndex,
                                              "more"
                                            )
                                          }
                                          className="h-7 w-7 text-gray-400 hover:text-white"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      <span className="text-purple-400 text-sm font-medium w-20 text-right">
                                        {currencyMapping[item.country] || "$"}
                                        {(merch.price * merch.qty).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 flex justify-between pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/events")}
                      className="text-gray-400 hover:text-white"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50"
                    >
                      Clear Cart
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-gray-900 border-gray-800 sticky top-24">
                  <CardHeader className="border-b border-gray-800">
                    <CardTitle className="text-white">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Coupon Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Coupon Code
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={!!coupon}
                          className={`bg-gray-800 border-gray-700 text-white ${
                            coupon
                              ? "border-green-500"
                              : couponError
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {!coupon ? (
                          <Button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {isApplyingCoupon ? "Applying..." : "Apply"}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleRemoveCoupon}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      {couponError && (
                        <p className="text-red-500 text-sm mt-1">
                          {couponError}
                        </p>
                      )}

                      {coupon && (
                        <div className="mt-2 text-sm text-green-400 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% discount applied`
                            : `${currencySymbol}${coupon.discountValue} discount applied`}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gray-800 my-4" />

                    {/* Summary */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">
                          {currencySymbol}{subtotal.toFixed(2)}
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {coupon?.code &&
                              `Coupon: ${coupon.code.toUpperCase()}`}
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
                        <span className="text-purple-400 text-xl">
                          {currencySymbol}{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700 text-white"
                      size="lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
