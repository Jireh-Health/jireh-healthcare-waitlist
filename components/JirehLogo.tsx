import { cn } from "@/lib/utils"

type JirehLogoProps = {
  className?: string
}

export default function JirehLogo({ className }: JirehLogoProps) {
  return (
    <img
      src="/icons/full-logo.svg"
      alt="Jireh Health logo"
      className={cn("h-6 w-auto", className)}
      draggable={false}
    />
  )
}
