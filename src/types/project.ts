export interface Statistics {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  skills: string[];
  duration: string;
  budget: string;
  deadline: string;
  type: "외주" | "상주";
  likes?: number;
  views?: number;
  proposals?: number;
  location?: string;
  level?: string;
}

export interface ActiveProject {
  id: string;
  title: string;
  freelancer: {
    name: string;
    role: string;
    avatar: string;
  };
  company: string;
  progress: number;
  startDate: string;
  endDate: string;
  skills: string[];
}
