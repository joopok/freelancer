import JobList from '@/components/job/JobList';
import JobSearchBar from '@/components/job/JobSearchBar';

export default function JobsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">채용정보</h1>
        <a 
          href="/jobs/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          채용공고 등록
        </a>
      </div>
      
      <JobSearchBar />
      <JobList />
    </main>
  );
} 