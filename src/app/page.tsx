import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-10">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary">
            Haven
          </h1>
          <p className="text-lg text-muted-foreground">
            Cemetery Management Platform for Australian Local Government
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Design System Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full bg-status-available-bg text-status-available border border-status-available-border">
                Available
              </Badge>
              <Badge className="rounded-full bg-status-reserved-bg text-status-reserved border border-status-reserved-border">
                Reserved
              </Badge>
              <Badge className="rounded-full bg-status-occupied-bg text-status-occupied border border-status-occupied-border">
                Occupied
              </Badge>
              <Badge className="rounded-full bg-status-restricted-bg text-status-restricted border border-status-restricted-border">
                Restricted
              </Badge>
              <Badge className="rounded-full bg-status-maintenance-bg text-status-maintenance border border-status-maintenance-border">
                Maintenance
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-surface-container-lowest p-4 shadow-card">
                <p className="text-sm text-muted-foreground">Lowest</p>
              </div>
              <div className="rounded-xl bg-surface-container-low p-4">
                <p className="text-sm text-muted-foreground">Low</p>
              </div>
              <div className="rounded-xl bg-surface-container p-4">
                <p className="text-sm text-muted-foreground">Container</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
