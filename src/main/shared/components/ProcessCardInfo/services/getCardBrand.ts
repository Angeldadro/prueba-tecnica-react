export type CardBrand = 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Diners Club' | 'JCB' | 'Unknown';

/**
 * Intenta identificar la marca de la tarjeta basada en su número (IIN/BIN).
 * ADVERTENCIA: Esto es solo una coincidencia de patrones, no una validación real.
 * @param cardNumber El número de la tarjeta como string.
 * @returns El nombre de la marca probable ('Visa', 'Mastercard', etc.) o 'Unknown'.
 */
export function getCardBrand(cardNumber: string | null | undefined): CardBrand {
    if (!cardNumber) {
        return 'Unknown';
    }
    const sanitizedNumber = cardNumber.replace(/[\s-]/g, '');

    // --- VISA ---
    if (/^4/.test(sanitizedNumber)) {
        return 'Visa';
    }

    // --- MASTERCARD ---
    if (/^5[1-5]/.test(sanitizedNumber)) {
        return 'Mastercard';
    }
    if (sanitizedNumber.length >= 4) {
        const prefix4 = parseInt(sanitizedNumber.substring(0, 4), 10);
        if (prefix4 >= 2221 && prefix4 <= 2720) {
            return 'Mastercard';
        }
    }

    // --- American Express ---
    if (/^3[47]/.test(sanitizedNumber)) {
        return 'American Express';
    }

    // --- Discover ---
    if (/^6(?:011|5[0-9]{2}|4[4-9][0-9]?)/.test(sanitizedNumber)) {
        return 'Discover';
    }

    // --- Diners Club ---
     if (/^3(?:0[0-59]|[689])/.test(sanitizedNumber)) {
         return 'Diners Club';
     }

    // --- JCB ---
     if (sanitizedNumber.length >= 4) {
        const prefix4 = parseInt(sanitizedNumber.substring(0, 4), 10);
        if (prefix4 >= 3528 && prefix4 <= 3589) {
            return 'JCB';
        }
    }
    return 'Unknown';
}