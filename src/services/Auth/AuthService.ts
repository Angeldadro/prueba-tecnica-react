import { secureFetch } from "../../api/secureFetch"
import { API_URL } from "../../config/test.config"

export const AuthService = {
    async login(email: string, password: string): Promise<{ error: string | null, data: any  } | null> {
        const { error, data } = await secureFetch({ options: {
            url: `${API_URL}/auth/login`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: email.trim(),
                password: password.trim()
            },
            stringifyBody: true
            // --pendiente hacer la signal para cancelar peticiones cuando se desmonte el componente.
        }})

        if (data) return { data: data, error: null }
        if (error) return { error: error, data: null }
        return null
    },

    async register(email: string, password: string): Promise<{ error: string | null, data: any  } | null> {
        const { error, data } = await secureFetch({ options: {
            url: `${API_URL}/auth/register`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: email.trim(),
                password: password.trim()
            },
            stringifyBody: true
            // --pendiente hacer la signal para cancelar peticiones cuando se desmonte el componente.
        }})

        if (data) return { data: data, error: null }
        if (error) return { error: error, data: null }
        return null
    }
}