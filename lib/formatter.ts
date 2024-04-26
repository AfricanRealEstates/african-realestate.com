const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0
})

export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

export function formatNumber(number: number) {
    return NUMBER_FORMATTER.format(number)
}

export function toSlug(str: string) {
    return str
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
}

export function formatDate(dateString: string) {
    let parts = dateString.split('-')
    let hasDay = parts.length > 2

    return new Date(`${dateString}Z`).toLocaleDateString('en-US', {
        day: hasDay ? 'numeric' : undefined,
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    })
}