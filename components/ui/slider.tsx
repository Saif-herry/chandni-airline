"use client";

import * as React from "react";
import SliderMUI from "@mui/material/Slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderMUI>) {
  return (
    <div
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
    >
      <SliderMUI
        defaultValue={defaultValue as any}
        value={value as any}
        min={min}
        max={max}
        {...props}
        sx={{
          "& .MuiSlider-thumb": {
            boxShadow: "none",
          },
        }}
      />
    </div>
  );
}

export { Slider };
