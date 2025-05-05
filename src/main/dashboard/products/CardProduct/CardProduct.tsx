import { Product } from "../interfaces/Product";
import './CardProduct.css'

// components
import Button from "../../../shared/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../stores";
import { useDispatch } from "react-redux";
import { setProductMemory } from "../../../../stores/ProductSlice";

export default function CardProduct({ item, state }: { item: Product[], state: boolean }) {
    const navigate = useNavigate()
    
    // redux
    const dispatcher: AppDispatch = useDispatch();

    const goToProduct = (item: Product) => {
        if (!item) return 
        dispatcher(setProductMemory(item))
        navigate(`/product/details/${item.id}`)
    }

    const CardDetails = ({ item }: { item: Product }) => {
        return (
            <div className="card-details-product" key={item.id}>
                <div className="product-info-content">
                    <div className="product-info">
                        <span>${item.price}</span>
                    </div>

                    <div>
                        <h2>{item.name}</h2>
                        <p>Available | {item.stock}</p>
                    </div>

                    <div className="product-info">
                        <p>{item.description ? item.description : ''}</p>
                    </div>
                </div>

                <div>
                    <Button onClick={() => {goToProduct(item)}}>See details</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="products-card">
        {!state ? item.map((item) => (
            <CardDetails key={item.id} item={item}/>
            )) : 'Loading...'
        }
        </div>
  );
}
