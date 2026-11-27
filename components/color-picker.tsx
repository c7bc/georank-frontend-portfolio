"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (cssVar: string, value: string) => void;
}

export function ColorPicker({ label, cssVar, value, onChange }: ColorPickerProps) {
  const inputId = useId();
  const nativeValue = /^#[\da-f]{6}$/i.test(value) ? value : "#000000";

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-xs font-medium">
        {label}
      </Label>
      <div className="flex items-start gap-2">
        <input
          aria-label={label}
          type="color"
          value={nativeValue}
          onChange={(event) => onChange(cssVar, event.currentTarget.value)}
          className="size-8 cursor-pointer rounded-md border border-input p-0"
        />
        <Input
          id={inputId}
          type="text"
          placeholder={`${cssVar} value`}
          value={value}
          onChange={(event) => onChange(cssVar, event.currentTarget.value)}
          className="h-8 flex-1 text-xs"
        />
      </div>
    </div>
  );
}
