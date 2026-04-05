// Notification sender — writes to the notifications table and (optionally)
// sends an email via the template system.
//
// Currently this is a mock implementation. In production you'd:
//   1. Insert a row into the Supabase `notifications` table
//   2. Call an email service (Resend, SendGrid, etc.) with the rendered template
//   3. Optionally push via Supabase Realtime for the bell component
//
// For now it just logs to console and returns the notification object.

import type { Notification, NotificationType } from "@/lib/types/database"
import { renderTemplate } from "./templates"

interface SendNotificationParams {
  tenantId: string
  userId: string
  type: NotificationType
  title: string
  body: string
  linkedEntityType?: string
  linkedEntityId?: string
  /** If provided, an email will be rendered and "sent" (logged). */
  email?: {
    recipientName: string
    recipientEmail: string
    ctaLabel?: string
    ctaUrl?: string
  }
}

interface SendResult {
  notification: Notification
  emailSent: boolean
}

/**
 * Create a notification and optionally send an email.
 *
 * In the mock implementation this just builds the objects and logs them.
 * When Supabase is connected, this function would:
 *   - Insert into `notifications` table
 *   - Call the email provider API
 */
export async function sendNotification(
  params: SendNotificationParams
): Promise<SendResult> {
  // Build the notification record
  const notification: Notification = {
    id: `notif-${Date.now()}`,
    tenant_id: params.tenantId,
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    read: false,
    linked_entity_type: params.linkedEntityType ?? null,
    linked_entity_id: params.linkedEntityId ?? null,
    created_at: new Date().toISOString(),
  }

  // TODO: Insert into Supabase notifications table
  // const { error } = await supabase.from("notifications").insert(notification)

  console.log("[Haven] Notification created:", notification.id, notification.title)

  let emailSent = false

  // If email details provided, render and "send" the email
  if (params.email) {
    const template = renderTemplate(params.type, {
      recipientName: params.email.recipientName,
      title: params.title,
      body: params.body,
      ctaLabel: params.email.ctaLabel,
      ctaUrl: params.email.ctaUrl,
    })

    // TODO: Send via email provider (Resend, SendGrid, etc.)
    // await resend.emails.send({
    //   from: "Haven <notifications@haven.gov.au>",
    //   to: params.email.recipientEmail,
    //   subject: template.subject,
    //   html: template.html,
    // })

    console.log("[Haven] Email rendered:", template.subject, "->", params.email.recipientEmail)
    emailSent = true
  }

  return { notification, emailSent }
}
