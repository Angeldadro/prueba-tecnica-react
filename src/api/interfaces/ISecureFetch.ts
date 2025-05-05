type MethodsAllowed = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface SecureFetchType {
    options: {
        url: string,
        method: MethodsAllowed
        headers?: any
        body?: any,
        signal?: AbortSignal,
        stringifyBody?: boolean;
        convertJson?: boolean; 
    }
}