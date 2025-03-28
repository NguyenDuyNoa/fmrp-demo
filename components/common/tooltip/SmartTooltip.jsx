'use client'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function SmartTooltip({
    children,
    tooltip,
    placement = 'bottom', // top | right | left | bottom
    offset = 8,
    width = 160,
    className = '',
    classNameTrigger = ''
}) {
    const triggerRef = useRef(null)
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const [arrowCoords, setArrowCoords] = useState({ left: 0, top: 0 })
    const [visible, setVisible] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const calculatePosition = () => {
        const rect = triggerRef.current.getBoundingClientRect()
        let top = 0, left = 0
        let arrowPosition = { left: 0, top: 0 }

        switch (placement) {
            case 'top':
                top = rect.top + window.scrollY - offset
                left = rect.left + window.scrollX + rect.width / 2 - width / 2
                arrowPosition = {
                    left: rect.width / 2 - 6,
                    top: rect.height + 1
                }
                break
            case 'bottom':
                top = rect.bottom + window.scrollY + offset
                left = rect.left + window.scrollX + rect.width / 2 - width / 2
                arrowPosition = {
                    left: rect.width / 2 - 6,
                    top: -6
                }
                break
            case 'left':
                top = rect.top + window.scrollY + rect.height / 2 - 10
                left = rect.left + window.scrollX - width - offset
                arrowPosition = {
                    left: width - 1,
                    top: rect.height / 2 - 6
                }
                break
            case 'right':
                top = rect.top + window.scrollY + rect.height / 2 - 10
                left = rect.right + window.scrollX + offset
                arrowPosition = {
                    left: -6,
                    top: rect.height / 2 - 6
                }
                break
        }

        // Prevent overflow from right side
        if (left + width > window.innerWidth - 16) {
            left = window.innerWidth - width - 16
        }
        if (left < 8) {
            left = 8
        }

        setCoords({ top, left })
        setArrowCoords(arrowPosition)
    }

    const handleEnter = () => {
        calculatePosition()
        setVisible(true)
    }

    const handleLeave = () => setVisible(false)

    const getArrowClasses = () => {
        const baseClasses = "absolute w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"

        switch (placement) {
            case 'top':
                return `${baseClasses} -bottom-1`
            case 'bottom':
                return `${baseClasses} -top-1`
            case 'left':
                return `${baseClasses} -right-1 -rotate-135`
            case 'right':
                return `${baseClasses} -left-1 rotate-45`
            default:
                return baseClasses
        }
    }

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                className={`${classNameTrigger} relative inline-block`}
            >
                {children}
            </div>

            {mounted && createPortal(
                <AnimatePresence>
                    {visible && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                top: coords.top,
                                left: coords.left,
                                position: 'absolute',
                                width,
                                zIndex: 99999
                            }}
                            onMouseEnter={() => setVisible(true)}
                            onMouseLeave={() => setVisible(false)}
                        >
                            <div
                                className={getArrowClasses()}
                                style={{
                                    left: arrowCoords.left,
                                    top: arrowCoords.top
                                }}
                            />
                            <div className={`bg-white border border-gray-200 rounded-md shadow-xl p-2 text-sm ${className}`}>
                                {tooltip}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}