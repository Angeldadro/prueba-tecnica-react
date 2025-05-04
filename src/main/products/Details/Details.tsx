import './Details.css'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import AuthenticatedLayout from "../../shared/components/AuthenticatedLayout"
import { useSelector } from "react-redux"
import { RootState } from "../../../stores"
import { uCookies } from "../../../shared/services/cookies"
import { Product } from "../../dashboard/products/interfaces/Product"
import Button from '../../shared/components/common/Button/Button'
import ProcessCardInfo from '../../shared/components/ProcessCardInfo/ProcessCardInfo'

export default function ProductDetails() {
    const { id } = useParams() 
    const { productMemory } = useSelector((state: RootState) => state.products)

    const [product, setProduct] = useState<Product>(productMemory)

    useEffect(() => {
        if (productMemory.id !== '') uCookies.setCookie('productMemory', JSON.stringify(productMemory))
        
        const product = JSON.parse(uCookies.getCookie('productMemory'))
        setProduct(product)
    }, [])

    return (
        <AuthenticatedLayout>
            <article className='p-all'>
                <div className="product-details-info">
                    <div className='product-sel'>
                        <h1>{product.name}</h1>
                        <p id='desc-product'>{product.description}</p>
                    </div>

                    <div className='product-amount'>
                        <div>
                            <p>Fee</p>
                            <span>USD {(product.price ? product.price / 100 : 0).toFixed(2)}</span>
                        </div>

                        <div>
                            <p>Total</p>
                            <span>USD {product.price}</span>
                        </div>
                    </div>
                </div>

                <div className='product-details-payment'>
                    <p>Payments method available.</p>
                    <Button>Pay with credit card</Button>
                </div>
            </article>

            <ProcessCardInfo />
        </AuthenticatedLayout>
    )
}