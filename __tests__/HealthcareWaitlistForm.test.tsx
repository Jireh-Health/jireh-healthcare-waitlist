import { vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"
import { http, HttpResponse, delay } from "msw"
import HealthcareWaitlistForm from "@/components/HealthcareWaitlistForm"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  redirect: vi.fn(),
  usePathname: () => "/",
}))

const server = setupServer(
  http.post("/api/waitlist", () => HttpResponse.json({ ok: true }, { status: 200 }))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it("renders all 5 field labels", () => {
  render(<HealthcareWaitlistForm />)
  expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/healthcare provider name/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/role in care facility/i)).toBeInTheDocument()
})

it("submit button is disabled when consent is unchecked", async () => {
  render(<HealthcareWaitlistForm />)
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane")
  await userEvent.type(screen.getByLabelText(/last name/i), "Kamau")
  await userEvent.type(screen.getByLabelText(/email/i), "jane@clinic.co.ke")
  await userEvent.type(screen.getByLabelText(/phone/i), "0712345678")
  await userEvent.type(screen.getByLabelText(/healthcare provider name/i), "Clinic A")
  await userEvent.type(screen.getByLabelText(/role in care facility/i), "Admin")
  expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled()
})

it("submit button is enabled when all fields filled and consent checked", async () => {
  render(<HealthcareWaitlistForm />)
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane")
  await userEvent.type(screen.getByLabelText(/last name/i), "Kamau")
  await userEvent.type(screen.getByLabelText(/email/i), "jane@clinic.co.ke")
  await userEvent.type(screen.getByLabelText(/phone/i), "0712345678")
  await userEvent.type(screen.getByLabelText(/healthcare provider name/i), "Clinic A")
  await userEvent.type(screen.getByLabelText(/role in care facility/i), "Admin")
  await userEvent.click(screen.getByRole("checkbox"))
  expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled()
})

it("submit button disabled while pending", async () => {
  server.use(
    http.post("/api/waitlist", async () => {
      await delay(200)
      return HttpResponse.json({ ok: true }, { status: 200 })
    })
  )
  render(<HealthcareWaitlistForm />)
  await userEvent.type(screen.getByLabelText(/first name/i), "Jane")
  await userEvent.type(screen.getByLabelText(/last name/i), "Kamau")
  await userEvent.type(screen.getByLabelText(/email/i), "jane@clinic.co.ke")
  await userEvent.type(screen.getByLabelText(/phone/i), "0712345678")
  await userEvent.type(screen.getByLabelText(/healthcare provider name/i), "Clinic A")
  await userEvent.type(screen.getByLabelText(/role in care facility/i), "Admin")
  await userEvent.click(screen.getByRole("checkbox"))
  await userEvent.click(screen.getByRole("button", { name: /submit/i }))
  expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled()
})
