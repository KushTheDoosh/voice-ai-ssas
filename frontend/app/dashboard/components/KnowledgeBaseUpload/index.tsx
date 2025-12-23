"use client";

import { useState } from "react";
import { useOnboardingStore, KnowledgeBaseFile } from "../../store/onboardingStore";
import { KnowledgeBaseConfig } from "./KnowledgeBaseConfig";
import FileDropzone from "./FileDropzone";
import { cn } from "@/utils";

export default function KnowledgeBaseUpload() {
  const { 
    businessId, 
    knowledgeBaseFiles, 
    addKnowledgeBaseFile, 
    removeKnowledgeBaseFile,
    nextStep, 
    prevStep,
    isLoading, 
    setLoading, 
    setError 
  } = useOnboardingStore();
  
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleFilesAdded = async (files: File[]) => {
    for (const file of files) {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const ext = KnowledgeBaseConfig.getFileExtension(file.name);
      
      // Add file to store immediately for UI feedback
      const fileRecord: KnowledgeBaseFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: ext,
        file: file,
      };
      
      addKnowledgeBaseFile(fileRecord);
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
      
      // Simulate upload progress (in production, use actual upload progress)
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      }, 200);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    removeKnowledgeBaseFile(fileId);
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleUploadAll = async () => {
    if (!businessId) {
      setError("Business ID not found. Please go back and complete step 1.");
      return;
    }
    
    if (knowledgeBaseFiles.length === 0) {
      setError("Please upload at least one file");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      knowledgeBaseFiles.forEach((file) => {
        if (file.file) {
          formData.append("files", file.file);
        }
      });
      
      const response = await fetch(
        `${KnowledgeBaseConfig.api.endpoint}/${businessId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to upload files");
      }
      
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">
          {KnowledgeBaseConfig.title}
        </h2>
        <p className="text-stone-600 mt-1">
          {KnowledgeBaseConfig.subtitle}
        </p>
      </div>

      {/* Dropzone */}
      <FileDropzone 
        onFilesAdded={handleFilesAdded}
        disabled={isLoading}
        currentFileCount={knowledgeBaseFiles.length}
      />

      {/* File list */}
      {knowledgeBaseFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-stone-700">
            Uploaded Files ({knowledgeBaseFiles.length}/{KnowledgeBaseConfig.maxFiles})
          </h3>
          
          <div className="space-y-2">
            {knowledgeBaseFiles.map((file) => {
              const fileType = KnowledgeBaseConfig.fileTypeLabels[file.type] || 
                { label: "File", icon: "📄" };
              const progress = uploadProgress[file.id] || 100;
              
              return (
                <div
                  key={file.id}
                  className="relative flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100 group"
                >
                  {/* Progress bar background */}
                  {progress < 100 && (
                    <div 
                      className="absolute inset-0 bg-teal-50 rounded-xl transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  
                  <div className="relative flex items-center gap-4 flex-1">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-lg">
                      {fileType.icon}
                    </div>
                    
                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {fileType.label} • {KnowledgeBaseConfig.formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    {/* Status / Remove button */}
                    <div className="flex items-center gap-2">
                      {progress < 100 ? (
                        <span className="text-xs text-teal-600 font-medium">
                          {Math.round(progress)}%
                        </span>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className={cn(
            "px-6 py-4 rounded-xl font-semibold transition-all duration-200",
            "border border-stone-200 text-stone-700 hover:bg-stone-50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Back
        </button>
        
        <button
          onClick={handleUploadAll}
          disabled={isLoading || knowledgeBaseFiles.length === 0}
          className={cn(
            "flex-1 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200",
            "bg-stone-900 hover:bg-stone-800 shadow-lg shadow-stone-900/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-2"
          )}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

