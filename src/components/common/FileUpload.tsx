'use client';

import { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  label?: string;
  maxFileSize?: number; // 파일 크기 제한 (byte 단위)
  maxFiles?: number; // 최대 파일 개수
  multiple?: boolean; // 다중 파일 업로드 여부
  allowDragDrop?: boolean; // 드래그 앤 드롭 허용 여부
}

export default function FileUpload({ 
  onFileSelect, 
  accept = ".pdf,.doc,.docx", 
  label = "파일 선택",
  maxFileSize = 5 * 1024 * 1024, // 기본 5MB
  maxFiles = 5,
  multiple = false,
  allowDragDrop = true
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 유효성 검사
  const validateFiles = useCallback((files: File[]): File[] => {
    setError(null);
    if (files.length > maxFiles) {
      setError(`파일이 너무 많아요! ${maxFiles}개까지만 선택할 수 있어요.`);
      return [];
    }
    
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        setError(`파일이 너무 커요. ${Math.round(maxFileSize / 1024 / 1024)}MB 이하의 파일을 선택해주세요.`);
        return false;
      }
      
      const fileExtension = `.${file.name.split('.').pop()}`;
      const acceptTypes = accept.split(',');
      
      if (!acceptTypes.some(type => type.trim() === fileExtension || type.trim() === '*')) {
        setError(`이 파일 형식은 지원하지 않아요. ${accept} 형식의 파일을 선택해주세요.`);
        return false;
      }
      
      return true;
    });
    
    return validFiles;
  }, [accept, maxFileSize, maxFiles]);

  // 파일 변경 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const files = Array.from(fileList);
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onFileSelect(multiple ? validFiles : [validFiles[0]]);
    }
  };

  // 드래그 이벤트 핸들러들
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowDragDrop) setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (allowDragDrop) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (allowDragDrop) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(droppedFiles);
      
      if (validFiles.length > 0) {
        onFileSelect(multiple ? validFiles : [validFiles[0]]);
      }
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          stroke="currentColor" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        <p className="mt-2 text-sm text-gray-600">
          {allowDragDrop ? (
            <span>{isDragging ? '파일을 놓으세요' : '클릭하거나 파일을 드래그하세요'}</span>
          ) : (
            <span>클릭하여 파일을 선택하세요</span>
          )}
        </p>
        
        <p className="mt-1 text-xs text-gray-500">
          {`${accept.split(',').join(', ')} / 최대 ${Math.round(maxFileSize / 1024 / 1024)}MB${
            multiple ? ` / 최대 ${maxFiles}개` : ''
          }`}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>  {/* TONE: OK - Error message display */}
      )}
    </div>
  );
} 