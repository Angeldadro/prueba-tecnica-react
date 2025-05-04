import './products.css'
import Button from '../../shared/components/common/Button/Button'
import NewProduct from './modals/NewProduct'
import { useState } from 'react'

export default function Products() {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
        <div className='prd-content'>
            <div className='prd-title'>
                <h1>Products</h1>

                <div>
                    <Button onClick={() => {setIsOpen(true)}}>New product</Button>
                </div>
            </div>

            <div></div>

        </div>
        <NewProduct isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}