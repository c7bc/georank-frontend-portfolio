"use client"

import React from "react"
import { ThemeCustomizer, ThemeCustomizerTrigger } from "@/components/blocks/theme-customizer"

export function ThemeCustomizerWrapper() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <ThemeCustomizer open={open} onOpenChange={setOpen} />
      <ThemeCustomizerTrigger onClick={() => setOpen(true)} />
    </>
  )
}
