export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  skills: string[];
  experience: CareerHistory[];
  type: 'individual' | 'company';
}

export interface CareerHistory {
  companyName: string;
  position: string;
  period: {
    start: Date;
    end: Date;
  };
  description: string;
  attachments: Attachment[];
}

export interface Attachment {
  fileName: string;
  fileType: string;
  fileUrl: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  skills: string[];
  location: string;
  salary: {
    min: number;
    max: number;
  };
  duration: string;
  budget: string;
  deadline: string;
  type: '외주' | '상주';
  description: string;
  requirements: string[];
  postDate: Date;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  quote: string;
  avatar: string;
}