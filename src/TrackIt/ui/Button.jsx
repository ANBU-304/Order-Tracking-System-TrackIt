import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";
import { buttonVariants } from "./buttonVariants";

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
