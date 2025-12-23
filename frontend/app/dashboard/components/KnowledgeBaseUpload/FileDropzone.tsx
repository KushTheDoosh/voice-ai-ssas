"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/utils";
import { KnowledgeBaseConfig } from "./KnowledgeBaseConfig";

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
  currentFileCount: number;
}

export default function FileDropzone({ 
  onFilesAdded, 
  disabled, 
  currentFileCount 
}: FileDropzoneProps) {
  const remainingSlots = KnowledgeBaseConfig.maxFiles - currentFileCount;
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > KnowledgeBaseConfig.maxFileSize) {
        console.warn(`File ${file.name} exceeds maximum size`);
        return false;
      }
      return true;
    }).slice(0, remainingSlots);
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  }, [onFilesAdded, remainingSlots]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: KnowledgeBaseConfig.acceptedFileTypes,
    maxSize: KnowledgeBaseConfig.maxFileSize,
    maxFiles: remainingSlots,
    disabled: disabled || remainingSlots <= 0,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 cursor-pointer",
        "bg-gradient-to-b from-stone-50 to-white",
        isDragActive && !isDragReject && "border-teal-400 bg-teal-50/50 scale-[1.02]",
        isDragReject && "border-red-400 bg-red-50/50",
        !isDragActive && !disabled && "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
          isDragActive && !isDragReject && "bg-teal-100 text-teal-600 scale-110",
          isDragReject && "bg-red-100 text-red-600",
          !isDragActive && "bg-stone-100 text-stone-500"
        )}>
          {isDragReject ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
        
        {/* Text */}
        <div>
          {isDragActive && !isDragReject ? (
            <p className="text-lg font-medium text-teal-600">Drop files here...</p>
          ) : isDragReject ? (
            <p className="text-lg font-medium text-red-600">Invalid file type</p>
          ) : (
            <>
              <p className="text-lg font-medium text-stone-900">
                Drag & drop files here
              </p>
              <p className="text-stone-500 mt-1">
                or <span className="text-teal-600 font-medium">browse</span> to select files
              </p>
            </>
          )}
        </div>
        
        {/* File types */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(KnowledgeBaseConfig.fileTypeLabels).map(([ext, { label }]) => (
            <span 
              key={ext}
              className="px-3 py-1 text-xs font-medium text-stone-500 bg-stone-100 rounded-full"
            >
              {ext.toUpperCase().slice(1)}
            </span>
          ))}
        </div>
        
        {/* Limits info */}
        <p className="text-xs text-stone-400 mt-4">
          Max {KnowledgeBaseConfig.formatFileSize(KnowledgeBaseConfig.maxFileSize)} per file • 
          {remainingSlots > 0 
            ? ` ${remainingSlots} file${remainingSlots !== 1 ? 's' : ''} remaining`
            : ' Maximum files reached'
          }
        </p>
      </div>
    </div>
  );
}

