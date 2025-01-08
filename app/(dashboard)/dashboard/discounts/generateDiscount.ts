// export function generateDiscountCode(): string {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
//     let result = ''
//     for (let i = 0; i < 8; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length))
//     }
//     return result
// }

import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10)

export function generateDiscountCode(): string {
    return nanoid()
}