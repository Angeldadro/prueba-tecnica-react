import { SecureFetchType } from "./interfaces/ISecureFetch"

export const secureFetch = async ({ options }: SecureFetchType): Promise<{ data: any | null, error: string | null }> => {
    try {
        const res = await fetch(options.url, {
            method: options.method,
            body: options.body ? options.body : null,
            signal: options.signal
        })

        if (!res.ok) {
            throw new Error(`Error | Server has responded with a exit code ${res.status}`)
        }

        const data = await res.json()
        return { data: data, error: null } 
    } catch (error: any) {
        return { error: error.message, data: null }
    }
}