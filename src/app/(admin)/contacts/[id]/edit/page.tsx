// Edit contact page — pre-fills the form with existing contact data.

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ContactForm } from "@/components/records/ContactForm"
import { getContactById } from "@/lib/queries/contacts"

interface EditContactPageProps {
  params: Promise<{ id: string }>
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id } = await params
  const contact = await getContactById(id)

  if (!contact) notFound()

  return (
    <div className="p-4 md:p-10 max-w-[900px] mx-auto w-full space-y-8">
      <div className="animate-fade-up">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Contacts
        </Link>
        <h2 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
          Edit Contact
        </h2>
        <p className="text-muted-foreground">
          {contact.first_name} {contact.last_name}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 animate-fade-up stagger-1">
        <ContactForm contact={contact} />
      </div>
    </div>
  )
}
