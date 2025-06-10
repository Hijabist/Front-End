"use client"

import React, { createContext, useContext } from "react"
import { cn } from "../../lib/utils"

const RadioGroupContext = createContext()

const RadioGroup = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("grid gap-2", className)} {...props} ref={ref} />
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, value, id, ...props }, ref) => {
  const context = useContext(RadioGroupContext)
  const isChecked = context?.value === value

  const handleChange = () => {
    if (context?.onValueChange) {
      context.onValueChange(value)
    }
  }

  return (
    <input
      type="radio"
      id={id}
      checked={isChecked}
      onChange={handleChange}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-gray-300 text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
