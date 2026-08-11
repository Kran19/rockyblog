"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateGlobalSettings } from "@/actions/settings.actions"
import { Save } from "lucide-react"

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setMessage("")
    try {
      await updateGlobalSettings(formData)
      setMessage("Settings saved successfully!")
    } catch (err: any) {
      setMessage(err.message || "Failed to save settings")
    } finally {
      setPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div className={`text-sm p-3 rounded-md ${message.includes("success") ? "bg-green-500/15 text-green-500" : "bg-destructive/15 text-destructive"}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input id="siteName" name="siteName" required defaultValue={initialData?.siteName || "stock-247.com"} />
        <p className="text-xs text-muted-foreground">The main name of your website.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seoTitle">Default SEO Title</Label>
        <Input id="seoTitle" name="seoTitle" defaultValue={initialData?.seoTitle || ""} placeholder="e.g. Stock247 - Real-Time Market Insights & Signals" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seoDescription">Default SEO Description</Label>
        <Textarea id="seoDescription" name="seoDescription" defaultValue={initialData?.seoDescription || ""} rows={3} placeholder="A short description of your site for search engines..." />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seoKeywords">Default SEO Keywords</Label>
        <Input id="seoKeywords" name="seoKeywords" defaultValue={initialData?.seoKeywords || ""} placeholder="gaming, news, reviews, esports" />
      </div>
      
      <Button type="submit" disabled={pending} className="gap-2">
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}
