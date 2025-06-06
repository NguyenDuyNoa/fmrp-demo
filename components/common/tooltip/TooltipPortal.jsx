import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export default function TooltipPortal({ children }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    return createPortal(children, document.body)
}
