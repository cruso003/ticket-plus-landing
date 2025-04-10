// components/cart/MiniCartDrawer.tsx
"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useEventStore from "@/store/eventStore";
import { currencyMapping } from '@/utils/currency';
import { Separator } from "@/components/ui/separator";

interface MiniCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MiniCartDrawer = ({ open, onClose }: MiniCartDrawerProps) => {
  const router = useRouter();
  const { cart, getCartSubtotal } = useEventStore();

  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleViewCart = () => {
    handleClose();
    router.push('/cart');
  };

  const handleCheckout = () => {
    handleClose();
    router.push('/checkout');
  };

  const recentlyAddedItem = cart.length > 0 ? cart[cart.length - 1] : null;
  const subtotal = getCartSubtotal();
  
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-md bg-[#151a30] border-gray-800 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Added to Cart
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>
        
        {recentlyAddedItem && (
          <div className="py-4">
            <div className="flex gap-4 mb-4">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={recentlyAddedItem.event.imageUrl || '/images/event-placeholder.jpg'}
                  alt={recentlyAddedItem.event.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-base">{recentlyAddedItem.event.name}</h3>
                <p className="text-gray-400 text-sm">{recentlyAddedItem.ticketName}</p>
                <div className="mt-1">
                  <div className="text-purple-400 font-medium">
                    {currencyMapping[recentlyAddedItem.country] || '$'}{recentlyAddedItem.salePrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            {recentlyAddedItem.merchandise.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Merchandise</p>
                {recentlyAddedItem.merchandise.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-2 bg-[#1a2040] rounded-md mb-2">
                    <span className="text-white text-sm">{item.itemName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Qty: {item.qty}</span>
                      <span className="text-purple-400 text-sm font-medium">
                        {currencyMapping[recentlyAddedItem.country] || '$'}{item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <Separator className="bg-gray-800 my-4" />
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white font-bold text-lg">
            {currencyMapping[recentlyAddedItem?.country || 'Liberia'] || '$'}{subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="grid gap-4">
          <Button 
            onClick={handleCheckout}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleViewCart}
            className="w-full border-gray-700 bg-slate-400 text-white hover:bg-gray-800 hover:text-white"
          >
            View Cart
          </Button>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button 
            variant="link" 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MiniCartDrawer;
