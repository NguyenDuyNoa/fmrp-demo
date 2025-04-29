'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const EmojiItem = memo(({ item, isActive, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(item) // ⬅️ Gọi đúng `handleActiveEmoji(item)`
        }
    }

    return (
        <motion.div
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            className={`${isActive ? 'shadow-[0px_0px_6.2px_0px_#FFE89599]' : 'mix-blend-luminosity'} rounded-full w-16 h-auto aspect-1 cursor-pointer`}
            onClick={handleClick} // ⬅️ Bắt sự kiện click ở đây
        >
            <Image
                src={item?.link_svg ?? '/icon/default/default.png'}
                width={100}
                height={100}
                priority
                alt="emoji"
                className="size-full object-contain"
            />
        </motion.div>
    )
})

EmojiItem.displayName = 'EmojiItem'
export default EmojiItem
