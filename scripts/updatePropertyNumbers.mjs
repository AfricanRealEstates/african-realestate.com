import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updatePropertyNumbers() {
  let propertyNumber = 7000;

  try {
    // Fetch all properties ordered by creation date
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Update each property with a new propertyNumber
    for (const property of properties) {
      await prisma.property.update({
        where: { id: property.id },
        data: { propertyNumber: propertyNumber++ },
      });
    }

    console.log(
      `Updated ${properties.length} properties with new property numbers.`
    );
  } catch (error) {
    console.error("Error updating property numbers:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePropertyNumbers();
