import { validateHealthcareForm } from "@/lib/validations"

it("rejects missing firstName", () => {
  const result = validateHealthcareForm({
    lastName: "Kamau", email: "k@clinic.co.ke", phone: "0712345678",
    healthcareProviderName: "Clinic", roleInFacility: "Admin",
  })
  expect(result.ok).toBe(false)
  expect((result as any).status).toBe(400)
})

it("rejects missing email", () => {
  const result = validateHealthcareForm({
    firstName: "Jane", lastName: "Kamau", phone: "0712345678",
    healthcareProviderName: "Clinic", roleInFacility: "Admin",
  })
  expect(result.ok).toBe(false)
})

it("rejects malformed email", () => {
  const result = validateHealthcareForm({
    firstName: "Jane", lastName: "Kamau", email: "not-an-email", phone: "0712345678",
    healthcareProviderName: "Clinic", roleInFacility: "Admin",
  })
  expect(result.ok).toBe(false)
})

it("rejects phone with fewer than 9 digits", () => {
  const result = validateHealthcareForm({
    firstName: "Jane", lastName: "Kamau", email: "k@clinic.co.ke", phone: "071234",
    healthcareProviderName: "Clinic", roleInFacility: "Admin",
  })
  expect(result.ok).toBe(false)
})

it("rejects missing healthcareProviderName", () => {
  const result = validateHealthcareForm({
    firstName: "Jane", lastName: "Kamau", email: "k@clinic.co.ke", phone: "0712345678",
    roleInFacility: "Admin",
  })
  expect(result.ok).toBe(false)
})

it("rejects missing roleInFacility", () => {
  const result = validateHealthcareForm({
    firstName: "Jane", lastName: "Kamau", email: "k@clinic.co.ke", phone: "0712345678",
    healthcareProviderName: "Clinic",
  })
  expect(result.ok).toBe(false)
})

it("accepts fully valid input", () => {
  const result = validateHealthcareForm({
    firstName: "Jane", lastName: "Kamau", email: "k@clinic.co.ke", phone: "0712345678",
    healthcareProviderName: "Clinic A", roleInFacility: "Admin",
  })
  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data.email).toBe("k@clinic.co.ke")
    expect(result.data.healthcareProviderName).toBe("Clinic A")
  }
})
