import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import fileService from "@/services/api/fileService";
import { generateFileId, createFilePreview } from "@/utils/fileUtils";

export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    totalFiles: 0,
    completedFiles: 0,
    failedFiles: 0,
    totalSize: 0
  });

  const updateFileProgress = useCallback((fileId, progress) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId 
          ? { ...file, uploadProgress: progress }
          : file
      )
    );
  }, []);

  const updateFileStatus = useCallback((fileId, status, error = null) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId 
          ? { ...file, status, error }
          : file
      )
    );
  }, []);

  const uploadFiles = useCallback(async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const newFiles = [];

    // Create file objects with initial state
    for (const file of selectedFiles) {
      const fileId = generateFileId();
      const thumbnailUrl = await createFilePreview(file);
      
      const fileObject = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: "uploading",
        uploadedAt: null,
        url: null,
        thumbnailUrl,
        originalFile: file
      };
      
      newFiles.push(fileObject);
    }

    setFiles(prevFiles => [...newFiles, ...prevFiles]);
    setUploadStats(prev => ({
      ...prev,
      totalFiles: prev.totalFiles + newFiles.length,
      totalSize: prev.totalSize + newFiles.reduce((sum, f) => sum + f.size, 0)
    }));

    // Upload files concurrently
    const uploadPromises = newFiles.map(async (fileObject) => {
      try {
        const result = await fileService.uploadFile(
          fileObject.originalFile,
          (progress) => updateFileProgress(fileObject.id, progress)
        );

        updateFileStatus(fileObject.id, "completed");
        
        // Update file with server response
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file.id === fileObject.id 
              ? { ...file, ...result, originalFile: undefined }
              : file
          )
        );

        setUploadStats(prev => ({
          ...prev,
          completedFiles: prev.completedFiles + 1
        }));

        toast.success(`${fileObject.name} uploaded successfully!`);
        
      } catch (error) {
        updateFileStatus(fileObject.id, "error", error.message);
        setUploadStats(prev => ({
          ...prev,
          failedFiles: prev.failedFiles + 1
        }));
        
        toast.error(`Failed to upload ${fileObject.name}: ${error.message}`);
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(`All files processed! ${newFiles.length} files uploaded.`);
    } catch (error) {
      console.error("Upload batch error:", error);
    } finally {
      setIsUploading(false);
    }
  }, [updateFileProgress, updateFileStatus]);

  const retryUpload = useCallback(async (file) => {
    if (!file.originalFile) {
      toast.error("Cannot retry upload - original file not found");
      return;
    }

    updateFileStatus(file.id, "uploading");
    updateFileProgress(file.id, 0);

    try {
      const result = await fileService.uploadFile(
        file.originalFile,
        (progress) => updateFileProgress(file.id, progress)
      );

      updateFileStatus(file.id, "completed");
      
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { ...f, ...result, originalFile: undefined }
            : f
        )
      );

      toast.success(`${file.name} uploaded successfully!`);
      
    } catch (error) {
      updateFileStatus(file.id, "error", error.message);
      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    }
  }, [updateFileProgress, updateFileStatus]);

  const removeFile = useCallback((fileId) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === fileId);
      if (fileToRemove) {
        setUploadStats(prev => ({
          ...prev,
          totalFiles: prev.totalFiles - 1,
          totalSize: prev.totalSize - fileToRemove.size,
          completedFiles: fileToRemove.status === "completed" ? prev.completedFiles - 1 : prev.completedFiles,
          failedFiles: fileToRemove.status === "error" ? prev.failedFiles - 1 : prev.failedFiles
        }));
      }
      return prevFiles.filter(f => f.id !== fileId);
    });
    
    toast.info("File removed from upload queue");
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setUploadStats({
      totalFiles: 0,
      completedFiles: 0,
      failedFiles: 0,
      totalSize: 0
    });
    toast.info("All files cleared");
  }, []);

  return {
    files,
    isUploading,
    uploadStats,
    uploadFiles,
    retryUpload,
    removeFile,
    clearAllFiles
  };
};