'use client';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  accept = ".pdf,.doc,.docx", 
  label = "파일 선택" 
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        type="file"
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        accept={accept}
        onChange={handleFileChange}
      />
    </div>
  );
} 