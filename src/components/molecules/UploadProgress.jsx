import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/atoms/ProgressBar";
import { formatFileSize } from "@/utils/fileUtils";

const UploadProgress = ({ 
  files = [], 
  totalFiles = 0, 
  completedFiles = 0,
  totalSize = 0,
  uploadedSize = 0,
  currentFile = null
}) => {
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;
  const isUploading = files.some(file => file.status === "uploading");

  if (!isUploading && completedFiles === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-slate-200 shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
          {isUploading ? (
            <ApperIcon name="Upload" className="w-5 h-5 text-white animate-pulse" />
          ) : (
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-slate-900">
            {isUploading ? "Uploading Files" : "Upload Complete"}
          </h3>
          <p className="text-sm text-slate-600">
            {completedFiles} of {totalFiles} files completed
            {totalSize > 0 && ` • ${formatFileSize(totalSize)} total`}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <ProgressBar
        value={overallProgress}
        showLabel={true}
        className="mb-4"
      />

      {/* Current File */}
      {currentFile && currentFile.status === "uploading" && (
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="File" className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 truncate flex-1">
              {currentFile.name}
            </span>
            <span className="text-xs text-slate-500">
              {Math.round(currentFile.uploadProgress || 0)}%
            </span>
          </div>
          <ProgressBar
            value={currentFile.uploadProgress || 0}
            showLabel={false}
            size="sm"
          />
        </div>
      )}

      {/* Files Summary */}
      {files.length > 0 && (
        <div className="mt-4 space-y-1">
          {files.slice(0, 3).map(file => (
            <div key={file.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  file.status === "completed" ? "bg-success-500" :
                  file.status === "uploading" ? "bg-primary-500 animate-pulse" :
                  file.status === "error" ? "bg-error-500" : "bg-slate-300"
                }`} />
                <span className="text-slate-700 truncate flex-1">
                  {file.name}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {file.status === "uploading" && (
                  <span className="text-primary-600 font-medium">
                    {Math.round(file.uploadProgress || 0)}%
                  </span>
                )}
                {file.status === "completed" && (
                  <ApperIcon name="Check" className="w-4 h-4 text-success-500" />
                )}
                {file.status === "error" && (
                  <ApperIcon name="AlertCircle" className="w-4 h-4 text-error-500" />
                )}
              </div>
            </div>
          ))}
          
          {files.length > 3 && (
            <p className="text-xs text-slate-500 text-center pt-1">
              +{files.length - 3} more files
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UploadProgress;