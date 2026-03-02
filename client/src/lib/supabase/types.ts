export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string
                    phone: string
                    permanent_address: string | null
                    vehicle_number: string | null
                    dl_number: string | null
                    avatar_url: string | null
                    role: "citizen" | "admin" | "super_admin"
                    preferred_language: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name: string
                    phone: string
                    permanent_address?: string | null
                    vehicle_number?: string | null
                    dl_number?: string | null
                    avatar_url?: string | null
                    role?: "citizen" | "admin" | "super_admin"
                    preferred_language?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    full_name?: string
                    phone?: string
                    permanent_address?: string | null
                    vehicle_number?: string | null
                    dl_number?: string | null
                    avatar_url?: string | null
                    role?: "citizen" | "admin" | "super_admin"
                    preferred_language?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            challans: {
                Row: {
                    id: string
                    challan_number: string
                    notice_number: string | null
                    vehicle_number: string
                    dl_number: string | null
                    owner_name: string | null
                    owner_contact: string | null
                    owner_address: string | null
                    violation_date: string
                    challan_date: string
                    violation_type: ViolationType
                    violation_place: string
                    city: string
                    state: string
                    fine_amount: number
                    applicable_section: string | null
                    payment_status: PaymentStatus
                    payment_date: string | null
                    vehicle_class: VehicleClass | null
                    vehicle_make: string | null
                    cctv_image_urls: string[] | null
                    documents_impounded: boolean
                    is_onoc: boolean
                    engine_number: string | null
                    chassis_number: string | null
                    number_plate_type: NpType
                    offender_age_group: AgeGroup | null
                    offender_gender: GenderType | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    challan_number: string
                    notice_number?: string | null
                    vehicle_number: string
                    dl_number?: string | null
                    owner_name?: string | null
                    owner_contact?: string | null
                    owner_address?: string | null
                    violation_date: string
                    challan_date: string
                    violation_type: ViolationType
                    violation_place: string
                    city: string
                    state?: string
                    fine_amount: number
                    applicable_section?: string | null
                    payment_status?: PaymentStatus
                    payment_date?: string | null
                    vehicle_class?: VehicleClass | null
                    vehicle_make?: string | null
                    cctv_image_urls?: string[] | null
                    documents_impounded?: boolean
                    is_onoc?: boolean
                    engine_number?: string | null
                    chassis_number?: string | null
                    number_plate_type?: NpType
                    offender_age_group?: AgeGroup | null
                    offender_gender?: GenderType | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    payment_status?: PaymentStatus
                    payment_date?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            grievances: {
                Row: {
                    id: string
                    ticket_number: number
                    citizen_id: string
                    challan_id: string | null
                    challan_number: string | null
                    category: GrievanceCategory
                    description: string
                    evidence_urls: string[] | null
                    status: GrievanceStatus
                    priority: PriorityLevel
                    assigned_admin_id: string | null
                    resolution_notes: string | null
                    resolved_at: string | null
                    lodged_via: LodgingMethod
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    citizen_id: string
                    challan_id?: string | null
                    challan_number?: string | null
                    category: GrievanceCategory
                    description: string
                    evidence_urls?: string[] | null
                    status?: GrievanceStatus
                    priority?: PriorityLevel
                    assigned_admin_id?: string | null
                    resolution_notes?: string | null
                    resolved_at?: string | null
                    lodged_via?: LodgingMethod
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    status?: GrievanceStatus
                    priority?: PriorityLevel
                    assigned_admin_id?: string | null
                    resolution_notes?: string | null
                    resolved_at?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "grievances_citizen_id_fkey"
                        columns: ["citizen_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "grievances_challan_id_fkey"
                        columns: ["challan_id"]
                        isOneToOne: false
                        referencedRelation: "challans"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "grievances_assigned_admin_id_fkey"
                        columns: ["assigned_admin_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            grievance_timeline: {
                Row: {
                    id: string
                    grievance_id: string
                    action: string
                    actor_id: string | null
                    actor_role: "citizen" | "admin" | "super_admin" | null
                    details: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    grievance_id: string
                    action: string
                    actor_id?: string | null
                    actor_role?: "citizen" | "admin" | "super_admin" | null
                    details?: Json | null
                    created_at?: string
                }
                Update: {
                    action?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "grievance_timeline_grievance_id_fkey"
                        columns: ["grievance_id"]
                        isOneToOne: false
                        referencedRelation: "grievances"
                        referencedColumns: ["id"]
                    }
                ]
            }
            feedback: {
                Row: {
                    id: string
                    citizen_id: string
                    grievance_id: string | null
                    satisfaction_rating: number | null
                    difficulties_faced: string | null
                    suggestions: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    citizen_id: string
                    grievance_id?: string | null
                    satisfaction_rating?: number | null
                    difficulties_faced?: string | null
                    suggestions?: string | null
                    created_at?: string
                }
                Update: {
                    difficulties_faced?: string | null
                    suggestions?: string | null
                }
                Relationships: []
            }
            faqs: {
                Row: {
                    id: string
                    question: string
                    answer: string
                    category: string
                    display_order: number
                    is_published: boolean
                    language: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    question: string
                    answer: string
                    category?: string
                    display_order?: number
                    is_published?: boolean
                    language?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    question?: string
                    answer?: string
                    category?: string
                    display_order?: number
                    is_published?: boolean
                    language?: string
                    updated_at?: string
                }
                Relationships: []
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    body: string
                    type: NotificationType
                    reference_id: string | null
                    reference_type: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    body: string
                    type: NotificationType
                    reference_id?: string | null
                    reference_type?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    is_read?: boolean
                }
                Relationships: []
            }
            chat_sessions: {
                Row: {
                    id: string
                    citizen_id: string
                    messages: Json[]
                    resulted_in_grievance: boolean
                    grievance_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    citizen_id: string
                    messages?: Json[]
                    resulted_in_grievance?: boolean
                    grievance_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    messages?: Json[]
                    resulted_in_grievance?: boolean
                    grievance_id?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            analytics_snapshots: {
                Row: {
                    id: string
                    snapshot_date: string
                    metric_type: string
                    data: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    snapshot_date: string
                    metric_type: string
                    data: Json
                    created_at?: string
                }
                Update: {
                    data?: Json
                }
                Relationships: []
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: {
            user_role: "citizen" | "admin" | "super_admin"
            violation_type: ViolationType
            payment_status: PaymentStatus
            vehicle_class: VehicleClass
            np_type: NpType
            age_group: AgeGroup
            gender_type: GenderType
            grievance_category: GrievanceCategory
            grievance_status: GrievanceStatus
            priority_level: PriorityLevel
            lodging_method: LodgingMethod
            notification_type: NotificationType
        }
        CompositeTypes: Record<string, never>
    }
}

// ── Enum type aliases ──────────────────────────────────────────────────────────

export type ViolationType =
    | "red_light"
    | "overspeeding"
    | "no_helmet"
    | "no_seatbelt"
    | "pillion_overload"
    | "wrong_lane"
    | "parking_violation"
    | "signal_violation"
    | "document_violation"
    | "other"

export type PaymentStatus = "paid" | "unpaid" | "disputed" | "waived"
export type VehicleClass = "two_wheeler" | "four_wheeler" | "commercial" | "other"
export type NpType = "standard" | "non_standard"
export type AgeGroup = "below_18" | "18_30" | "30_45" | "above_45"
export type GenderType = "male" | "female" | "other"
export type GrievanceCategory =
    | "false_challan"
    | "wrong_amount"
    | "wrong_vehicle"
    | "duplicate_challan"
    | "payment_issue"
    | "other"
export type GrievanceStatus =
    | "open"
    | "in_progress"
    | "under_review"
    | "resolved"
    | "rejected"
    | "escalated"
export type PriorityLevel = "low" | "medium" | "high" | "urgent"
export type LodgingMethod = "web" | "chatbot" | "api"
export type NotificationType =
    | "grievance_update"
    | "challan_generated"
    | "payment_reminder"
    | "resolution"
    | "system"

// ── Convenience Row type aliases ───────────────────────────────────────────────

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Challan = Database["public"]["Tables"]["challans"]["Row"]
export type Grievance = Database["public"]["Tables"]["grievances"]["Row"]
export type GrievanceTimeline = Database["public"]["Tables"]["grievance_timeline"]["Row"]
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"]
export type FAQ = Database["public"]["Tables"]["faqs"]["Row"]
export type Notification = Database["public"]["Tables"]["notifications"]["Row"]
export type ChatSession = Database["public"]["Tables"]["chat_sessions"]["Row"]
export type AnalyticsSnapshot = Database["public"]["Tables"]["analytics_snapshots"]["Row"]
