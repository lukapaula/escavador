import * as React from "react";
import { cn } from "../../lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("inline-flex h-10 items-center justify-center rounded bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50", className)}
      {...props}
    />
  );
}
