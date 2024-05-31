import { motion } from "framer-motion";

const Zoom = (props) => {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{
                scale: 1.05,
            }}
            className="w-full"
        >
            {props.children}
        </motion.button>
    );
};
export default Zoom;
