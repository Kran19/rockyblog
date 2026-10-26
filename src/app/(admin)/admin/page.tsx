import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { MousePointerClick, ArrowUpRight } from "lucide-react"

export const dynamic = 'force-dynamic';
export default async function AdminDashboard() {
  const postsCount = await prisma.post.count()
  const usersCount = await prisma.user.count()
  const categoriesCount = await prisma.category.count()
  const popupClicksCount = await prisma.blogClick.count({
    where: {
      OR: [
        { ctaButton: { contains: "Pop-Up", mode: "insensitive" } },
        { ctaButton: { contains: "Popup", mode: "insensitive" } },
      ],
    },
  })
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your blog's performance and metrics.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Posts</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{postsCount}</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Registered Users</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{usersCount}</div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Categories</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold">{categoriesCount}</div>
          </div>
        </div>

        <Link
          href="/admin/popup-clicks"
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-amber-400 group cursor-pointer block"
        >
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-amber-400 flex items-center gap-1.5">
              <MousePointerClick className="w-4 h-4" />
              <span>Popup Clicks</span>
            </h3>
            <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-bold text-amber-300">{popupClicksCount}</div>
            <p className="text-[11px] text-amber-400/70 mt-1">View user popup flow & metrics →</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
