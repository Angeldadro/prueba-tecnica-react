import { createPortal } from "react-dom";
import './NewProduct.css'
import Button from "../../../shared/components/common/Button/Button";
import { useState } from "react";
import { Product } from "../interfaces/Product";

interface NewProductModalProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    [key: string]: any
}

export default function NewProduct({ isOpen, setIsOpen }: NewProductModalProps) {
    const [product, setProduct] = useState<Product>({ 
        id: '',
        name: '',
        price: 0,
        stock: 0
    }) 

    const handleCloseModal = () => {
        setIsOpen(!isOpen)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const inputsNumbers = ['price']
        setProduct(prevProducto => {
            let updatedValue: string | number = value;

            if (inputsNumbers.includes(name)) {
                updatedValue = value === '' ? 0 : parseFloat(value);

                if (updatedValue.toString().split('.').length > 1) {
                    const fixed = updatedValue.toString().split('.')[1].slice(0, 2)
                    updatedValue = parseFloat(`${updatedValue.toString().split('.')[0].slice(0, 10)}.${fixed}`)
                }
            }
            return {
                ...prevProducto, 
                [name]: updatedValue,
            };
        });
    };

    const handleSubmit = () => {
        console.log(product)
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
                        />
                    </div>

                    <div>
                        <p>Price</p>
                        <input type="number" placeholder="20.00" name="price" 
                        onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <p>Stock</p>
                        <input type="number" placeholder="100.. 15" name="stock" 
                        onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="product-textare-desc">
                    <p>Description</p>

                    <textarea name="desc" id="desc"
                    placeholder="Describe your product here..."
                    onChange={handleInputChange}
                    ></textarea>
                </div>

                <div className="button-create-prd">
                    <Button onClick={handleSubmit}>Create</Button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-new-product')!
    )
}