'use client';

import { motion } from 'framer-motion';

const staggeredVariants = {
    initial: { y: 0, opacity: 1, scale: 1 },
    hover: { y: -25, opacity: 0, scale: 0.9 },
};

const staggeredVariantsHover = {
    initial: { y: 25, opacity: 0, scale: 0.9, clipPath: "inset(50% 0 50% 0)" },
    hover: { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0 0% 0)" },
};

export default function HoverEffectButton({
    title = "Book Cat 1",
    icon,
    hoverTitle = "Book Cat 2",
    colorHover = "",
    reverse = false,
    className = "",
}) {
    return (
        <motion.div
            className={`${className}`}
            whileHover="hover"
            initial="initial"
            animate="initial"
            variants={{ hover: { backgroundColor: colorHover ?? "transparent" } }}
        >
            {/* Nội dung ban đầu */}
            <motion.span
                variants={staggeredVariants}
                transition={{ duration: 0.6 }}
            >
                <span>
                    {icon && reverse ? icon : null}
                </span>
                <span>
                    {title}
                </span>
                <span>
                    {icon && !reverse ? icon : null}
                </span>
            </motion.span>

            {/* Nội dung khi hover */}
            <motion.span
                className='absolute'
                variants={staggeredVariantsHover}
                transition={{ duration: 0.4 }}
            >
                {icon && reverse ? icon : null}
                {hoverTitle}
                {icon && !reverse ? icon : null}
            </motion.span>
        </motion.div>
    );
}
