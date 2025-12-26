import { Variants, Transition } from "framer-motion";

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

// Default transition for most animations
export const defaultTransition: Transition = {
  duration: 0.7,
  ease: easings.easeOutExpo,
};

// Faster transition for micro-interactions
export const quickTransition: Transition = {
  duration: 0.35,
  ease: easings.easeOutQuart,
};

// Slower transition for dramatic effects
export const slowTransition: Transition = {
  duration: 0.9,
  ease: easings.luxury,
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.3,
      ease: easings.easeInOutQuart,
    },
  },
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

// Fade in animation - subtle reveal
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.easeOutQuart,
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

// Stagger container with faster timing
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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

// Float animation for decorative elements
export const floatAnimation: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 0, -10],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Hover lift effect for cards
export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow: "0 25px 30px -8px rgba(0, 0, 0, 0.12), 0 12px 12px -6px rgba(0, 0, 0, 0.06)",
    transition: {
      duration: 0.35,
      ease: easings.easeOutExpo,
    },
  },
};

// Hover scale for buttons and interactive elements
export const hoverScale = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.25,
      ease: easings.easeOutQuart,
    },
  },
  tap: {
    scale: 0.97,
  },
};

// Subtle hover for links
export const hoverSubtle = {
  rest: {
    opacity: 1,
  },
  hover: {
    opacity: 0.75,
    transition: {
      duration: 0.2,
    },
  },
};

// Button hover with glow effect
export const buttonHover = {
  rest: {
    scale: 1,
    boxShadow: "0 0 0 0 rgba(22, 163, 74, 0)",
  },
  hover: {
    scale: 1.04,
    boxShadow: "0 0 25px 6px rgba(22, 163, 74, 0.35)",
    transition: {
      duration: 0.35,
      ease: easings.easeOutExpo,
    },
  },
  tap: {
    scale: 0.97,
  },
};

// Image hover zoom
export const imageHover = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.6,
      ease: easings.easeOutExpo,
    },
  },
};

// Card reveal animation - VERY VISIBLE
export const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
};

// Text reveal animation (for headlines) - VERY VISIBLE
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easings.luxury,
    },
  },
};

// Mobile menu animation
export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.35,
      ease: easings.easeInOutQuart,
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.45,
      ease: easings.easeOutExpo,
    },
  },
};

// Mobile menu item animation
export const mobileMenuItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -25,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: easings.easeOutExpo,
    },
  },
};

// Dropdown animation
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: easings.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: {
      duration: 0.18,
      ease: easings.easeInOutQuart,
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

// Accordion content animation
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.35,
        ease: easings.easeInOutQuart,
      },
      opacity: {
        duration: 0.25,
      },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.45,
        ease: easings.easeOutExpo,
      },
      opacity: {
        duration: 0.35,
        delay: 0.1,
      },
    },
  },
};

// Icon rotation animation (for chevrons, etc.)
export const iconRotate = {
  closed: {
    rotate: 0,
    transition: {
      duration: 0.35,
      ease: easings.easeOutQuart,
    },
  },
  open: {
    rotate: 180,
    transition: {
      duration: 0.35,
      ease: easings.easeOutQuart,
    },
  },
};

// Infinite scroll/marquee animation
export const marquee: Variants = {
  animate: {
    x: [0, -1920],
    transition: {
      x: {
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

// Pulse animation for attention
export const pulseVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.06, 1],
    opacity: [1, 0.75, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Shimmer/loading animation
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: "-200% 0",
  },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 1.5,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

// Spring configuration for bouncy animations
export const springConfig = {
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  bouncy: { type: "spring", stiffness: 300, damping: 15 },
  stiff: { type: "spring", stiffness: 400, damping: 30 },
};

// Helper function to create delay-based stagger
export const createStaggerDelay = (index: number, baseDelay = 0.12): Transition => ({
  delay: index * baseDelay,
  duration: 0.6,
  ease: easings.easeOutExpo,
});

// Helper for reduced motion preferences
export const getReducedMotionVariants = (variants: Variants): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
});

// Section reveal - specifically for scroll triggered sections
export const sectionReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easings.easeOutExpo,
    },
  },
};

// Blur fade in - elegant reveal with blur effect
export const blurFadeIn: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 40,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
};
