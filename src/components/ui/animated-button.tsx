import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "default" | "lg" | "sm";
  showArrow?: boolean;
}

const AnimatedButton = ({ 
  children, 
  to, 
  href,
  onClick, 
  className,
  size = "default",
  showArrow = true
}: AnimatedButtonProps) => {
  const sizeClasses = {
    sm: "px-3 py-2 min-h-[36px] text-sm",
    default: "px-4 py-2 min-h-[40px] text-sm",
    lg: "px-8 py-2.5 min-h-[44px] text-base"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const buttonContent = (
    <>
      {/* Floating points wrapper */}
      <span className="animated-btn-points">
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
        <i className="animated-btn-point" />
      </span>

      {/* Inner content */}
      <span className="animated-btn-inner">
        {children}
        {showArrow && (
          <svg
            className={cn("animated-btn-icon", iconSizes[size])}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        )}
      </span>
    </>
  );

  const buttonClass = cn(
    "animated-btn",
    sizeClasses[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {buttonContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClass} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={buttonClass}>
      {buttonContent}
    </button>
  );
};

export { AnimatedButton };

