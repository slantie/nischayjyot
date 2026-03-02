import type {
    ViolationType,
    PaymentStatus,
    GrievanceStatus,
    GrievanceCategory,
    PriorityLevel,
    VehicleClass,
} from "@/lib/supabase/types"

// ── Violation Type Labels ─────────────────────────────────────────────────────

export const VIOLATION_TYPE_LABELS: Record<ViolationType, string> = {
    red_light: "Red Light Jumping",
    overspeeding: "Overspeeding",
    no_helmet: "No Helmet",
    no_seatbelt: "No Seatbelt",
    pillion_overload: "Pillion Overloading",
    wrong_lane: "Wrong Lane",
    parking_violation: "Parking Violation",
    signal_violation: "Signal Violation",
    document_violation: "Document Violation",
    other: "Other",
}

// ── Payment Status Labels & Colors ────────────────────────────────────────────

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    paid: "Paid",
    unpaid: "Unpaid",
    disputed: "Disputed",
    waived: "Waived",
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
    paid: "text-green-600 bg-green-50 border-green-200",
    unpaid: "text-red-600 bg-red-50 border-red-200",
    disputed: "text-yellow-600 bg-yellow-50 border-yellow-200",
    waived: "text-gray-600 bg-gray-50 border-gray-200",
}

// ── Grievance Status Labels & Colors ─────────────────────────────────────────

export const GRIEVANCE_STATUS_LABELS: Record<GrievanceStatus, string> = {
    open: "Open",
    in_progress: "In Progress",
    under_review: "Under Review",
    resolved: "Resolved",
    rejected: "Rejected",
    escalated: "Escalated",
}

export const GRIEVANCE_STATUS_COLORS: Record<GrievanceStatus, string> = {
    open: "text-blue-600 bg-blue-50 border-blue-200",
    in_progress: "text-yellow-600 bg-yellow-50 border-yellow-200",
    under_review: "text-purple-600 bg-purple-50 border-purple-200",
    resolved: "text-green-600 bg-green-50 border-green-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
    escalated: "text-orange-600 bg-orange-50 border-orange-200",
}

// ── Grievance Category Labels ─────────────────────────────────────────────────

export const GRIEVANCE_CATEGORY_LABELS: Record<GrievanceCategory, string> = {
    false_challan: "False Challan",
    wrong_amount: "Wrong Amount",
    wrong_vehicle: "Wrong Vehicle",
    duplicate_challan: "Duplicate Challan",
    payment_issue: "Payment Issue",
    other: "Other",
}

// ── Priority Labels & Colors ──────────────────────────────────────────────────

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
}

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
    low: "text-gray-600 bg-gray-50 border-gray-200",
    medium: "text-blue-600 bg-blue-50 border-blue-200",
    high: "text-orange-600 bg-orange-50 border-orange-200",
    urgent: "text-red-600 bg-red-50 border-red-200",
}

// ── Vehicle Class Labels ──────────────────────────────────────────────────────

export const VEHICLE_CLASS_LABELS: Record<VehicleClass, string> = {
    two_wheeler: "Two Wheeler",
    four_wheeler: "Four Wheeler",
    commercial: "Commercial Vehicle",
    other: "Other",
}

// ── Supported Languages ───────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "gu", label: "ગુજરાતી" },
    { code: "mr", label: "मराठी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
] as const

// ── Gujarat Cities (for ONOC pilot) ──────────────────────────────────────────

export const GUJARAT_PILOT_CITIES = [
    "Ahmedabad",
    "Rajkot",
    "Gandhinagar",
    "Vadodara",
    "Surat",
]

// ── App Routes ────────────────────────────────────────────────────────────────

export const ROUTES = {
    home: "/",
    login: "/login",
    register: "/register",
    citizen: {
        home: "/home",
        trackGrievance: "/track-grievance",
        chatbot: "/chatbot",
        feedback: "/feedback",
        faq: "/faq",
        notifications: "/notifications",
    },
    admin: {
        dashboard: "/dashboard",
        manageGrievances: "/manage-grievances",
        reports: "/reports",
        feedback: "/admin/feedback",
        manageFAQs: "/manage-faqs",
    },
}

// ── File Upload Limits ────────────────────────────────────────────────────────

export const UPLOAD_MAX_SIZE_MB = 5
export const UPLOAD_MAX_SIZE_BYTES = UPLOAD_MAX_SIZE_MB * 1024 * 1024
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"]
export const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]

// ── Pagination ────────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 10
