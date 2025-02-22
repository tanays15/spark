import React from "react";
import { motion } from "framer-motion";

const ScrollAnimationWrapper = ({ children, className = "" }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollAnimationWrapper;