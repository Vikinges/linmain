import { AdminSidebar } from "@/components/admin/sidebar"
import { AppBackground } from "@/components/layout/app-background"
import { Shell } from "@/components/layout/shell"
import { requireAdmin } from "@/lib/admin"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await requireAdmin()
    return (
        <Shell className="h-full relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
            <AppBackground />
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <AdminSidebar user={session.user} />
            </div>
            <main className="md:pl-72 pb-10 flex justify-center">
                <div className="w-full max-w-7xl p-8">
                    {children}
                </div>
            </main>
        </Shell>
    )
}
