"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed z-50 grid w-full gap-0 border border-white/40 bg-white/90 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] duration-300",
                // Mobile: Bottom Sheet
                "inset-x-0 bottom-0 max-h-[96vh] rounded-t-[2.5rem] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                // Desktop: Center-Top Align
                "sm:inset-x-auto sm:left-[50%] sm:top-12 sm:bottom-auto sm:translate-x-[-50%] sm:max-w-xl sm:rounded-[2.5rem] sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-top-4 sm:data-[state=open]:slide-in-from-left-1/2",
                className
            )}
            {...props}
        >
            <div className="overflow-y-auto max-h-[calc(96vh-80px)] sm:max-h-[80vh] scrollbar-hide">
                {children}
            </div>
            <DialogPrimitive.Close className="absolute right-6 top-6 rounded-2xl p-2 opacity-70 ring-offset-white transition-all hover:opacity-100 hover:bg-slate-100/50 backdrop-blur-sm focus:outline-none z-10 box-content">
                <X className="h-5 w-5 text-slate-500" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            {/* Mobile Handle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-900/5 rounded-full sm:hidden" />
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-left px-8 sm:px-10 pt-10 sm:pt-12 pb-6 border-b border-slate-900/5 shrink-0",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 p-8 sm:px-10 border-t border-slate-900/5 bg-slate-50/50 backdrop-blur-sm shrink-0",
            className
        )}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-2xl sm:text-3xl font-serif font-black italic tracking-tight text-slate-900",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-slate-500 font-medium leading-relaxed", className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
