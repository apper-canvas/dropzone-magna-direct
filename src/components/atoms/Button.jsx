import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-primary-500",
    secondary: "border-2 border-slate-300 hover:border-primary-500 text-slate-700 hover:text-primary-700 bg-white hover:bg-primary-50 hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 focus:ring-error-500",
    ghost: "text-slate-600 hover:text-primary-700 hover:bg-slate-100 hover:scale-[1.02] focus:ring-primary-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;