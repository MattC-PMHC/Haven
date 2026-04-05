// Grounds Crew ��� Photo Capture
//
// Mobile-first page for capturing photos on-site.
// Uses a placeholder — in production, this would use the device camera API
// and upload to Supabase Storage.

import Link from "next/link"
import { ArrowLeft, Camera, Upload, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getActiveWorkOrders } from "@/lib/mock/work-orders"

export default function GroundsPhotoCapturePage() {
  const active = getActiveWorkOrders()

  return (
    <div className="p-4 md:p-10 max-w-lg mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="animate-fade-up">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/grounds">
            <ArrowLeft className="size-4" />
            Work Orders
          </Link>
        </Button>
        <h2 className="text-2xl font-extrabold text-primary tracking-tight mb-1">
          Capture Photo
        </h2>
        <p className="text-muted-foreground text-sm">
          Take a photo and attach it to a work order.
        </p>
      </div>

      {/* ── Camera Area (placeholder) ── */}
      <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-border p-12 text-center animate-fade-up stagger-1">
        <Camera className="size-12 text-muted-foreground/40 mx-auto mb-4" />
        <Button className="rounded-xl h-14 text-lg px-8" disabled>
          <Camera className="size-6" />
          Open Camera
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Camera access will be available once the app is deployed
        </p>
      </div>

      {/* ── Or Upload ── */}
      <div className="text-center text-sm text-muted-foreground">or</div>
      <div className="bg-surface-container-lowest rounded-xl shadow-card p-6 space-y-4 animate-fade-up stagger-2">
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
          <Upload className="size-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop a photo, or tap to browse
          </p>
        </div>

        {/* ── Link to Work Order ── */}
        <div className="space-y-2">
          <Label>Attach to Work Order</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select work order" />
            </SelectTrigger>
            <SelectContent>
              {active.map((wo) => (
                <SelectItem key={wo.id} value={wo.id}>
                  {wo.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Notes (optional)</Label>
          <Textarea placeholder="Describe what the photo shows..." rows={2} />
        </div>

        <Button className="w-full rounded-xl h-12 text-base" disabled>
          <Image className="size-5" />
          Upload Photo
        </Button>
      </div>
    </div>
  )
}
