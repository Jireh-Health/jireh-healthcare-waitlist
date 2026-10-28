import { NextRequest } from "next/server"
import { validateHealthcareForm } from "@/lib/validations"
import { supabaseClient } from "@/lib/supabase"
import { resendClient } from "@/lib/resend"

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json()

  const validation = validateHealthcareForm(body)
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 })
  }

  const { firstName, lastName, email, phone, healthcareProviderName, roleInFacility } =
    validation.data

  const { error: dbError } = await supabaseClient.from("healthcare_waitlist").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    healthcare_provider_name: healthcareProviderName,
    role_in_facility: roleInFacility,
    consented_at: new Date().toISOString(),
  })

  if (dbError) {
    return Response.json({ error: "Failed to save your details. Please try again." }, { status: 500 })
  }

  const { error: emailError } = await resendClient.emails.send({
    from: "Jireh Health <noreply@jireh-health.com>",
    to: process.env.NOTIFICATION_EMAIL!,
    subject: "New healthcare waitlist sign-up",
    text: `Facility: ${healthcareProviderName}\nName: ${firstName} ${lastName}\nRole: ${roleInFacility}\nEmail: ${email}\nPhone: ${phone}`,
  })

  if (emailError) {
    console.error("Resend notification failed:", emailError)
  }

  return Response.json({ success: true }, { status: 200 })
}
