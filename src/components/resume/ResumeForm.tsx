'use client';

import { useState } from 'react';
import { CareerHistory } from '@/types';
import FileUpload from '../common/FileUpload';
import CareerSection from './CareerSection';

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    skills: '',
    careers: [] as CareerHistory[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 제출 로직 구현
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 섹션 */}
      <section>
        <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">이름 (*)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded p-2"
              required
            />
          </div>
          {/* 다른 기본 정보 필드들... */}
        </div>
      </section>

      {/* 경력 사항 섹션 */}
      <CareerSection 
        careers={formData.careers}
        onChange={(careers) => setFormData({...formData, careers})}
      />

      {/* 파일 업로드 섹션 */}
      <section>
        <h3 className="text-lg font-semibold mb-4">첨부 서류</h3>
        <FileUpload 
          onFileSelect={(file) => console.log(file)}
          label="경력 증명서 업로드"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </section>

      <button 
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        이력서 등록
      </button>
    </form>
  );
} 