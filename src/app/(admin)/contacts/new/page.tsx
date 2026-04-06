// Create new contact page.

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ContactForm } from "@/components/records/ContactForm"

export default function NewContactPage() {
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
          New Contact
        </h2>
        <p className="text-muted-foreground">
          Add a funeral director, rights holder, mason, or other contact.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card p-8 animate-fade-up stagger-1">
        <ContactForm />
      </div>
    </div>
  )
}
