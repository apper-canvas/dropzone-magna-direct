import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while processing your files. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-error-500 to-error-600 flex items-center justify-center mb-6 shadow-lg"
      >
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-md"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
        
        {showRetry && (
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Button
              variant="primary"
              icon="RotateCcw"
              onClick={onRetry}
              className="shadow-lg"
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              icon="Home"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        )}
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-error-100/20 to-error-200/20 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
};

export default Error;