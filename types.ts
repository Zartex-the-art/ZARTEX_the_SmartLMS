
export interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

export interface LearningPathCategory {
  [category: string]: string[];
}

export interface LearningPath {
  id: string;
  company: string;
  jobDescription: string;
  topics: {
    [category: string]: Topic[];
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  assignedLearningPathId: string | null;
}

export type Role = 'Admin' | 'Student' | null;
