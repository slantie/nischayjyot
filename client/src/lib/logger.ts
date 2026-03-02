/**
 * Structured server-side logger for NishchayJyot.
 * Outputs coloured, timestamped lines to the terminal.
 * Only import this in server-side files ('use server' / RSC / route handlers).
 */

type LogLevel = "debug" | "info" | "warn" | "error"

const LEVEL_COLORS: Record<LogLevel, string> = {
    debug: "\x1b[90m", // grey
    info: "\x1b[36m",  // cyan
    warn: "\x1b[33m",  // yellow
    error: "\x1b[31m", // red
}
const RESET = "\x1b[0m"
const BOLD = "\x1b[1m"
const DIM = "\x1b[2m"

function isDev() {
    return process.env.NODE_ENV !== "production"
}

function timestamp() {
    return new Date().toLocaleTimeString("en-IN", { hour12: false })
}

function formatMessage(level: LogLevel, module: string, message: string, meta?: unknown) {
    const color = LEVEL_COLORS[level]
    const ts = `${DIM}[${timestamp()}]${RESET}`
    const lvl = `${color}${BOLD}${level.toUpperCase().padEnd(5)}${RESET}`
    const mod = `${DIM}[${module}]${RESET}`
    const metaStr = meta !== undefined
        ? `\n  ${DIM}↳ ${JSON.stringify(meta, null, 2).replace(/\n/g, "\n    ")}${RESET}`
        : ""
    return `${ts} ${lvl} ${mod} ${message}${metaStr}`
}

function log(level: LogLevel, module: string, message: string, meta?: unknown) {
    // Skip debug logs in production
    if (level === "debug" && !isDev()) return

    const formatted = formatMessage(level, module, message, meta)

    if (level === "error") {
        console.error(formatted)
    } else if (level === "warn") {
        console.warn(formatted)
    } else {
        console.log(formatted)
    }
}

export function createLogger(module: string) {
    return {
        debug: (message: string, meta?: unknown) => log("debug", module, message, meta),
        info: (message: string, meta?: unknown) => log("info", module, message, meta),
        warn: (message: string, meta?: unknown) => log("warn", module, message, meta),
        error: (message: string, meta?: unknown) => log("error", module, message, meta),
    }
}

// Pre-instantiated loggers for common modules
export const authLogger = createLogger("auth")
export const grievanceLogger = createLogger("grievances")
export const challanLogger = createLogger("challans")
export const dbLogger = createLogger("db")
