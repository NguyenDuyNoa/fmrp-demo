// context/SheetContext.tsx
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

// type SheetData = {
//     content: ReactNode
//     position?: 'right' | 'left'
//     width?: string
// }

// type SheetContextType = {
//     openSheet: (data: SheetData) => void
//     closeSheet: () => void
//     isOpen: boolean
//     sheetData: SheetData | null
// }

const SheetContext = createContext(undefined)

export const SheetProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [sheetData, setSheetData] = useState(null)

    const openSheet = (data) => {
        setSheetData(data)
        setIsOpen(true)
    }

    const closeSheet = () => {
        setIsOpen(false)
        setSheetData(null)
    }

    return (
        <SheetContext.Provider value={{ openSheet, closeSheet, isOpen, sheetData }}>
            {children}
        </SheetContext.Provider>
    )
}

export const useSheet = () => {
    const context = useContext(SheetContext)
    if (!context) throw new Error('useSheet must be used within SheetProvider')
    return context
}
