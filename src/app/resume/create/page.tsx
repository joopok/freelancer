'use client';

import { useState } from 'react';
import { CareerHistory } from '@/types';
import FileUpload from '@/components/common/FileUpload';

export default function CreateResume() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    skills: '',
    careers: [] as CareerHistory[],
  });

  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
    // 파일 처리 로직 구현
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">이력서 등록</h2>
      <form className="space-y-6">
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
        
        <div>
          <label className="block mb-1">연락처 (*)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">주소</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">보유 기술</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            className="w-full border rounded p-2"
            placeholder="예: Java, React, Node.js"
          />
        </div>

        <div>
          <FileUpload 
            onFileSelect={handleFileSelect}
            label="경력 증명서 업로드"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          이력서 등록
        </button>
      </form>
    </div>
  );
} 