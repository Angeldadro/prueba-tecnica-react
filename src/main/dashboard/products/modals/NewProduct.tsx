import { createPortal } from "react-dom";
import './NewProduct.css'
import Button from "../../../shared/components/common/Button/Button";

interface NewProductModalProps {
    isOpen: boolean;
    setIsOpen: (state: boolean) => void;
    [key: string]: any
}

export default function NewProduct({ isOpen, setIsOpen }: NewProductModalProps) {

    const handleCloseModal = () => {
        setIsOpen(!isOpen)
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
                        <input type="text" placeholder="Name of the product..."/>
                    </div>

                    <div>
                        <p>Price</p>
                        <input type="number" placeholder="20.00"/>
                    </div>

                    <div>
                        <p>Stock</p>
                        <input type="number" placeholder="100.. 15"/>
                    </div>
                </div>

                <div className="product-textare-desc">
                    <p>Description</p>

                    <textarea name="desc" id="desc"
                    placeholder="Describe your product here..."
                    ></textarea>
                </div>

                <div className="button-create-prd">
                    <Button>Create</Button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-new-product')!
    )
}