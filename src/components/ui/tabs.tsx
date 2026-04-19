"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextType {
  value: string
  onChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType>({
  value: "",
  onChange: () => {},
})

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

function Tabs({ value, onValueChange, className, children, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground gap-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext)
  const isActive = ctx.value === value

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:text-foreground",
        className
      )}
      onClick={() => ctx.onChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext)
  if (ctx.value !== value) return null

  return (
    <div className={cn("mt-2 animate-fade-in", className)} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
