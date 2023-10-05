import { motion } from "framer-motion";

const Zoom = (props) => {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{
                scale: 1.05,
            }}
            className={props.className || "w-full"}
        >
            {props.children}
        </motion.button>
    );
};
{
    /* <motion.a
  whileHover={{ scale: 1.2 }}
  onHoverStart={e => {}}
  onHoverEnd={e => {}}
/> */
}
export default Zoom;
