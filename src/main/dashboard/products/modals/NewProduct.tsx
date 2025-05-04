import { createPortal } from "react-dom";
import './NewProduct.css'
import Button from "../../../shared/components/common/Button/Button";
import { useEffect, useState } from "react";
import { Product } from "../interfaces/Product";
import { AppDispatch, RootState } from "../../../../stores";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, clearProductError } from "../../../../stores/ProductSlice";

interface NewProductModalProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    [key: string]: any
}

export default function NewProduct({ isOpen, setIsOpen }: NewProductModalProps) {
    const [product, setProduct] = useState<Product>({ 
        id: '',
        name: '',
        price: null,
        stock: null,
        description: ''
    })

    const dispatch: AppDispatch = useDispatch()

    const { status, error } = useSelector((state: RootState) => state.products)

    useEffect(() => {
        if (isOpen && error) {
            dispatch(clearProductError())
        }

        return () => {
            dispatch(clearProductError())
        }
    }, [])
 
    const handleCloseModal = () => {
        if (status === 'loading') return
        setIsOpen(!isOpen)
        if (error) dispatch(clearProductError())
        setProduct({ name: '', description: '', price: null, stock: null, id: '' })
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const inputsNumbers = ['price', 'stock'];
        setProduct(prevProducto => {
            let updatedValue: string | number = value;

            if (inputsNumbers.includes(name)) {
                updatedValue = value === '' ? 0 : parseFloat(value);
                 if (isNaN(updatedValue)) {
                     updatedValue = 0;
                 } else if (name === 'price' && updatedValue.toString().includes('.')) {
                     const parts = updatedValue.toString().split('.');
                     const fixed = parts[1].slice(0, 2);
                     updatedValue = parseFloat(`${parts[0]}.${fixed}`);
                 } else if (name === 'stock') {
                     updatedValue = Math.floor(updatedValue);
                 }
            }
            return {
                ...prevProducto,
                [name]: updatedValue,
            };
        });

         if (error) {
             dispatch(clearProductError());
         }
    };

    const handleSubmit = async () => {
        if (status === 'loading') return
        if (product.price === 0 || product.stock === 0 || !product.price || !product.stock) return
        if (product.name === '' || product.description === '') return
        product.id = crypto.randomUUID().split('-')[4]

        const result = await dispatch(addProduct(product))
        handleCloseModal()
        console.log(result.payload)
    }

    return createPortal(
        <div className={`new-product ${isOpen ? 'active' : ''}`}>
            <div className={`new-product-cn ${isOpen ? 'active' : ''}`}>
                <div className="title-new">
                    <p>New Product</p>

                    <div onClick={handleCloseModal}>
                        <span>X</span>
                    </div>
                </div>

                <div className="product-fields">
                    <div>
                        <p>Name</p>
                        <input type="text" placeholder="Name of the product..." name="name"
                        onChange={handleInputChange}
                        value={product.name}
                        />
                    </div>

                    <div>
                        <p>Price</p>
                        <input type="number" placeholder="20.00" name="price" 
                        onChange={handleInputChange}
                        value={product.price ? product.price : ''}
                        />
                    </div>

                    <div>
                        <p>Stock</p>
                        <input type="number" placeholder="100.. 15" name="stock" 
                        onChange={handleInputChange}
                        value={product.stock ? product.stock : ''}
                        />
                    </div>
                </div>

                <div className="product-textare-desc">
                    <p>Description</p>

                    <textarea name="description" id="description"
                    placeholder="Describe your product here..."
                    onChange={handleInputChange}
                    value={product.description}
                    ></textarea>
                </div>

                <div className="button-create-prd">
                    <Button onClick={handleSubmit} disabled={status === 'loading' ? true : false}>
                        {status === 'loading' ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-new-product')!
    )
}