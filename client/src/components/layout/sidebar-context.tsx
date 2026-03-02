'use client'

import { createContext, useContext, useState, type ReactNode } from "react"

interface SidebarContextValue {
    isCollapsed: boolean
    toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
    isCollapsed: false,
    toggle: () => { },
})

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggle = () => setIsCollapsed((prev) => !prev)

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    return useContext(SidebarContext)
}
