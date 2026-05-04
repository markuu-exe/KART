/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '' }) {
  const variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
  };

  const transition = { duration: 0.28, ease: 'easeOut' };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
