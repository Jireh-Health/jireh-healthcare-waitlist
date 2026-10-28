import { z } from "zod"

export const healthcareWaitlistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(
    (val) => val.replace(/\D/g, "").length >= 9,
    "Phone must have at least 9 digits"
  ),
  healthcareProviderName: z.string().min(1, "Healthcare provider name is required"),
  roleInFacility: z.string().min(1, "Role in facility is required"),
})

export type HealthcareWaitlistData = z.infer<typeof healthcareWaitlistSchema>

export function validateHealthcareForm(
  body: unknown
):
  | { ok: true; data: HealthcareWaitlistData }
  | { ok: false; error: string; status: 400 } {
  const result = healthcareWaitlistSchema.safeParse(body)
  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues[0].message,
      status: 400,
    }
  }
  return { ok: true, data: result.data }
}
