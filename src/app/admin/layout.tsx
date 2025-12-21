import { AdminSidebar } from "@/components/admin/sidebar"
import { Shell } from "@/components/layout/shell"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Shell className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <AdminSidebar />
            </div>
            <main className="md:pl-72 pb-10 flex justify-center">
                <div className="w-full max-w-7xl p-8">
                    {children}
                </div>
            </main>
        </Shell>
    )
}
