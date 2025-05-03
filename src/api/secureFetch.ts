import { SecureFetchType } from "./interfaces/ISecureFetch"

export const secureFetch = async ({ options }: SecureFetchType): Promise<{ data: any | null, error: string | null }> => {
    try {
        const res = await fetch(options.url, {
            method: options.method,
            body: 
            options.body 
            ? options.stringifyBody 
            ? JSON.stringify(options.body) 
            : options.body : null,
            headers: options.headers
            //signal: options.signal
        })

        if (!res.ok) {
            const error = await res.json()
            console.log(error)
            throw new Error(error || `Error | Server has responded with a exit code ${res.status}`)
        }

        const data = await res.json()
        return { data: data, error: null } 
    } catch (error: any) {
        return { error: error.message, data: null }
    }
}