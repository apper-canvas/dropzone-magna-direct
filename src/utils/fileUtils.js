export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (fileType) => {
  const type = fileType.toLowerCase();
  
  if (type.includes("image")) return "Image";
  if (type.includes("video")) return "Video";
  if (type.includes("audio")) return "Music";
  if (type.includes("pdf")) return "FileText";
  if (type.includes("document") || type.includes("word")) return "FileText";
  if (type.includes("spreadsheet") || type.includes("excel")) return "Calculator";
  if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation";
  if (type.includes("zip") || type.includes("rar") || type.includes("archive")) return "Archive";
  if (type.includes("code") || type.includes("javascript") || type.includes("python")) return "Code";
  
  return "File";
};

export const validateFileType = (file, allowedTypes = []) => {
  if (allowedTypes.length === 0) return true;
  
  return allowedTypes.some(type => {
    if (type === "*") return true;
    if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type.toLowerCase());
    return file.type.toLowerCase().includes(type.toLowerCase());
  });
};

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export const createFilePreview = (file) => {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};

export const simulateUpload = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate occasional upload failures (10% chance)
        if (Math.random() < 0.1) {
          reject(new Error("Upload failed - network error"));
        } else {
          resolve({
            url: URL.createObjectURL(file),
            uploadedAt: new Date()
          });
        }
      }
      
      onProgress(Math.min(progress, 100));
    }, Math.random() * 200 + 100); // Random interval between 100-300ms
  });
};