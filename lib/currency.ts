const API_KEY = ' 3dff3c89fad4796c0526f72d';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let USD_TO_KES_RATE: number | null = null;
let lastFetchTime: number = 0;

async function fetchExchangeRate() {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        USD_TO_KES_RATE = data.rates.KES;
        lastFetchTime = Date.now();
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback to a default rate if API call fails
        USD_TO_KES_RATE = 150;
    }
}

export async function getExchangeRate(): Promise<number> {
    // Fetch new rate if it's null or older than 1 hour
    if (USD_TO_KES_RATE === null || Date.now() - lastFetchTime > 3600000) {
        await fetchExchangeRate();
    }
    return USD_TO_KES_RATE!;
}

export async function convertToKES(amount: number, currency: 'USD' | 'KES'): Promise<number> {
    if (currency === 'USD') {
        const rate = await getExchangeRate();
        return amount * rate;
    }
    return amount;
}

export function detectCurrency(price: string): 'USD' | 'KES' {
    return price.toLowerCase().includes('$') ? 'USD' : 'KES';
}

export async function sortPrices(prices: number[], currency: 'USD' | 'KES', order: 'asc' | 'desc'): Promise<number[]> {
    const convertedPrices = await Promise.all(prices.map(price => convertToKES(price, currency)));
    return convertedPrices.sort((a, b) => order === 'asc' ? a - b : b - a);
}