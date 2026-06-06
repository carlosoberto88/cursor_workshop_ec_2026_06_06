import type * as React from "react";

import { cn } from "@/lib/utils";

function Label({
  className,
  children,
  ...props
}: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is supplied by callers.
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export { Label };
