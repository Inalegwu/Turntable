import { motion } from "motion/react";
import { memo } from "react";
import Icon from "./icon";

type Props = {
  size?: number;
  className?: string;
};

const Spinner = memo(({ size, className }: Props) => {
  return (
    <motion.div
      style={{
        width: size || 20,
        height: size || 20,
      }}
      className={`border-2 border-indigo-600 text-indigo-600 flex items-center justify-center border-dotted rounded-full ${className}`}
      animate={{ rotateZ: "360deg" }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        damping: 10,
        duration: 1,
      }}
    >
      <Icon name="Headphones" size={10} />
    </motion.div>
  );
});

export default Spinner;
