import { z } from "zod"

// ── Auth Schemas ────────────────────────────────────────────────────────────────

export const signUpSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
    phone: z
        .string()
        .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    email: z.string().email("Enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100),
    dl_number: z.string().optional(),
    vehicle_number: z.string().optional(),
})

export const signInSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

// ── Profile Schemas ──────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
    full_name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/).optional(),
    permanent_address: z.string().max(500).optional(),
    vehicle_number: z.string().optional(),
    dl_number: z.string().optional(),
    preferred_language: z.string().optional(),
})

// ── Grievance Schemas ────────────────────────────────────────────────────────────

export const grievanceCategoryValues = [
    "false_challan",
    "wrong_amount",
    "wrong_vehicle",
    "duplicate_challan",
    "payment_issue",
    "other",
] as const

export const grievanceCategorySchema = z.enum(grievanceCategoryValues)

export const createGrievanceSchema = z.object({
    challan_id: z.string().uuid().optional(),
    challan_number: z.string().optional(),
    category: grievanceCategorySchema,
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(2000),
    lodged_via: z.enum(["web", "chatbot", "api"]).default("web"),
    evidence_urls: z.array(z.string().url()).max(5).optional(),
})

export const updateGrievanceStatusSchema = z.object({
    grievance_id: z.string().uuid(),
    status: z.enum([
        "open",
        "in_progress",
        "under_review",
        "resolved",
        "rejected",
        "escalated",
    ]),
    resolution_notes: z.string().max(2000).optional(),
})

export const updateGrievancePrioritySchema = z.object({
    grievance_id: z.string().uuid(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
})

// ── Feedback Schemas ─────────────────────────────────────────────────────────────

export const submitFeedbackSchema = z.object({
    grievance_id: z.string().uuid().optional(),
    satisfaction_rating: z.number().int().min(1).max(5),
    difficulties_faced: z.string().max(1000).optional(),
    suggestions: z.string().max(1000).optional(),
})

// ── FAQ Schemas ──────────────────────────────────────────────────────────────────

export const createFAQSchema = z.object({
    question: z.string().min(5).max(500),
    answer: z.string().min(10).max(5000),
    category: z.string().default("general"),
    display_order: z.number().int().default(0),
    is_published: z.boolean().default(true),
    language: z.string().default("en"),
})

export const updateFAQSchema = createFAQSchema.partial().extend({
    id: z.string().uuid(),
})

// ── Challan Schemas ──────────────────────────────────────────────────────────────

export const challanLookupSchema = z.object({
    vehicle_number: z.string().min(1, "Vehicle number is required"),
})

export const challanNumberSchema = z.object({
    challan_number: z.string().min(1, "Challan number is required"),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateGrievanceInput = z.infer<typeof createGrievanceSchema>
export type UpdateGrievanceStatusInput = z.infer<typeof updateGrievanceStatusSchema>
export type UpdateGrievancePriorityInput = z.infer<typeof updateGrievancePrioritySchema>
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>
export type CreateFAQInput = z.infer<typeof createFAQSchema>
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>
