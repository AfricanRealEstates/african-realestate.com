"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import PaystackButton from "./PaystackButton";
import { FeatureList } from "./FeatureList";
import { applyDiscountCode, getUserDiscounts } from "./discountActions";
import { toast } from "sonner";

export type PropertyCountRange =
  | "1-3"
  | "4-5"
  | "6-10"
  | "11-20"
  | "21-40"
  | ">40";

interface PricingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperties: string[];
  propertyNumbers: number[];
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
}

interface Discount {
  id: string;
  code: string;
  percentage: number;
  startDate: Date;
  expirationDate: Date;
  createdAt: Date;
}

export default function PricingPlanModal({
  isOpen,
  onClose,
  selectedProperties,
  propertyNumbers,
  user,
}: PricingPlanModalProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(
    null
  );
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [userDiscounts, setUserDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDiscounts() {
      const result = await getUserDiscounts();
      if (result.success && result.discounts) {
        setUserDiscounts(result.discounts);
      } else {
        toast.error(result.message || "Failed to fetch discounts");
      }
    }
    fetchDiscounts();
  }, []);

  const propertyCount = selectedProperties.length;
  const propertyRange: PropertyCountRange =
    propertyCount <= 3
      ? "1-3"
      : propertyCount <= 5
      ? "4-5"
      : propertyCount <= 10
      ? "6-10"
      : propertyCount <= 20
      ? "11-20"
      : propertyCount <= 40
      ? "21-40"
      : ">40";

  const handleTierSelection = (tierName: string) => {
    setSelectedTier(tierName);
  };

  const handleDiscountSelection = (discount: Discount) => {
    setSelectedDiscount(discount);
    setDiscountCode(discount.code);
    setDiscountPercentage(discount.percentage);
  };

  const handleApplyDiscount = async () => {
    setIsApplyingDiscount(true);
    setDiscountError(null);
    try {
      const result = await applyDiscountCode(discountCode);
      if (result.success) {
        setDiscountPercentage(result.percentage ?? null);
        setDiscountCode("");
        toast.success("Discount applied successfully");
      } else {
        toast.error(
          result.message ?? "An error occurred while applying the discount."
        );
      }
    } catch (error) {
      toast.error("An error occurred while applying the discount.");
    }
    setIsApplyingDiscount(false);
  };

  const tiers = [
    {
      name: "Bronze",
      title: "Intermediate Agent",
      duration: "30 DAYS",
      durationInDays: 30,
      description: "Perfect for getting started with property listings",
      features: [
        "Basic Listing",
        "Special landing page",
        "Local & Display visibility",
        "Feature for 6hrs",
      ],
      pricing: {
        "1-3": "400",
        "4-5": "350",
        "6-10": "320",
        "11-20": "300",
        "21-40": "275",
        ">40": "250",
      },
    },
    {
      name: "Diamond",
      title: "Advanced Agent",
      duration: "30 DAYS",
      durationInDays: 30,
      description: "Everything in Bronze, plus enhanced visibility",
      recommended: true,
      features: [
        "Everything in Bronze, Plus",
        "Special marketing campaign",
        "Recommended Leads",
        "Feature for 24hrs",
        "Diamond crest on Listings",
      ],
      pricing: {
        "1-3": "1200",
        "4-5": "1100",
        "6-10": "1000",
        "11-20": "900",
        "21-40": "800",
        ">40": "700",
      },
    },
    {
      name: "Platinum",
      title: "Super Agent",
      duration: "60 DAYS",
      durationInDays: 60,
      description: "Everything in Diamond, plus premium features",
      features: [
        "Everything in Diamond, Plus",
        "Feature for 14 days",
        "Platinum Crest on Listings",
        "Top placement on search results",
        "Extra 30 days for free Marketing",
        "5-10 Qualified leads",
        "Pre-qualification for a free video shoot",
        "Special feature in our social media",
        "24/7 Customer Support",
      ],
      pricing: {
        "1-3": "4000",
        "4-5": "3500",
        "6-10": "3000",
        "11-20": "2500",
        "21-40": "2000",
        ">40": "1500",
      },
    },
  ];

  const calculateTotalAmount = (tierName: string) => {
    const tier = tiers.find((t) => t.name === tierName);
    if (!tier) return 0;
    const baseAmount = parseInt(tier.pricing[propertyRange]) * propertyCount;
    if (discountPercentage) {
      const discountedAmount = baseAmount * (1 - discountPercentage / 100);
      return Math.round(discountedAmount);
    }
    return baseAmount;
  };

  const calculateSavings = (tierName: string) => {
    const tier = tiers.find((t) => t.name === tierName);
    if (!tier || !discountPercentage) return 0;
    const baseAmount = parseInt(tier.pricing[propertyRange]) * propertyCount;
    const discountedAmount = calculateTotalAmount(tierName);
    return Math.round(baseAmount - discountedAmount);
  };

  const handlePaystackModalOpen = useCallback(() => {
    setIsPaystackModalOpen(true);
    onClose(); // Close the PricingPlanModal when Paystack modal opens
  }, [onClose]);

  const handlePaymentSuccess = useCallback(
    (reference: any) => {
      toast.success("Payment successful! Your properties have been activated.");
      setIsPaystackModalOpen(false);
      onClose();
    },
    [onClose]
  );

  return (
    <Dialog open={isOpen && !isPaystackModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center mb-8">
          <DialogTitle className="text-3xl font-bold tracking-tight text-blue-900">
            Our Pricing Plans
          </DialogTitle>
          <DialogDescription className="mt-2 text-lg text-muted-foreground">
            Choose the perfect plan for your real estate business
          </DialogDescription>
        </DialogHeader>

        <div className="mb-8 flex flex-col items-center w-full space-y-4">
          <div className="inline-flex items-center rounded-lg border p-2 bg-muted">
            <Label className="mr-3 text-sm font-medium whitespace-nowrap">
              Selected Properties:
            </Label>
            <Select value={propertyRange} disabled>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 properties</SelectItem>
                <SelectItem value="4-5">4-5 properties</SelectItem>
                <SelectItem value="6-10">6-10 properties</SelectItem>
                <SelectItem value="11-20">11-20 properties</SelectItem>
                <SelectItem value="21-40">21-40 properties</SelectItem>
                <SelectItem value=">40">More than 40</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {userDiscounts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {userDiscounts
                .filter((discount) => {
                  const now = new Date();
                  return (
                    new Date(discount.startDate) <= now &&
                    new Date(discount.expirationDate) >= now
                  );
                })
                .map((discount) => (
                  <Badge
                    key={discount.id}
                    variant={
                      selectedDiscount?.id === discount.id
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleDiscountSelection(discount)}
                  >
                    {discount.code} - {discount.percentage}% OFF
                  </Badge>
                ))}
            </div>
          )}

          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button onClick={handleApplyDiscount} disabled={isApplyingDiscount}>
              Apply
            </Button>
          </div>

          {discountError && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{discountError}</AlertDescription>
            </Alert>
          )}

          {discountPercentage && (
            <div className="w-full max-w-3xl mx-auto">
              <Alert className="bg-green-100 border-green-500 border">
                <Check className="h-6 w-6 text-green-600" />
                <AlertTitle className="text-lg font-bold text-green-800">
                  Discount Applied!
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <span className="text-xl font-extrabold text-green-700">
                    {discountPercentage}% OFF
                  </span>
                  <span className="ml-2 text-green-700">
                    on your entire order!
                  </span>
                </AlertDescription>
              </Alert>
              <div className="mt-2 text-center animate-bounce">
                <span className="inline-block transform rotate-45 text-green-500 text-2xl">
                  ➜
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {tiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={`flex flex-col w-full relative ${
                selectedTier === tier.name ? "ring-2 ring-blue-500" : ""
              } ${
                tier.recommended
                  ? "shadow-lg transform hover:scale-105 transition-transform duration-300"
                  : ""
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-blue-800">
                  {tier.title}
                  <span
                    className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {tier.name}
                  </span>
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    KES {parseInt(tier.pricing[propertyRange]).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    per listing
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tier.duration}
                  </p>
                  {discountPercentage && (
                    <p className="text-sm text-green-600 mt-1">
                      You save: KES{" "}
                      {calculateSavings(tier.name).toLocaleString()}
                    </p>
                  )}
                </div>
                <FeatureList
                  features={tier.features}
                  initialVisibleCount={tier.name === "Platinum" ? 5 : 4}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={selectedTier === tier.name ? "default" : "outline"}
                  style={{
                    backgroundColor:
                      selectedTier === tier.name
                        ? "#3b82f6"
                        : tier.recommended
                        ? "#3b82f6"
                        : "transparent",
                    color:
                      selectedTier === tier.name || tier.recommended
                        ? "white"
                        : "#3b82f6",
                    borderColor: "#3b82f6",
                  }}
                  onClick={() => handleTierSelection(tier.name)}
                  disabled={selectedProperties.length === 0}
                >
                  {selectedTier === tier.name ? "Selected" : "Select Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <DialogFooter className="mt-8">
          {selectedTier && (
            <div className="w-full text-center space-y-4">
              <p className="text-xl font-semibold">
                Total: KES {calculateTotalAmount(selectedTier).toLocaleString()}
              </p>
              {discountPercentage && (
                <p className="text-sm text-green-600">
                  You save: KES{" "}
                  {calculateSavings(selectedTier).toLocaleString()}
                </p>
              )}
              {/* <PaystackButton
                propertyIds={selectedProperties}
                amount={calculateTotalAmount(selectedTier)}
                email={user.email}
                name={user.name}
                phone={user.phone}
                userId={user.id}
                onClose={() => setIsPaystackModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                onModalOpen={handlePaystackModalOpen}
              /> */}

              <PaystackButton
                propertyIds={selectedProperties}
                propertyNumbers={propertyNumbers}
                amount={calculateTotalAmount(selectedTier)}
                email={user.email}
                name={user.name}
                phone={user.phone}
                userId={user.id}
                tierDuration={
                  tiers.find((tier) => tier.name === selectedTier)
                    ?.durationInDays || 30
                }
                tierName={selectedTier || ""}
                onClose={() => setIsPaystackModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                onModalOpen={handlePaystackModalOpen}
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
