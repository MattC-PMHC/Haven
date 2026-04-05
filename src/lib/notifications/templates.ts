// Email notification templates with Haven branding.
//
// Each template returns { subject, html } for a given notification type.
// The HTML follows Haven's design: navy header, clean body, earth-tone accents.
//
// NOTE: These are placeholder templates. In production, you'd use a service
// like Resend or SendGrid. For now they just generate the HTML string.

import type { NotificationType } from "@/lib/types/database"

interface TemplateData {
  recipientName: string
  title: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
}

interface TemplateResult {
  subject: string
  html: string
}

/** Subject line prefixes by notification type. */
const subjectPrefixes: Record<NotificationType, string> = {
  booking: "Booking Update",
  work_order: "Work Order",
  permit: "Permit Update",
  payment: "Payment",
  renewal: "Renewal Notice",
  system: "Haven System",
}

/**
 * Generate a Haven-branded HTML email for a notification.
 *
 * The template uses inline styles (email clients don't support <style> blocks
 * reliably). Colours match Haven's design tokens.
 */
export function renderTemplate(
  type: NotificationType,
  data: TemplateData
): TemplateResult {
  const subject = `${subjectPrefixes[type]}: ${data.title}`

  const ctaBlock = data.ctaLabel && data.ctaUrl
    ? `
      <tr>
        <td style="padding: 24px 0 0 0;">
          <a href="${data.ctaUrl}"
             style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #162839 0%, #2c3e50 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            ${data.ctaLabel}
          </a>
        </td>
      </tr>`
    : ""

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin: 0; padding: 0; background-color: #f6fafe; font-family: 'Public Sans', system-ui, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6fafe; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(23,28,31,0.04);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #162839 0%, #2c3e50 100%); padding: 28px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">
                Haven
              </h1>
              <p style="margin: 4px 0 0 0; color: rgba(255,255,255,0.65); font-size: 12px;">
                Cemetery Management Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 8px 0; color: #43474c; font-size: 14px;">
                Hi ${data.recipientName},
              </p>
              <h2 style="margin: 16px 0 12px 0; color: #162839; font-size: 18px; font-weight: 700;">
                ${data.title}
              </h2>
              <p style="margin: 0; color: #171c1f; font-size: 14px; line-height: 1.6;">
                ${data.body}
              </p>
              ${ctaBlock}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f0f4f8; border-top: 1px solid rgba(196,198,205,0.2);">
              <p style="margin: 0; color: #43474c; font-size: 12px; line-height: 1.5;">
                This is an automated notification from Haven. If you have questions, contact your council administrator.
              </p>
              <p style="margin: 8px 0 0 0; color: #43474c; font-size: 11px; opacity: 0.7;">
                &copy; ${new Date().getFullYear()} Haven Cemetery Management
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}
