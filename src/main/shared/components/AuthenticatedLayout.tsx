import './styles/AuthenticatedLayout.css'
import { Navbar } from './Navbar'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="authenticated-layout">
            <Navbar />
             
            <div className="authenticated-layout_content">
                {children}
            </div>
        </section>
    )
}