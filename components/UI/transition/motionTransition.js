import { motion } from "framer-motion";
const TransitionMotion = (props) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                ease: "easeOut",
                duration: 2,
            }}
        >
            {props.children}
        </motion.div>
    );
};
export default TransitionMotion;
