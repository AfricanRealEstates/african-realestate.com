import { auth } from "@/auth";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentPricingPlansWrapper from "@/components/properties/properties-form/PaymentPricingPlansWrapper";
import { prisma } from "@/lib/prisma";

async function getProperties(userId: string, isAdmin: boolean) {
  if (isAdmin) {
    return await prisma.property.findMany({
      take: 15,
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
      take: 15,
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

  if (!userId) {
    return (
      <div className="py-24 lg:py-32">Please log in to access this page.</div>
    );
  }

  const properties = await getProperties(userId, isAdmin);

  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-600 mb-4">
          Showing up to 10 properties
        </p>
        <PaymentPricingPlansWrapper properties={properties} isAdmin={isAdmin} />
        <PaymentForm />
      </div>
    </div>
  );
}
