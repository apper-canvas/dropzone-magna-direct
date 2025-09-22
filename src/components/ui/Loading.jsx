import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading files...", showIcon = true }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {showIcon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-lg"
        >
          <ApperIcon name="CloudUpload" className="w-6 h-6 text-white" />
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{message}</h3>
        <p className="text-slate-600 max-w-md">
          Please wait while we process your request...
        </p>
      </motion.div>

      {/* Loading skeleton for file cards */}
      <div className="w-full max-w-2xl mt-8 space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-2 bg-slate-200 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;