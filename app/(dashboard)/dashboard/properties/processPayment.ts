'use server'

import { prisma } from '@/lib/prisma'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not set in the environment variables')
}

interface PaymentDetails {
    propertyIds: string[];
    amount: number;
    userId: string;
    reference: string;
}

export async function processPayment(paymentDetails: PaymentDetails) {
    try {
        let paidAmountInKES = paymentDetails.amount;

        // Only verify with Paystack if the amount is greater than zero
        if (paymentDetails.amount > 0) {
            // Verify the payment with Paystack
            const verificationResponse = await fetch(
                `https://api.paystack.co/transaction/verify/${paymentDetails.reference}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                }
            )

            if (!verificationResponse.ok) {
                throw new Error('Failed to verify payment with Paystack')
            }

            const verificationData = await verificationResponse.json()

            if (verificationData.data.status !== 'success') {
                throw new Error('Payment was not successful')
            }

            // Convert the amount from cents to KES
            paidAmountInKES = verificationData.data.amount / 100

            // Check if the paid amount matches the expected amount
            if (paidAmountInKES !== paymentDetails.amount) {
                throw new Error('Paid amount does not match expected amount')
            }
        }

        // Update the properties status
        const updatedProperties = await prisma.$transaction(
            paymentDetails.propertyIds.map((id) =>
                prisma.property.update({
                    where: { id },
                    data: { isActive: true }
                })
            )
        )

        // Create an order record
        const order = await prisma.order.create({
            data: {
                pricePaid: paidAmountInKES,
                userId: paymentDetails.userId,
                propertyId: paymentDetails.propertyIds.length === 1
                    ? paymentDetails.propertyIds[0]
                    : paymentDetails.propertyIds.join(',') // Store single ID or multiple IDs as comma-separated string
            }
        })

        return {
            success: true,
            properties: updatedProperties,
            order: order,
            message: `Successfully activated ${updatedProperties.length} ${updatedProperties.length === 1 ? 'property' : 'properties'}`
        }
    } catch (error) {
        console.error('Error processing payment:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to process payment' }
    }
}

