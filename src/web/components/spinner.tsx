import { motion } from "motion/react";
import { memo } from "react";

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
      className={`border-2 border-neutral-500 border-dotted rounded-full ${className}`}
      animate={{ rotateZ: "360deg" }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  );
});

export default Spinner;
