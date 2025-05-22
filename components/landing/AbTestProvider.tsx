"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Variant = "A" | "B" | "C";
type TestName = "featuredContent" | "propertyLayout" | "callToAction";

type ABTestContextType = {
  getVariant: (testName: TestName) => Variant | null;
  trackEvent: (testName: TestName, event: string) => void;
  isLoading: boolean;
};

const ABTestContext = createContext<ABTestContextType>({
  getVariant: () => null,
  trackEvent: () => {},
  isLoading: true,
});

export function useABTest() {
  return useContext(ABTestContext);
}

export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const [variants, setVariants] = useState<Record<TestName, Variant>>(
    {} as Record<TestName, Variant>
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load variants on client side
  useEffect(() => {
    const loadVariants = async () => {
      try {
        const testNames: TestName[] = [
          "featuredContent",
          "propertyLayout",
          "callToAction",
        ];

        const variantsData: Record<TestName, Variant> = {} as Record<
          TestName,
          Variant
        >;

        // Load variants for each test
        for (const testName of testNames) {
          const response = await fetch(`/api/ab-test?testName=${testName}`);
          const data = await response.json();

          if (data.variant) {
            variantsData[testName] = data.variant as Variant;
          }
        }

        setVariants(variantsData);
      } catch (error) {
        console.error("Error loading A/B test variants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVariants();
  }, []);

  // Function to get a variant for a specific test
  const getVariant = (testName: TestName): Variant | null => {
    return variants[testName] || null;
  };

  // Function to track events (impressions, clicks, conversions)
  const trackEvent = async (testName: TestName, event: string) => {
    const variant = variants[testName];

    if (!variant) return;

    try {
      await fetch("/api/ab-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName,
          variant,
          event,
        }),
      });
    } catch (error) {
      console.error(`Error tracking ${event} for test ${testName}:`, error);
    }
  };

  return (
    <ABTestContext.Provider value={{ getVariant, trackEvent, isLoading }}>
      {children}
    </ABTestContext.Provider>
  );
}
