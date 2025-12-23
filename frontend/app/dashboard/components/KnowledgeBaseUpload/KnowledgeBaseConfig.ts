/**
 * Configuration for Knowledge Base Upload step
 */
export class KnowledgeBaseConfig {
  static readonly title = "Knowledge Base";
  static readonly subtitle = "Upload documents to train your voice assistant with your business knowledge";
  
  static readonly acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "text/csv": [".csv"],
    "text/plain": [".txt"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/msword": [".doc"],
  };
  
  static readonly maxFileSize = 50 * 1024 * 1024; // 50MB
  static readonly maxFiles = 10;
  
  static readonly fileTypeLabels: Record<string, { label: string; icon: string }> = {
    ".pdf": { label: "PDF Document", icon: "📄" },
    ".csv": { label: "CSV Spreadsheet", icon: "📊" },
    ".txt": { label: "Text File", icon: "📝" },
    ".docx": { label: "Word Document", icon: "📃" },
    ".doc": { label: "Word Document", icon: "📃" },
  };
  
  static readonly api = {
    endpoint: "http://localhost:8000/api/v1/knowledge-base/upload",
  };
  
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  
  static getFileExtension(filename: string): string {
    return "." + filename.split(".").pop()?.toLowerCase() || "";
  }
}

