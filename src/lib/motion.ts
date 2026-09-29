import { Variants } from "framer-motion";

// Premium easing curves for luxury feel
export const easings = {
  // Smooth and elegant - great for most animations
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  // Soft and natural - perfect for reveals
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
  // Ultra smooth - ideal for page transitions
  easeInOutQuart: [0.76, 0, 0.24, 1] as const,
  // Luxurious and premium feel
  luxury: [0.22, 0.61, 0.36, 1] as const,
  // Bouncy but refined
  softBounce: [0.34, 1.56, 0.64, 1] as const,
};

// Fade up animation - VERY VISIBLE with large y offset
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
};

// Scale up animation - VERY VISIBLE with large scale difference
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easings.easeOutExpo,
    },
  },
};

// Slide in from left - VERY VISIBLE with large offset
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
};

// Slide in from right - VERY VISIBLE with large offset
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
};

// Container with stagger effect for children - WITH OPACITY for visibility
export const staggerContainer: Variants = {
  hidden: {
    opacity: 1, // Container stays visible
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Stagger container with slower timing for premium feel
export const staggerContainerSlow: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
};

// Stagger item - VERY VISIBLE with large y offset
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easings.easeOutExpo,
    },
  },
};

// Toast/notification animation
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.88,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: 25,
    scale: 0.94,
    transition: {
      duration: 0.35,
      ease: easings.easeInOutQuart,
    },
  },
};

// Modal/dialog animation
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 15,
    transition: {
      duration: 0.3,
      ease: easings.easeInOutQuart,
    },
  },
};

// Overlay/backdrop animation
export const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
};
