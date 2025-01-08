import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function updatePropertyNumbers() {
  let propertyNumber = 7000;
  let updatedCount = 0;

  try {
    // Fetch all properties ordered by creation date
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(`Found ${properties.length} properties to update.`);

    // Update each property with a new propertyNumber
    for (const property of properties) {
      try {
        const updatedProperty = await prisma.property.update({
          where: { id: property.id },
          data: { propertyNumber: propertyNumber },
        });

        if (updatedProperty.propertyNumber === propertyNumber) {
          console.log(
            `Updated property ${property.id} with number ${propertyNumber}`
          );
          updatedCount++;
          propertyNumber++;
        } else {
          console.error(
            `Failed to update property ${property.id}. Expected ${propertyNumber}, got ${updatedProperty.propertyNumber}`
          );
        }
      } catch (updateError) {
        console.error(`Error updating property ${property.id}:`, updateError);
      }
    }

    console.log(
      `Successfully updated ${updatedCount} out of ${properties.length} properties with new property numbers.`
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePropertyNumbers();
