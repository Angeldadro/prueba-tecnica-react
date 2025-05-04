export interface Product {
    id: string;
    name: string;
    price: number | null;
    stock: number |  null;
    description?: string;
}