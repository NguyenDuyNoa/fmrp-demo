import { motion } from 'framer-motion';

const SparklesBurst = () => {
    const sparks = new Array(6).fill(0); // 6 tia sáng

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {sparks.map((_, i) => {
                const angle = (360 / sparks.length) * i;
                const x = Math.cos((angle * Math.PI) / 180) * 20;
                const y = Math.sin((angle * Math.PI) / 180) * 20;

                return (
                    <motion.span
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 0, x, y, scale: 0.5 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#0375F3]"
                    />
                );
            })}
        </div>
    );
};

export default SparklesBurst;
