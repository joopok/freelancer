'use client';

import { CareerHistory } from '@/types';

interface CareerSectionProps {
  careers: CareerHistory[];
  onChange: (careers: CareerHistory[]) => void;
}

export default function CareerSection({ careers, onChange }: CareerSectionProps) {
  const addCareer = () => {
    onChange([
      ...careers,
      {
        companyName: '',
        position: '',
        period: {
          start: new Date(),
          end: new Date(),
        },
        description: '',
        attachments: [],
      },
    ]);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">경력 사항</h3>
        <button
          type="button"
          onClick={addCareer}
          className="text-blue-500 hover:text-blue-600"
        >
          + 경력 추가
        </button>
      </div>
      
      {careers.map((career, index) => (
        <div key={index} className="border rounded p-4 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block mb-1">회사명</label>
              <input
                type="text"
                value={career.companyName}
                onChange={(e) => {
                  const newCareers = [...careers];
                  newCareers[index].companyName = e.target.value;
                  onChange(newCareers);
                }}
                className="w-full border rounded p-2"
              />
            </div>
            {/* 다른 경력 관련 필드들... */}
          </div>
        </div>
      ))}
    </section>
  );
} 