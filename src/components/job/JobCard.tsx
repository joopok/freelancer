import { JobPosting } from '@/types';

interface JobCardProps {
  job: JobPosting;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <div className="flex gap-2 mb-2">
        {job.skills.map((skill) => (
          <span 
            key={skill}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-2">{job.location}</p>
      <p className="text-sm font-semibold">
        {job.salary.min}만원 ~ {job.salary.max}만원
      </p>
    </div>
  );
} 