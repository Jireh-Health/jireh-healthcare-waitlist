import { vi, it, expect, beforeEach } from "vitest"
import { POST } from "@/app/api/waitlist/route"
import { NextRequest } from "next/server"

vi.mock("@/lib/supabase", () => ({
  supabaseClient: {
    from: vi.fn(),
  },
}))

vi.mock("@/lib/resend", () => ({
  resendClient: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  },
}))

import { supabaseClient } from "@/lib/supabase"
import { resendClient } from "@/lib/resend"

const validBody = {
  firstName: "Jane",
  lastName: "Kamau",
  email: "jane@clinic.co.ke",
  phone: "0712345678",
  healthcareProviderName: "Clinic A",
  roleInFacility: "Admin",
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(supabaseClient.from).mockReturnValue({
    insert: vi.fn().mockResolvedValue({ error: null }),
  } as any)
  vi.mocked(resendClient.emails.send).mockResolvedValue({ data: null, error: null } as any)
})

it("returns 400 on missing email", async () => {
  const { email: _e, ...body } = validBody
  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})

it("returns 400 on malformed email", async () => {
  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify({ ...validBody, email: "not-an-email" }),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})

it("returns 200 and calls supabase insert + resend on valid body", async () => {
  const mockInsert = vi.fn().mockResolvedValue({ error: null })
  vi.mocked(supabaseClient).from = vi.fn().mockReturnValue({ insert: mockInsert })
  const mockSend = vi.fn().mockResolvedValue({ error: null })
  vi.mocked(resendClient).emails = { send: mockSend } as any

  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(validBody),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
  expect(mockInsert).toHaveBeenCalledWith(
    expect.objectContaining({
      first_name: "Jane",
      last_name: "Kamau",
      email: "jane@clinic.co.ke",
      healthcare_provider_name: "Clinic A",
      role_in_facility: "Admin",
    })
  )
  expect(mockSend).toHaveBeenCalled()
})

it("returns 500 when Supabase returns error", async () => {
  const mockInsert = vi.fn().mockResolvedValue({ error: { message: "DB error" } })
  vi.mocked(supabaseClient).from = vi.fn().mockReturnValue({ insert: mockInsert })

  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(validBody),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(500)
})

it("returns 200 even when Resend fails (non-blocking)", async () => {
  const mockInsert = vi.fn().mockResolvedValue({ error: null })
  vi.mocked(supabaseClient).from = vi.fn().mockReturnValue({ insert: mockInsert })
  const mockSend = vi.fn().mockResolvedValue({ data: null, error: { message: "Email error" } })
  vi.mocked(resendClient).emails = { send: mockSend } as any

  const req = new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(validBody),
    headers: { "Content-Type": "application/json" },
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
})
