'use client';

import Link from 'next/link';
import { mockJobs } from '@/lib/mock-data';

export default function JobList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mockJobs.map((job) => (
        <Link 
          key={job.id} 
          href={`/projects/${job.id}`}
          className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-blue-200 bg-white"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <span className={`px-2.5 py-1 text-sm rounded-full ${
                job.type === '외주' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-green-50 text-green-600'
              }`}>
                {job.type}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-3 text-gray-600">
              <span className="font-medium">{job.company}</span>
              <span>|</span>
              <span>{job.location}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-full border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">예상 기간</span>
                    <span className="font-medium text-gray-900">{job.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">예산</span>
                    <span className="font-medium text-gray-900">{job.budget}</span>
                  </div>
                </div>
                <span className="font-medium text-red-500">{job.deadline}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 