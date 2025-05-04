import './products.css'
import Button from '../../shared/components/common/Button/Button'
import NewProduct from './modals/NewProduct'
import { useEffect, useState } from 'react'
import { AppDispatch, RootState } from '../../../stores'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../../stores/ProductSlice'
import CardProduct from './CardProduct/CardProduct'

export default function Products() {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch()
    const { status, items, error } = useSelector((state: RootState) => state.products) 

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts())
        }
    }, [])

    return (
        <>
        <div className='prd-content'>
            <div className='prd-title'>
                <h1>Products</h1>

                <div>
                    <Button onClick={() => {setIsOpen(true)}} disabled={status === 'loading'}>New product</Button>
                </div>
            </div>

            <div>
                {error && (
                    <span>{error}</span>
                )}

                <CardProduct item={items} state={status === 'loading'}/>
            </div>
            <NewProduct isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        </>
    )
}