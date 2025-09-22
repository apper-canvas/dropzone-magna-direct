import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No files uploaded yet", 
  message = "Start by uploading your first file using the upload zone above.", 
  actionLabel = "Upload Files",
  onAction,
  icon = "FolderOpen"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center mb-6 shadow-sm"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-slate-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-md"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">{message}</p>
        
        {onAction && (
          <Button
            variant="primary"
            size="lg"
            icon="Upload"
            onClick={onAction}
            className="shadow-lg"
          >
            {actionLabel}
          </Button>
        )}
      </motion.div>

      {/* Decorative illustration */}
      <div className="mt-8 relative">
        <div className="grid grid-cols-3 gap-2 opacity-30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="w-8 h-10 bg-gradient-to-b from-slate-200 to-slate-300 rounded shadow-sm"
            />
          ))}
        </div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ApperIcon name="Plus" className="w-6 h-6 text-slate-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Empty;