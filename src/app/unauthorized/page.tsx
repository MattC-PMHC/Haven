// Unauthorized page — shown when a logged-in user tries to access
// a page their role doesn't allow (e.g. a funeral director trying
// to access admin settings).

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <Card className="max-w-md text-center">
        <CardHeader className="items-center">
          <div className="rounded-full bg-warning-bg p-3 mb-2">
            <ShieldAlert className="size-8 text-warning" />
          </div>
          <CardTitle className="text-xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this page.
            If you believe this is an error, please contact your administrator.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
