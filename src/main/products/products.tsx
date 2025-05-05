import './products.css'
import AuthenticatedLayout from "../shared/components/AuthenticatedLayout";
import CardProduct from "../dashboard/products/CardProduct/CardProduct";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores";
import { fetchProducts } from "../../stores/ProductSlice";

export default function ProductsUser() {
    const { error, items, status } = useSelector((state: RootState) => state.products)
    const dispatcher: AppDispatch = useDispatch(); 

    const getProductData = async () => {
        await dispatcher(fetchProducts())
    }

    useEffect(() => {
        getProductData()
    }, [])
    
    return (
        <AuthenticatedLayout>
            <div className="product-use-title">
                <h1>Products</h1>

                {error && <p>{error}</p>}
            </div>

            <CardProduct item={items} state={status === 'loading'}/>
        </AuthenticatedLayout>
    )
}