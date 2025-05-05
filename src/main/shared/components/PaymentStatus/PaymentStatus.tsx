import AuthenticatedLayout from "../AuthenticatedLayout"
import './PaymentStatus.css'
import Button from "../common/Button/Button"
import Iconcheck from "../../../../assets/svgs/payment-status/Iconcheck"
import { useNavigate, useParams } from "react-router-dom"

export default function PaymentStatus() {
    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <AuthenticatedLayout>
            <div className="payment-status-container">
                <div className="payment-status-content">
                    <div className="payment-status-icon">
                        <Iconcheck />
                    </div>
                    <h1>Payment Status</h1>
                    <p>Your payment has been successfully completed.</p>
                    <strong>Order ID: {id}</strong>
                </div>

                <div>
                    <Button onClick={() => navigate(`/`)}>Go to home</Button>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}