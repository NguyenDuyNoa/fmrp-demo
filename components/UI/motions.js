import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedDiv = ({ children, className, key, ...restProps }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: "easeOut", duration: 1 }}
        className={className}
        exit={{ opacity: 0 }}
        key={key}
        {...restProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedDiv;
