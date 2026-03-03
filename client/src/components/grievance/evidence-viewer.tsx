'use client'

import { useState } from "react"
import { FileText, X, Download, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"

function isPdf(url: string) {
    const lower = url.toLowerCase()
    return lower.includes(".pdf") || lower.includes("resource_type=raw")
}

export function EvidenceViewer({ urls }: { urls: string[] }) {
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

    if (!urls || urls.length === 0) return null

    return (
        <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {urls.map((url, i) =>
                    isPdf(url) ? (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                            <FileText className="h-8 w-8" />
                            <span>PDF {i + 1}</span>
                            <Download className="h-3 w-3" />
                        </a>
                    ) : (
                        <button
                            key={i}
                            onClick={() => setLightboxUrl(url)}
                            className="relative aspect-square overflow-hidden rounded-md border hover:ring-2 hover:ring-primary transition-all group bg-muted"
                            aria-label={`View evidence image ${i + 1}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={`Evidence ${i + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                    )
                )}
            </div>

            {lightboxUrl && (
                <Dialog open onOpenChange={() => setLightboxUrl(null)}>
                    <DialogContent className="max-w-3xl p-2">
                        <DialogTitle className="sr-only">Evidence Preview</DialogTitle>
                        <div className="relative flex min-h-96 items-center justify-center bg-muted rounded-md overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={lightboxUrl}
                                alt="Evidence full view"
                                className="max-h-[70vh] max-w-full object-contain"
                            />
                        </div>
                        <div className="flex justify-between pt-2 px-1">
                            <Button variant="outline" size="sm" asChild>
                                <a href={lightboxUrl} target="_blank" rel="noopener noreferrer" download>
                                    <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                                </a>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setLightboxUrl(null)}>
                                <X className="h-3.5 w-3.5 mr-1.5" /> Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
