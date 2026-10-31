import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-border bg-card px-4 text-base text-foreground transition-[border-color,box-shadow,background-color] duration-200 ease-smooth file:mr-3 file:rounded-full file:border-0 file:bg-mint file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary placeholder:text-muted-foreground/80 hover:border-input focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
