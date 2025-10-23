
import { Student, LearningPath } from './types';

export const DUMMY_STUDENTS: Student[] = [
  { id: 'S1', name: 'Thumma Abhishek Reddy', email: 'abhishek@example.com', assignedLearningPathId: 'LP1' },
  { id: 'S2', name: 'Srinivas', email: 'srinivas@example.com', assignedLearningPathId: null },
  { id: 'S3', name: 'HariCharan', email: 'haricharan@example.com', assignedLearningPathId: null },
  { id: 'S4', name: 'Ratnakar', email: 'ratnakar@example.com', assignedLearningPathId: 'LP1' },
  { id: 'S5', name: 'Himanshu', email: 'himanshu@example.com', assignedLearningPathId: null },
  { id: 'S6', name: 'Harshitha', email: 'harshitha@example.com', assignedLearningPathId: null },
];

export const DUMMY_LEARNING_PATH: LearningPath = {
  id: 'LP1',
  company: 'Innovate Inc.',
  jobDescription: 'Seeking a skilled Frontend Developer with expertise in React, TypeScript, and modern web technologies. The ideal candidate will be proficient in data structures and algorithms, and have experience with agile development methodologies.',
  topics: {
    'Data Structures & Algorithms': [
      { id: 't1', name: 'Arrays & Strings', completed: true },
      { id: 't2', name: 'Linked Lists', completed: true },
      { id: 't3', name: 'Trees & Graphs', completed: false },
      { id: 't4', name: 'Sorting & Searching', completed: false },
    ],
    'Aptitude': [
        { id: 't5', name: 'Quantitative Analysis', completed: true },
        { id: 't6', name: 'Logical Reasoning', completed: false },
    ],
    'Development': [
      { id: 't7', name: 'React Hooks', completed: true },
      { id: 't8', name: 'State Management (Context API)', completed: false },
      { id: 't9', name: 'TypeScript Fundamentals', completed: false },
      { id: 't10', name: 'REST API Integration', completed: false },
    ],
    'Cloud': [
        { id: 't11', name: 'AWS S3 Basics', completed: true },
        { id: 't12', name: 'CI/CD Pipelines', completed: false },
    ]
  }
};
