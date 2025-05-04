export const uCookies = {
    /**
     * Obtiene el valor de una cookie específica por su nombre.
     * @param key El nombre (clave) de la cookie a buscar.
     * @returns El valor de la cookie como string, o una cadena vacía si no se encuentra.
     */
    getCookie(key: string): string {
        const encodedKey = encodeURIComponent(key);
        const keyEquals = encodedKey + "=";
        const cookieArray = document.cookie.split(';');

        for(let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }

            if (cookie.indexOf(keyEquals) === 0) {
                const value = decodeURIComponent(cookie.substring(keyEquals.length, cookie.length));
                return value;
            }
        }
        return "";
    },

    /**
     * Crea o actualiza una cookie.
     * @param key El nombre (clave) de la cookie.
     * @param value El valor a almacenar en la cookie. Puede ser cualquier tipo, se convertirá a string (JSON si es objeto/array).
     * @param options Opciones adicionales para la cookie (opcional).
     * @param options.expires Días hasta que la cookie expire (número), o una fecha específica (Date). Si se omite, es una cookie de sesión.
     * @param options.path La ruta para la cual la cookie es válida (string, por defecto '/').
     * @param options.domain El dominio para el cual la cookie es válida (string).
     * @param options.secure Si es true, la cookie solo se enviará sobre HTTPS (boolean).
     * @param options.samesite Controla cuándo se envía la cookie con solicitudes entre sitios ('Strict', 'Lax', 'None'). Requiere 'secure=true' si es 'None'.
     */
    setCookie(key: string, value: any, options?: {
        expires?: number | Date;
        path?: string;
        domain?: string;
        secure?: boolean;
        samesite?: 'Strict' | 'Lax' | 'None';
    }) {
        const encodedKey = encodeURIComponent(key);
        let encodedValue: string;

        if (typeof value === 'object' && value !== null) {
            try {
                encodedValue = encodeURIComponent(JSON.stringify(value));
            } catch (e) {
                console.error("Could not stringify value for cookie:", value, e);
                return;
            }
        } else {
            encodedValue = encodeURIComponent(String(value));
        }

        let cookieString = `${encodedKey}=${encodedValue}`;
        options = options || {};

        if (options.expires) {
            let expiresDate: Date;
            if (typeof options.expires === 'number') {
                expiresDate = new Date();
                expiresDate.setTime(expiresDate.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                expiresDate = options.expires;
            }
            cookieString += "; expires=" + expiresDate.toUTCString();
        }

        cookieString += "; path=" + (options.path || '/');

        if (options.domain) {
            cookieString += "; domain=" + options.domain;
        }

        if (options.secure) {
            cookieString += "; secure";

        }

        if (options.samesite) {
            cookieString += "; samesite=" + options.samesite;             if (options.samesite.toLowerCase() === 'none' && !options.secure) {
                console.warn(`Cookie '${key}': SameSite=None requires the Secure attribute to be set.`);
            }
        }

        document.cookie = cookieString;
    }
}