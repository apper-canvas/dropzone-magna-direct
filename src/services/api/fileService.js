import filesData from "@/services/mockData/files.json";

class FileService {
  constructor() {
    this.files = [...filesData];
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.files];
  }

  async getById(id) {
    await this.delay();
    const file = this.files.find(f => f.Id === parseInt(id) || f.id === id);
    return file ? { ...file } : null;
  }
async processFileUpload(file) {
    try {
      let aiDescription = null;
      
      // Generate AI description for images
      if (file.type.startsWith("image/")) {
        try {
          // Convert file to base64 for OpenAI
          const base64Data = await this.fileToBase64(file);
          
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const result = await apperClient.functions.invoke(import.meta.env.VITE_ANALYZE_IMAGE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              imageData: base64Data,
              fileName: file.name
            })
          });
          
          if (result.success) {
            aiDescription = result.description;
          }
        } catch (error) {
          console.warn('AI analysis failed:', error);
          // Continue without AI description
        }
      }
      
      const fileData = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 100,
        status: "completed",
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        aiDescription: aiDescription
      };
      
      return fileData;
    } catch (error) {
      throw new Error(`Upload processing failed: ${error.message}`);
    }
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async create(fileData) {
    await this.delay();
    
    const newFile = {
      ...fileData,
      Id: Math.max(...this.files.map(f => f.Id), 0) + 1,
      uploadedAt: new Date().toISOString()
    };
    
    this.files.unshift(newFile);
    return { ...newFile };
  }

  async update(id, updates) {
    await this.delay();
    
    const index = this.files.findIndex(f => f.Id === parseInt(id) || f.id === id);
    if (index === -1) return null;
    
    this.files[index] = { ...this.files[index], ...updates };
    return { ...this.files[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.files.findIndex(f => f.Id === parseInt(id) || f.id === id);
    if (index === -1) return false;
    
    this.files.splice(index, 1);
    return true;
  }

async uploadFile(file, onProgress) {
    // Simulate file upload with progress
    return new Promise(async (resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate occasional upload failures (5% chance)
          if (Math.random() < 0.05) {
            reject(new Error("Upload failed - network error"));
          } else {
            this.processFileUpload(file).then(resolve).catch(reject);
          }
        }
        
        onProgress(Math.min(progress, 100));
      }, Math.random() * 200 + 100);
    });
  }

  async downloadFile(fileId) {
    await this.delay(100);
    
    const file = this.files.find(f => f.Id === parseInt(fileId) || f.id === fileId);
    if (!file) return null;
    
    // In a real app, this would trigger a download
    return {
      url: file.url,
      filename: file.name
    };
  }

  async getUploadStats() {
    await this.delay(200);
    
    const totalFiles = this.files.length;
    const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
    const completedFiles = this.files.filter(f => f.status === "completed").length;
    const failedFiles = this.files.filter(f => f.status === "error").length;
    
    return {
      totalFiles,
      totalSize,
      completedFiles,
      failedFiles,
      successRate: totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0
    };
  }
}

export default new FileService();