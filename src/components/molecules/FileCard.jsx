import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import { formatFileSize, getFileIcon } from "@/utils/fileUtils";
import { format } from "date-fns";

const FileCard = ({ 
  file, 
  onDelete, 
  onDownload, 
  onRetry,
  className,
  showActions = true,
  ...props 
}) => {
  const getStatusBadge = () => {
    switch (file.status) {
      case "uploading":
        return (
          <Badge variant="uploading" icon="Loader2" className="animate-pulse">
            <ApperIcon name="Loader2" className="w-3 h-3 animate-spin mr-1" />
            Uploading
          </Badge>
        );
      case "completed":
        return <Badge variant="success" icon="CheckCircle">Completed</Badge>;
      case "error":
        return <Badge variant="error" icon="AlertCircle">Failed</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  const isImage = file.type?.startsWith("image/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* File Preview/Icon */}
          <div className="flex-shrink-0">
            {isImage && file.thumbnailUrl ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border">
                <img 
                  src={file.thumbnailUrl} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 flex items-center justify-center">
                <ApperIcon 
                  name={getFileIcon(file.type || "")} 
                  className="w-6 h-6 text-primary-600"
                />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 truncate text-sm">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatFileSize(file.size)}
                  {file.uploadedAt && (
                    <> • {format(new Date(file.uploadedAt), "MMM d, yyyy 'at' h:mm a")}</>
                  )}
                </p>
              </div>
              
              {getStatusBadge()}
            </div>

            {/* Upload Progress */}
            {file.status === "uploading" && (
              <div className="mb-3">
                <ProgressBar 
                  value={file.uploadProgress || 0}
                  showLabel={false}
                  size="sm"
                  className="mb-1"
                />
                <p className="text-xs text-slate-500">
                  {Math.round(file.uploadProgress || 0)}% uploaded
                </p>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-2 mt-3">
                {file.status === "completed" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Download"
                      onClick={() => onDownload?.(file)}
                      className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                    >
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ExternalLink"
                      onClick={() => window.open(file.url, "_blank")}
                      className="text-slate-600 hover:text-slate-700"
                    >
                      View
                    </Button>
                  </>
                )}
                
                {file.status === "error" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="RotateCcw"
                    onClick={() => onRetry?.(file)}
                    className="text-warning-600 hover:text-warning-700 hover:bg-warning-50"
                  >
                    Retry
                  </Button>
                )}
                
                {file.status !== "uploading" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onDelete?.(file)}
                    className="text-error-600 hover:text-error-700 hover:bg-error-50 ml-auto"
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;