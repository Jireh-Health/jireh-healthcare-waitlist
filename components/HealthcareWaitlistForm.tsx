"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Phone as PhoneIcon } from "lucide-react"
import JirehLogo from "@/components/JirehLogo"
import {
  healthcareWaitlistSchema,
  type HealthcareWaitlistData,
} from "@/lib/validations"

export default function HealthcareWaitlistForm() {
  const router = useRouter()
  const [consent, setConsent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<HealthcareWaitlistData>({
    resolver: zodResolver(healthcareWaitlistSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: HealthcareWaitlistData) => {
    setSubmitError(null)
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push("/waitlist/success")
      } else {
        const body = await res.json().catch(() => ({}))
        setSubmitError(body.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    }
  }

  const isDisabled = !consent || !isValid || isSubmitting

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-sm p-6 max-w-md w-full flex flex-col gap-5">
        {/* Header */}
        <div className="flex justify-center">
          <JirehLogo />
        </div>

        <img src="/icons/create-account.png" className="w-[70px] mx-auto" alt="" aria-hidden="true" />

        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-semibold text-center">
            Partner with Jireh Health
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Join the waitlist to be among the first facilities on our relaunched
            platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {/* Row 1: First name + Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName" className="text-sm font-medium">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("firstName")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("lastName")}
              />
            </div>
          </div>

          {/* Row 2: Email address */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none">
                @
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full border border-input rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("email")}
              />
            </div>
          </div>

          {/* Row 3: Phone number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone number
            </label>
            <div className="relative">
              <PhoneIcon className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 size-4" />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className="w-full border border-input rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Row 4: Healthcare provider name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="healthcareProviderName" className="text-sm font-medium">
              Healthcare provider name
            </label>
            <input
              id="healthcareProviderName"
              type="text"
              className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("healthcareProviderName")}
            />
          </div>

          {/* Row 5: Role in care facility */}
          <div className="flex flex-col gap-1">
            <label htmlFor="roleInFacility" className="text-sm font-medium">
              Role in care facility
            </label>
            <input
              id="roleInFacility"
              type="text"
              className="border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("roleInFacility")}
            />
          </div>

          {/* Consent */}
          <div className="flex items-start gap-2">
            <input
              id="consent-checkbox"
              type="checkbox"
              className="mt-0.5 size-4 cursor-pointer"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <p className="text-sm text-muted-foreground">
              I agree to be contacted by Jireh Health by email or SMS about the
              launch, and only for that purpose.
            </p>
          </div>

          {/* Inline error */}
          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  )
}
