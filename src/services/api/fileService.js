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
    return new Promise((resolve, reject) => {
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
            const fileData = {
              id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              type: file.type,
              uploadProgress: 100,
              status: "completed",
              uploadedAt: new Date().toISOString(),
              url: URL.createObjectURL(file),
              thumbnailUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
            };
            
            resolve(fileData);
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