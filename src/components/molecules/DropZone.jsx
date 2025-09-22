import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { validateFileType } from "@/utils/fileUtils";

const DropZone = ({ 
  onFilesSelected,
  allowedTypes = [],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  multiple = true,
  disabled = false,
  className,
  ...props 
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFiles = useCallback((files) => {
    const validFiles = [];
    const newErrors = [];

    Array.from(files).forEach(file => {
      // Size validation
      if (file.size > maxFileSize) {
        newErrors.push(`${file.name}: File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`);
        return;
      }

      // Type validation
      if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
        newErrors.push(`${file.name}: File type not supported`);
        return;
      }

      validFiles.push(file);
    });

    setErrors(newErrors);
    return validFiles;
  }, [allowedTypes, maxFileSize]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [disabled, onFilesSelected, validateFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (!files || disabled) return;

    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [disabled, onFilesSelected, validateFiles]);

  const handleBrowseClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getAcceptString = () => {
    if (allowedTypes.length === 0) return "*/*";
    return allowedTypes.join(",");
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <motion.div
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer overflow-hidden",
          isDragActive && !disabled 
            ? "border-primary-500 bg-primary-50" 
            : "border-slate-300 hover:border-primary-400 hover:bg-slate-50",
          disabled && "opacity-50 cursor-not-allowed bg-slate-100"
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-50/20 to-primary-50/10" />
        
        <div className="relative p-12 text-center">
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-100 to-primary-50 border-2 border-primary-200 mb-4"
          >
            <ApperIcon 
              name={isDragActive ? "Upload" : "CloudUpload"} 
              className={cn(
                "w-8 h-8 text-primary-600",
                isDragActive && "animate-bounce"
              )} 
            />
          </motion.div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </h3>
          
          <p className="text-slate-600 mb-6 max-w-sm mx-auto">
            {isDragActive ? (
              "Release to upload your files"
            ) : (
              <>
                Drag and drop files here, or{" "}
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="text-primary-600 hover:text-primary-700 font-medium underline decoration-2 underline-offset-2"
                >
                  browse
                </button>{" "}
                to select files
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon="FolderOpen"
              onClick={handleBrowseClick}
              disabled={disabled}
              className="shadow-lg"
            >
              Choose Files
            </Button>
            
            <div className="text-sm text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <ApperIcon name="Info" className="w-4 h-4" />
                {allowedTypes.length > 0 ? (
                  <span>Supports: {allowedTypes.join(", ")}</span>
                ) : (
                  <span>All file types supported</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="HardDrive" className="w-4 h-4" />
                <span>Max size: {Math.round(maxFileSize / (1024 * 1024))}MB per file</span>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={getAcceptString()}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </motion.div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-50 border border-error-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <ApperIcon name="AlertCircle" className="w-5 h-5 text-error-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-error-800 mb-2">Upload Errors</h4>
              <ul className="space-y-1 text-sm text-error-700">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-error-600 rounded-full" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DropZone;