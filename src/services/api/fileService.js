class FileService {
  constructor() {
    this.tableName = 'file_c';
    this.apperClient = null;
  }

  // Initialize ApperClient
  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "upload_progress_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "ai_description_c"}}
        ],
        orderBy: [{"fieldName": "uploaded_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      } else {
        // Map database field names to expected field names for UI compatibility
        return response.data.map(file => ({
          Id: file.Id,
          id: file.id_c,
          name: file.name_c,
          size: file.size_c,
          type: file.type_c,
          uploadProgress: file.upload_progress_c,
          status: file.status_c,
          uploadedAt: file.uploaded_at_c,
          url: file.url_c,
          thumbnailUrl: file.thumbnail_url_c,
          aiDescription: file.ai_description_c,
          // Database field names for internal use
          id_c: file.id_c,
          name_c: file.name_c,
          size_c: file.size_c,
          type_c: file.type_c,
          upload_progress_c: file.upload_progress_c,
          status_c: file.status_c,
          uploaded_at_c: file.uploaded_at_c,
          url_c: file.url_c,
          thumbnail_url_c: file.thumbnail_url_c,
          ai_description_c: file.ai_description_c
        }));
      }
    } catch (error) {
      console.error("Error fetching files:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "upload_progress_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "uploaded_at_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "thumbnail_url_c"}},
          {"field": {"Name": "ai_description_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      } else {
        const file = response.data;
        // Map database field names to expected field names for UI compatibility
        return {
          Id: file.Id,
          id: file.id_c,
          name: file.name_c,
          size: file.size_c,
          type: file.type_c,
          uploadProgress: file.upload_progress_c,
          status: file.status_c,
          uploadedAt: file.uploaded_at_c,
          url: file.url_c,
          thumbnailUrl: file.thumbnail_url_c,
          aiDescription: file.ai_description_c,
          // Database field names for internal use
          id_c: file.id_c,
          name_c: file.name_c,
          size_c: file.size_c,
          type_c: file.type_c,
          upload_progress_c: file.upload_progress_c,
          status_c: file.status_c,
          uploaded_at_c: file.uploaded_at_c,
          url_c: file.url_c,
          thumbnail_url_c: file.thumbnail_url_c,
          ai_description_c: file.ai_description_c
        };
      }
    } catch (error) {
      console.error(`Error fetching file ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async processFileUpload(file) {
    try {
      let aiDescription = null;
      
      // Generate AI description for images
      if (file.type.startsWith("image/")) {
        try {
          // Convert file to base64 for OpenAI
          const base64Data = await this.fileToBase64(file);
          
          const apperClient = this.getApperClient();
          
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
    try {
      const params = {
        records: [
          {
            // Only include updateable fields
            id_c: fileData.id,
            name_c: fileData.name,
            size_c: fileData.size,
            type_c: fileData.type,
            upload_progress_c: fileData.uploadProgress || 0,
            status_c: fileData.status || "uploading",
            uploaded_at_c: fileData.uploadedAt || new Date().toISOString(),
            url_c: fileData.url || "",
            thumbnail_url_c: fileData.thumbnailUrl || "",
            ai_description_c: fileData.aiDescription || ""
          }
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} files:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdFile = successful[0].data;
          // Map database field names to expected field names for UI compatibility
          return {
            Id: createdFile.Id,
            id: createdFile.id_c,
            name: createdFile.name_c,
            size: createdFile.size_c,
            type: createdFile.type_c,
            uploadProgress: createdFile.upload_progress_c,
            status: createdFile.status_c,
            uploadedAt: createdFile.uploaded_at_c,
            url: createdFile.url_c,
            thumbnailUrl: createdFile.thumbnail_url_c,
            aiDescription: createdFile.ai_description_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating file:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Map UI field names to database field names
      const updateData = {};
      if (updates.id !== undefined) updateData.id_c = updates.id;
      if (updates.name !== undefined) updateData.name_c = updates.name;
      if (updates.size !== undefined) updateData.size_c = updates.size;
      if (updates.type !== undefined) updateData.type_c = updates.type;
      if (updates.uploadProgress !== undefined) updateData.upload_progress_c = updates.uploadProgress;
      if (updates.status !== undefined) updateData.status_c = updates.status;
      if (updates.uploadedAt !== undefined) updateData.uploaded_at_c = updates.uploadedAt;
      if (updates.url !== undefined) updateData.url_c = updates.url;
      if (updates.thumbnailUrl !== undefined) updateData.thumbnail_url_c = updates.thumbnailUrl;
      if (updates.aiDescription !== undefined) updateData.ai_description_c = updates.aiDescription;

      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} files:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedFile = successful[0].data;
          // Map database field names to expected field names for UI compatibility
          return {
            Id: updatedFile.Id,
            id: updatedFile.id_c,
            name: updatedFile.name_c,
            size: updatedFile.size_c,
            type: updatedFile.type_c,
            uploadProgress: updatedFile.upload_progress_c,
            status: updatedFile.status_c,
            uploadedAt: updatedFile.uploaded_at_c,
            url: updatedFile.url_c,
            thumbnailUrl: updatedFile.thumbnail_url_c,
            aiDescription: updatedFile.ai_description_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating file:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} files:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file:", error?.response?.data?.message || error);
      return false;
    }
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
    try {
      const file = await this.getById(fileId);
      if (!file) return null;
      
      // In a real app, this would trigger a download
      return {
        url: file.url,
        filename: file.name
      };
    } catch (error) {
      console.error("Error downloading file:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getUploadStats() {
    try {
      const files = await this.getAll();
      
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      const completedFiles = files.filter(f => f.status === "completed").length;
      const failedFiles = files.filter(f => f.status === "error").length;
      
      return {
        totalFiles,
        totalSize,
        completedFiles,
        failedFiles,
        successRate: totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0
      };
    } catch (error) {
      console.error("Error getting upload stats:", error?.response?.data?.message || error);
      return {
        totalFiles: 0,
        totalSize: 0,
        completedFiles: 0,
        failedFiles: 0,
        successRate: 0
      };
    }
  }
}

export default new FileService();