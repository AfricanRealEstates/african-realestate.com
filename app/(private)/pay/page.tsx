import PropertyPaymentManager from "@/app/(dashboard)/dashboard/properties/PropertyPaymentManager";
import { auth } from "@/auth";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentPricingPlansWrapper from "@/components/properties/properties-form/PaymentPricingPlansWrapper";
import { prisma } from "@/lib/prisma";
import { getSEOTags } from "@/lib/seo";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = getSEOTags({
  title: "Pay | African Real Estate",
  canonicalUrlRelative: "/pay",
  description:
    "Pay for your properties to publish them and reach more customers.",
});

async function getProperties(userId: string, isAdmin: boolean) {
  if (isAdmin) {
    return await prisma.property.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        propertyType: true,
        price: true,
        currency: true,
        isActive: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  } else {
    return await prisma.property.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      take: 3,
      select: {
        id: true,
        title: true,
        propertyType: true,
        price: true,
        currency: true,
        isActive: true,
      },
    });
  }
}

export default async function PayPage() {
  const session = await auth();
  const userId = session?.user.id;
  const userRole = session?.user.role;
  const isAdmin = userRole === "ADMIN";

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's properties
  const userProperties = await prisma.property.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent
    },
  });

  if (!userId) {
    return (
      <div className="py-24 lg:py-32">
        <h2 className="text-center font-semibold p-1 text-green-500 bg-green-50">
          Please log in to access this page.
        </h2>
      </div>
    );
  }

  const properties = await getProperties(userId, isAdmin);

  const userOrders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent
    },
  });

  console.log(userOrders);

  return (
    <div className="py-24 lg:py-32">
      <div className="max-w-[1200px] w-full mx-auto">
        <p className="text-sm text-gray-600 mb-4">
          Showing up to 10 properties
        </p>
        <PropertyPaymentManager
          properties={userProperties}
          user={{
            id: user.id || "",
            email: user.email || "",
            name: user.name || "",
            phone: user.phoneNumber || "",
          }}
        />
        <PaymentPricingPlansWrapper properties={properties} isAdmin={isAdmin} />
        {/* <PaymentForm transactionConfig={config} />  */}
      </div>
    </div>
  );
}
