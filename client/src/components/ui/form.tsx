import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Lightweight form primitives that don't depend on react-hook-form context.
// This avoids the zodResolver/Zod v4 compatibility issue.

interface FormItemContextValue {
    id: string
}
const FormItemContext = React.createContext<FormItemContextValue>({ id: "" })

function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const id = React.useId()
    return (
        <FormItemContext.Provider value={{ id }}>
            <div className={cn("space-y-2", className)} {...props} />
        </FormItemContext.Provider>
    )
}

function FormLabel({ className, ...props }: React.ComponentPropsWithoutRef<typeof Label>) {
    const { id } = React.useContext(FormItemContext)
    return <Label htmlFor={id} className={className} {...props} />
}

function FormControl({ children }: { children: React.ReactElement<{ id?: string }> }) {
    const { id } = React.useContext(FormItemContext)
    return React.cloneElement(children, { id })
}

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function FormMessage({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) {
    if (!children) return null
    return <p className={cn("text-sm font-medium text-destructive", className)}>{children}</p>
}

export { FormItem, FormLabel, FormControl, FormDescription, FormMessage }
