"use client";

import * as React from "react";
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function Accordion({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="accordion" className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

function AccordionItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MuiAccordion>) {
  return (
    <MuiAccordion
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      sx={{
        border: "none",
        boxShadow: "none",
        "&:before": {
          display: "none",
        },
        "&.MuiAccordion-root": {
          margin: 0,
        },
      }}
      {...props}
    >
      {children}
    </MuiAccordion>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionSummary>) {
  return (
    <AccordionSummary
      data-slot="accordion-trigger"
      expandIcon={<ChevronDown className="size-4" />}
      className={cn("", className)}
      sx={{
        padding: "1rem 0",
        textAlign: "left",
        fontSize: "0.875rem",
        fontWeight: 500,
        transition: "all",
        outline: "none",
        "&:hover": {
          textDecoration: "underline",
        },
        "&.Mui-focusVisible": {
          outline: "none",
          borderRadius: "0.375rem",
        },
      }}
      {...props}
    >
      {children}
    </AccordionSummary>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionDetails>) {
  return (
    <AccordionDetails
      data-slot="accordion-content"
      className={cn("pt-0 pb-4", className)}
      sx={{
        padding: "0",
        fontSize: "0.875rem",
      }}
      {...props}
    >
      {children}
    </AccordionDetails>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
