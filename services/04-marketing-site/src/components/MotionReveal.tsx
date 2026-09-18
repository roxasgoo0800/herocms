import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface MotionRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | string;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * MotionReveal: Clean, stable scroll-entrance animation.
 * Triggers once smoothly when reached, then stays permanently stable to prevent motion dizziness.
 */
export const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 0.65,
  className = '',
  style = {},
  ...rest
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{
        once: true, // Crucial: fires once, stays completely stable (no dizzying in/out repeats)
        amount: 0.12,
        margin: '0px 0px -60px 0px'
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Apple / Linear buttery curve
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export interface MotionStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const MotionStagger: React.FC<MotionStaggerProps> = ({
  children,
  staggerDelay = 0.08,
  className = '',
  style = {}
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true, // Stays stable once shown
        amount: 0.12,
        margin: '0px 0px -60px 0px'
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export const MotionItem: React.FC<HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | string;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  distance = 24,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: distance
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
