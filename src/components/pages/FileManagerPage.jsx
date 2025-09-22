import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import fileService from "@/services/api/fileService";
import FileCard from "@/components/molecules/FileCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize } from "@/utils/fileUtils";
import { format } from "date-fns";

const FileManagerPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("uploadedAt"); // uploadedAt, name, size, type
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [filterType, setFilterType] = useState("all"); // all, images, documents, etc.
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid"); // grid, list

  // Load files
  const loadFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fileService.getAll();
      setFiles(data);
    } catch (err) {
      setError(err.message || "Failed to load files");
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Filter and sort files
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(file => {
        const type = file.type?.toLowerCase() || "";
        switch (filterType) {
          case "images":
            return type.includes("image");
          case "documents":
            return type.includes("pdf") || type.includes("document") || type.includes("word") || type.includes("text");
          case "spreadsheets":
            return type.includes("spreadsheet") || type.includes("excel");
          case "presentations":
            return type.includes("presentation") || type.includes("powerpoint");
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "type":
          aValue = a.type || "";
          bValue = b.type || "";
          break;
        case "uploadedAt":
        default:
          aValue = new Date(a.uploadedAt || 0);
          bValue = new Date(b.uploadedAt || 0);
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, searchTerm, sortBy, sortOrder, filterType]);

  // File actions
  const handleDelete = async (file) => {
    if (!window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return;
    }

    try {
      await fileService.delete(file.id);
      setFiles(prev => prev.filter(f => f.id !== file.id));
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
      toast.success(`"${file.name}" deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete "${file.name}"`);
    }
  };

  const handleDownload = async (file) => {
    try {
      const result = await fileService.downloadFile(file.id);
      if (result) {
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading "${file.name}"`);
      }
    } catch (error) {
      toast.error(`Failed to download "${file.name}"`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedFiles.size} selected files?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedFiles).map(fileId => 
        fileService.delete(fileId)
      );
      
      await Promise.all(deletePromises);
      
      setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
      setSelectedFiles(new Set());
      toast.success(`${selectedFiles.size} files deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete some files");
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    if (selectedFiles.size === filteredAndSortedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredAndSortedFiles.map(f => f.id)));
    }
  };

  // Calculate stats
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const fileTypes = [...new Set(files.map(f => f.type?.split("/")[0]).filter(Boolean))];

  if (loading) {
    return <Loading message="Loading your files..." />;
  }

  if (error) {
    return (
      <Error
        title="Failed to Load Files"
        message={error}
        onRetry={loadFiles}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">File Manager</h1>
          <p className="text-slate-600 mt-1">
            Manage and organize your uploaded files
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon="RotateCcw"
            onClick={loadFiles}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon="Upload"
            onClick={() => window.history.back()}
          >
            Upload Files
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 flex items-center justify-center">
              <ApperIcon name="Files" className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{files.length}</div>
              <div className="text-sm text-slate-600">Total Files</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-success-100 to-success-50 flex items-center justify-center">
              <ApperIcon name="HardDrive" className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{formatFileSize(totalSize)}</div>
              <div className="text-sm text-slate-600">Total Size</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 flex items-center justify-center">
              <ApperIcon name="FileType" className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{fileTypes.length}</div>
              <div className="text-sm text-slate-600">File Types</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{selectedFiles.size}</div>
              <div className="text-sm text-slate-600">Selected</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Types</option>
              <option value="images">Images</option>
              <option value="documents">Documents</option>
              <option value="spreadsheets">Spreadsheets</option>
              <option value="presentations">Presentations</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="uploadedAt-desc">Newest First</option>
              <option value="uploadedAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-desc">Largest First</option>
              <option value="size-asc">Smallest First</option>
            </select>

            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-slate-600"}`}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-slate-600"}`}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200"
          >
            <div className="flex items-center gap-3">
              <Badge variant="info">{selectedFiles.size} selected</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllFiles}
              >
                {selectedFiles.size === filteredAndSortedFiles.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                icon="Trash2"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* File List */}
      {filteredAndSortedFiles.length === 0 ? (
        <Empty
          title="No files found"
          message={searchTerm || filterType !== "all" 
            ? "No files match your current search and filter criteria. Try adjusting your filters or search terms."
            : "You haven't uploaded any files yet. Start by uploading your first file."
          }
          actionLabel="Upload Files"
          onAction={() => window.history.back()}
          icon="Search"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedFiles.map(file => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="relative"
              >
                {/* Selection checkbox */}
                <button
                  onClick={() => toggleFileSelection(file.id)}
                  className="absolute top-2 left-2 z-10 w-6 h-6 rounded border-2 border-slate-300 bg-white shadow-sm hover:border-primary-500 transition-colors"
                >
                  {selectedFiles.has(file.id) && (
                    <ApperIcon name="Check" className="w-4 h-4 text-primary-600 mx-auto" />
                  )}
                </button>

                <FileCard
                  file={file}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  showActions={true}
                  className={selectedFiles.has(file.id) ? "ring-2 ring-primary-500" : ""}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FileManagerPage;