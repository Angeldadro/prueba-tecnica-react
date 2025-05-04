import { useEffect } from "react"
import { useParams } from "react-router-dom"
import AuthenticatedLayout from "../../shared/components/AuthenticatedLayout"

export default function ProductDetails() {
    const { id } = useParams() 
    
    useEffect(() => {
        console.log(id)
    }, [])

    return (
        <AuthenticatedLayout>
            <div>details {id}</div>
        </AuthenticatedLayout>
    )
}