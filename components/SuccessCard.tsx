import { CheckIcon } from "lucide-react"
import JirehLogo from "@/components/JirehLogo"

export default function SuccessCard() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-sm p-8 max-w-sm w-full flex flex-col items-center gap-6">
        <JirehLogo />
        <div className="w-16 h-16 rounded-full bg-[#75d6d4] flex items-center justify-center">
          <CheckIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-center">
          Your facility is on the list!
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Thank you for joining the Jireh Health waitlist. We'll send you a
          notification as soon as we relaunch, so keep an eye on your phone.
        </p>
      </div>
    </div>
  )
}
