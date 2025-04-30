import './styles/AuthenticatedLayout.css'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="authenticated-layout">
            <div className="authenticated-layout_content">
                {children}
            </div>
        </section>
    )
}