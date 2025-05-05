/**
 * Valida un número de tarjeta de crédito usando el Algoritmo de Luhn (Mod 10).
 * ADVERTENCIA: Esto NO verifica si la tarjeta es real, activa o tiene fondos.
 * Es solo una comprobación de checksum para detectar errores de tipeo.
 * @param cardNumber El número de la tarjeta como string.
 * @returns true si el número pasa la validación de Luhn, false en caso contrario.
 */
export function isValidLuhn(cardNumber: string | null | undefined): boolean {
    if (!cardNumber) {
        return false;
    }

    const sanitizedCardNumber = cardNumber.replace(/\D/g, '');

    if (sanitizedCardNumber.length < 13 || sanitizedCardNumber.length > 19) {
        return false
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedCardNumber.charAt(i), 10);

        if (isNaN(digit)) {
            return false;
        }

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}
