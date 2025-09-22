import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Badge = React.forwardRef(({ 
  children, 
  className, 
  variant = "default",
  size = "md",
  icon,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-gradient-to-r from-success-100 to-success-50 text-success-700 border border-success-200",
    error: "bg-gradient-to-r from-error-100 to-error-50 text-error-700 border border-error-200",
    warning: "bg-gradient-to-r from-warning-100 to-warning-50 text-warning-700 border border-warning-200",
    info: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200",
    uploading: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 border border-primary-200"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="w-3 h-3" />}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;