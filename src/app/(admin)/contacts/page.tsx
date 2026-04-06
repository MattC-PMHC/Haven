// Contacts list — shows all contacts with type, name, organisation, email, phone.

import Link from "next/link"
import { Plus, Users, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getContacts } from "@/lib/queries/contacts"
import { deleteContactAction } from "@/lib/actions/contacts"

const contactTypeStyles: Record<string, string> = {
  rights_holder: "bg-primary-fixed text-primary border-primary/20",
  next_of_kin: "bg-info-bg text-info border-info-border",
  funeral_director: "bg-warning-bg text-warning border-warning-border",
  mason: "bg-status-maintenance-bg text-status-maintenance border-status-maintenance/20",
  contractor: "bg-surface-container-high text-muted-foreground",
  supplier: "bg-surface-container-high text-muted-foreground",
  other: "bg-surface-container-high text-muted-foreground",
}

const contactTypeLabels: Record<string, string> = {
  rights_holder: "Rights Holder",
  next_of_kin: "Next of Kin",
  funeral_director: "Funeral Director",
  mason: "Mason",
  contractor: "Contractor",
  supplier: "Supplier",
  other: "Other",
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full space-y-8">
      {/* ── Header ── */}
      <div className="flex justify-between items-end animate-fade-up">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Contacts
          </h2>
          <p className="text-muted-foreground">
            Manage funeral directors, rights holders, masons, and other contacts.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/contacts/new">
            <Plus className="size-4" />
            New Contact
          </Link>
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up stagger-1">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-primary">{contacts.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Funeral Directors</p>
          <p className="text-2xl font-bold text-warning">
            {contacts.filter((c) => c.contact_type === "funeral_director").length}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Rights Holders</p>
          <p className="text-2xl font-bold text-primary">
            {contacts.filter((c) => c.contact_type === "rights_holder").length}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-card">
          <p className="text-muted-foreground text-sm font-medium">Masons</p>
          <p className="text-2xl font-bold text-status-maintenance">
            {contacts.filter((c) => c.contact_type === "mason").length}
          </p>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card animate-fade-up stagger-2">
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No contacts yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Create your first contact to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact, i) => (
                <TableRow
                  key={contact.id}
                  className={i % 2 === 1 ? "bg-surface-container-low/50" : ""}
                >
                  <TableCell className="pl-6">
                    <span className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge className={contactTypeStyles[contact.contact_type] ?? ""}>
                      {contactTypeLabels[contact.contact_type] ?? contact.contact_type}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {contact.organisation ?? "—"}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {contact.email ?? "—"}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {contact.phone ?? "—"}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/contacts/${contact.id}/edit`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <form action={deleteContactAction}>
                        <input type="hidden" name="id" value={contact.id} />
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="size-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
