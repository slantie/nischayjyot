'use client'

import { useState, useRef } from "react"
import { Paperclip, X, Upload, FileImage, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCloudinarySignature } from "@/actions/upload"

const MAX_FILES = 5
const MAX_SIZE_MB = 10
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]

type FileState = {
    file: File
    status: "pending" | "uploading" | "done" | "error"
    url?: string
    error?: string
}

export function EvidenceUpload({
    onUploadComplete,
    disabled = false,
}: {
    onUploadComplete: (urls: string[]) => void
    disabled?: boolean
}) {
    const [files, setFiles] = useState<FileState[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    function addFiles(incoming: FileList | null) {
        if (!incoming) return
        const toAdd: FileState[] = []
        const remaining = MAX_FILES - files.length

        for (let i = 0; i < Math.min(incoming.length, remaining); i++) {
            const file = incoming[i]
            if (!ACCEPTED.includes(file.type)) continue
            if (file.size > MAX_SIZE_MB * 1024 * 1024) continue
            // avoid duplicates by name+size
            if (files.some((f) => f.file.name === file.name && f.file.size === file.size)) continue
            toAdd.push({ file, status: "pending" })
        }
        setFiles((prev) => [...prev, ...toAdd])
    }

    function removeFile(index: number) {
        setFiles((prev) => {
            const next = prev.filter((_, i) => i !== index)
            // If all remaining are "done", update parent with current URLs
            const doneUrls = next.filter((f) => f.status === "done" && f.url).map((f) => f.url!)
            onUploadComplete(doneUrls)
            return next
        })
    }

    async function uploadAll() {
        const pending = files.filter((f) => f.status === "pending")
        if (pending.length === 0) return

        setIsUploading(true)

        // Get a single signature (valid for 1 hour) — reuse for all files
        const sigResult = await getCloudinarySignature()
        if (sigResult.error) {
            setFiles((prev) =>
                prev.map((f) =>
                    f.status === "pending" ? { ...f, status: "error", error: sigResult.error } : f
                )
            )
            setIsUploading(false)
            return
        }

        const { cloudName, apiKey, timestamp, signature, folder, uploadUrl } = sigResult.data!

        // Upload each pending file, updating state per file
        const results = await Promise.allSettled(
            pending.map(async (item) => {
                // Mark uploading
                setFiles((prev) =>
                    prev.map((f) => (f.file === item.file ? { ...f, status: "uploading" } : f))
                )

                const form = new FormData()
                form.append("file", item.file)
                form.append("api_key", apiKey)
                form.append("timestamp", String(timestamp))
                form.append("signature", signature)
                form.append("folder", folder)

                const res = await fetch(uploadUrl, { method: "POST", body: form })
                if (!res.ok) throw new Error(`Upload failed (${res.status})`)
                const json = await res.json() as { secure_url: string }
                return { file: item.file, url: json.secure_url }
            })
        )

        setFiles((prev) =>
            prev.map((f) => {
                const result = results.find(
                    (r) => r.status === "fulfilled" && r.value.file === f.file
                )
                if (result?.status === "fulfilled") {
                    return { ...f, status: "done", url: result.value.url }
                }
                const failed = results.find(
                    (r) => r.status === "rejected"
                )
                if (f.status === "uploading" && failed) {
                    return { ...f, status: "error", error: "Upload failed" }
                }
                return f
            })
        )

        setIsUploading(false)

        // Notify parent of all successfully uploaded URLs
        setFiles((prev) => {
            const doneUrls = prev.filter((f) => f.status === "done" && f.url).map((f) => f.url!)
            onUploadComplete(doneUrls)
            return prev
        })
    }

    const pendingCount = files.filter((f) => f.status === "pending").length
    const doneCount = files.filter((f) => f.status === "done").length

    return (
        <div className="space-y-3">
            {/* Drop zone / select button */}
            <div
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 transition-colors hover:bg-muted/50"
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault()
                    addFiles(e.dataTransfer.files)
                }}
            >
                <Paperclip className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                    <p className="text-sm font-medium">
                        {files.length === 0 ? "Attach evidence files" : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Images or PDF · Max {MAX_SIZE_MB}MB each · Up to {MAX_FILES} files
                    </p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED.join(",")}
                    className="hidden"
                    aria-label="Upload evidence files"
                    disabled={disabled || files.length >= MAX_FILES}
                    onChange={(e) => addFiles(e.target.files)}
                />
            </div>

            {/* File list */}
            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
                            {/* Icon */}
                            <div className="shrink-0 text-muted-foreground">
                                {item.file.type.startsWith("image/") ? (
                                    <FileImage className="h-4 w-4" />
                                ) : (
                                    <FileText className="h-4 w-4" />
                                )}
                            </div>

                            {/* Name + size */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium">{item.file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(item.file.size / 1024).toFixed(0)} KB
                                </p>
                            </div>

                            {/* Status */}
                            <div className="shrink-0">
                                {item.status === "uploading" && (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                )}
                                {item.status === "done" && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                {item.status === "error" && (
                                    <span title={item.error}><AlertCircle className="h-4 w-4 text-destructive" /></span>
                                )}
                                {item.status === "pending" && (
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="text-muted-foreground hover:text-foreground"
                                        aria-label="Remove file"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Upload button — only shown when there are pending files */}
            {pendingCount > 0 && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={uploadAll}
                    disabled={disabled || isUploading}
                    className="gap-2 w-full"
                >
                    {isUploading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                    ) : (
                        <><Upload className="h-4 w-4" /> Upload {pendingCount} file{pendingCount > 1 ? "s" : ""}</>
                    )}
                </Button>
            )}

            {doneCount > 0 && pendingCount === 0 && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {doneCount} file{doneCount > 1 ? "s" : ""} uploaded and will be attached to your grievance
                </p>
            )}
        </div>
    )
}
