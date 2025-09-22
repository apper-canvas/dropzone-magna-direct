import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = React.forwardRef(({ 
  value = 0, 
  max = 100,
  className,
  showLabel = true,
  size = "md",
  variant = "primary",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };
  
  const variants = {
    primary: "from-primary-500 to-primary-600",
    success: "from-success-500 to-success-600",
    error: "from-error-500 to-error-600",
    warning: "from-warning-500 to-warning-600"
  };

  return (
    <div 
      ref={ref} 
      className={cn("w-full", className)} 
      {...props}
    >
      {showLabel && (
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        "bg-slate-200 rounded-full overflow-hidden",
        sizes[size]
      )}>
        <div 
          className={cn(
            "progress-bar-fill bg-gradient-to-r rounded-full transition-all duration-300 ease-out",
            variants[variant],
            sizes[size]
          )}
          style={{ 
            width: `${percentage}%`,
            transformOrigin: "left"
          }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;