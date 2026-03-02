import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a Date or ISO string to a human-readable Indian date format.
 * e.g. "15 Jan 2024"
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * Format a Date or ISO string to a human-readable date + time string.
 * e.g. "15 Jan 2024, 09:30 AM"
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Format a number as Indian Rupee currency.
 * e.g. 1000 → "₹1,000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Normalise an Indian vehicle number to uppercase with no spaces.
 * e.g. "gj 01 uv 9043" → "GJ01UV9043"
 */
export function normaliseVehicleNumber(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, "")
}

/**
 * Returns relative time string using Intl.RelativeTimeFormat.
 * e.g. "2 hours ago", "in 3 days"
 */
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = then.getTime() - now.getTime()
  const diffSeconds = Math.round(diffMs / 1000)
  const diffMinutes = Math.round(diffSeconds / 60)
  const diffHours = Math.round(diffMinutes / 60)
  const diffDays = Math.round(diffHours / 24)

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (Math.abs(diffSeconds) < 60) return rtf.format(diffSeconds, "second")
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute")
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour")
  return rtf.format(diffDays, "day")
}

/**
 * Truncate a string to a maximum length, appending "..." if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + "..."
}
