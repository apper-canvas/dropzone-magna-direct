import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import UploadProgress from "@/components/molecules/UploadProgress";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import { useFileUpload } from "@/hooks/useFileUpload";
import { AnimatePresence } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();
  const {
    files,
    isUploading,
    uploadStats,
    uploadFiles,
    retryUpload,
    removeFile,
    clearAllFiles
  } = useFileUpload();

  const handleFilesSelected = (selectedFiles) => {
    uploadFiles(selectedFiles);
  };

  const handleDownload = (file) => {
    // Create a download link
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentUploadingFile = files.find(file => file.status === "uploading");
  const completedFiles = files.filter(file => file.status === "completed");
  const recentFiles = files.slice(0, 5); // Show only recent 5 files

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-primary-700 to-primary-600 bg-clip-text text-transparent mb-4">
          Upload Files with Confidence
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Drag and drop your files or click to browse. 
          Experience lightning-fast uploads with real-time progress tracking.
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DropZone
          onFilesSelected={handleFilesSelected}
          allowedTypes={[]} // Allow all file types
          maxFileSize={50 * 1024 * 1024} // 50MB
          multiple={true}
          disabled={isUploading}
        />
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {(isUploading || uploadStats.totalFiles > 0) && (
          <UploadProgress
            files={files}
            totalFiles={uploadStats.totalFiles}
            completedFiles={uploadStats.completedFiles}
            totalSize={uploadStats.totalSize}
            currentFile={currentUploadingFile}
          />
        )}
      </AnimatePresence>

      {/* Recent Files Section */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Recent Uploads</h2>
            <div className="flex items-center gap-3">
              {completedFiles.length > 5 && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon="FolderOpen"
                  onClick={() => navigate("/files")}
                >
                  View All Files
                </Button>
              )}
              {files.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={clearAllFiles}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {recentFiles.map(file => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={removeFile}
                  onDownload={handleDownload}
                  onRetry={retryUpload}
                  showActions={true}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {files.length === 0 && !isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Empty
            title="Ready to upload your files?"
            message="Your uploaded files will appear here. Start by selecting files or dragging them to the upload zone above."
            actionLabel="Choose Files"
            onAction={() => document.querySelector('input[type="file"]')?.click()}
            icon="CloudUpload"
          />
        </motion.div>
      )}

      {/* Stats Section */}
      {uploadStats.totalFiles > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Statistics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{uploadStats.totalFiles}</div>
              <div className="text-sm text-slate-600">Total Files</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{uploadStats.completedFiles}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600">{uploadStats.failedFiles}</div>
              <div className="text-sm text-slate-600">Failed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">
                {uploadStats.totalFiles > 0 
                  ? Math.round((uploadStats.completedFiles / uploadStats.totalFiles) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;