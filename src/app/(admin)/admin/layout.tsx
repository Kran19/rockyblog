import { ReactNode } from "react"
import Link from "next/link"
import { FileText, LayoutDashboard, Tags, Users, Settings, User, LogOut, Image as ImageIcon, BarChart2, ShieldCheck, MousePointerClick } from "lucide-react"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session?.user) {
    redirect("/admin/login")
  }

  const isAdmin = session.user.role === "ADMIN"

  return (
    <div className="flex flex-col md:flex-row min-h-screen pb-20 md:pb-0">
      <aside className="hidden md:block w-64 border-r bg-muted/30">
        <div className="sticky top-16 p-4">
          <div className="mb-8 px-4 flex justify-between items-center">
            <span className="font-bold text-sm tracking-widest text-muted-foreground uppercase">
              {isAdmin ? "Super Admin" : "Author Panel"}
            </span>
            <ThemeToggle />
          </div>
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link href="/admin/blogs" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors text-emerald-400">
              <FileText className="h-4 w-4" />
              Blogs & Redirects
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors text-sky-400">
              <BarChart2 className="h-4 w-4" />
              Analytics & Realtime
            </Link>
            <Link href="/admin/popup-clicks" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors text-amber-400">
              <MousePointerClick className="h-4 w-4" />
              Popup Clicks & Flow
            </Link>
            <Link href="/admin/posts" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <FileText className="h-4 w-4" />
              Posts
            </Link>
            <Link href="/admin/media" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <ImageIcon className="h-4 w-4" />
              Media
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <Tags className="h-4 w-4" />
              Categories
            </Link>
            {isAdmin && (
              <>
                <Link href="/admin/audit-logs" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                  Audit Logs
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
                  <Users className="h-4 w-4" />
                  Users
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </>
            )}
            <Link href="/admin/profile" className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-accent text-sm font-medium transition-colors">
              <User className="h-4 w-4" />
              Profile
            </Link>
            <div className="pt-4 mt-4 border-t">
              <form action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}>
                <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-4 py-2 hover:bg-destructive/10 text-destructive text-sm font-medium transition-colors cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          </nav>
        </div>
      </aside>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-50 flex items-center justify-around p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
        <Link href="/admin" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-medium">Overview</span>
        </Link>
        <Link href="/admin/popup-clicks" className="flex flex-col items-center gap-1 p-2 text-amber-400 hover:text-amber-300 transition-colors">
          <MousePointerClick className="h-5 w-5" />
          <span className="text-[10px] font-medium">Popups</span>
        </Link>
        <Link href="/admin/posts" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
          <FileText className="h-5 w-5" />
          <span className="text-[10px] font-medium">Posts</span>
        </Link>
        <Link href="/admin/media" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
          <ImageIcon className="h-5 w-5" />
          <span className="text-[10px] font-medium">Media</span>
        </Link>
        <Link href="/admin/categories" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
          <Tags className="h-5 w-5" />
          <span className="text-[10px] font-medium">Categories</span>
        </Link>
        {isAdmin && (
          <>
            <Link href="/admin/settings" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
              <Settings className="h-5 w-5" />
              <span className="text-[10px] font-medium">Settings</span>
            </Link>
          </>
        )}
        <Link href="/admin/profile" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}>
          <button type="submit" className="flex flex-col items-center gap-1 p-2 text-destructive hover:text-destructive/80 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </form>
        <div className="p-2">
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="mx-auto max-w-[1600px] w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
